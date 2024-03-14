import express from "express";
import https from "https";
import path from "path";
import fs from "fs";
import querystring from "querystring";
import cors from "cors";

type RantData = {
    id: string;
};

const settings = JSON.parse(fs.readFileSync("settings.json", "utf8")) as {
    discordSecret: string;
    discordRedirect: string;
    discordClientId: string;
    key: string;
    cert: string;
    port: string;
    moderators: Array<string>;
    backup: Array<string>;
};

let credentials = undefined;
if (settings.key && settings.cert) {
    const privateKey = fs.readFileSync(settings.key, "utf8");
    const certificate = fs.readFileSync(settings.cert, "utf8");

    credentials = {
        key: privateKey,
        cert: certificate,
    };
}

const app = express();

if (!settings) {
    console.log("settings.json not found. Stopping...");
    process.exit(-1);
}

function YYYYMMDD(date: Date) {
    const year = date.getFullYear().toString();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
}

function backup() {
    const directory = YYYYMMDD(new Date());
    console.log(`creating backup ${directory}`);
    for (const backupDir of settings.backup) {
        const destination = path.join(backupDir, directory);
        if (!fs.existsSync(destination)) {
            fs.mkdirSync(destination, { recursive: true });
        }
        fs.copyFileSync(basePath + "/data.json", path.join(destination, "data.json"));
        fs.copyFileSync(basePath + "/pending.json", path.join(destination, "pending.json"));
    }
}

const basePath = path.join(__dirname, "..", "..", "client", "data");

backup();
setInterval(() => {
    backup();
}, 24 * 60 * 60 * 1000);
app.use(cors());
app.use(express.static(path.join(__dirname, "..", "..", "client", "build")));
app.use(express.static(basePath));

app.use(express.json());

app.get("/login", (req, res) => {
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${settings.discordClientId}&redirect_uri=${encodeURIComponent(settings.discordRedirect)}&response_type=code&scope=identify`);
});

app.get("/callback", (req, res) => {
    processAuth(querystring.parse(req.url.split("?")[1]).code as string);
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/build/index.html"));
});

const userLookup = new Map<string, string>();

app.post("/new", async (req, res) => {
    const data = req.body;
    if (userLookup.has(data.author)) {
        data.author = userLookup.get(data.author);
        processNewData(data);
        res.status(200).json({ message: "Data received successfully" });
        return;
    } else {
        res.status(401).json({ message: "not authed" });
    }
});

app.post("/modify", async (req, res) => {
    const data = req.body;
    const mod = userLookup.get(data.moderator);
    if (mod && settings.moderators.includes(mod)) {
        delete data.moderator;
        modifyId(data);
        res.status(200).json({ message: "Data received successfully" });
        return;
    } else {
        res.status(401).json({ message: "not authed" });
    }
});

app.post("/moderator", async (req, res) => {
    const data = req.body;
    const username = userLookup.get(data.token);
    if (username) {
        res.status(200).json({ moderator: settings.moderators.includes(username) });
    } else {
        res.status(401).json({ message: "login error" });
    }
});

app.post("/nick", async (req, res) => {
    const data = req.body;
    const username = userLookup.get(data.token);
    if (username) {
        res.status(200).json({ nick: username });
    } else {
        res.status(401).json({ message: "login error" });
    }
});

app.post("/approve", async (req, res) => {
    const data = req.body;
    const username = userLookup.get(data.token);
    if (username && settings.moderators.includes(username)) {
        approveId(data.id, data.allow);
        res.status(200).json({ message: "operation confirmed" });
    } else {
        res.status(401).json({ message: "login error" });
    }
});

async function processAuth(auth: string) {
    if (userLookup.get(auth)) return;
    const tokenParams = {
        client_id: settings.discordClientId,
        client_secret: settings.discordSecret,
        grant_type: "authorization_code",
        code: auth,
        redirect_uri: settings.discordRedirect,
    };

    const body = querystring.stringify(tokenParams);

    try {
        const tokenResponse = await fetch("https://discord.com/api/v10/oauth2/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            throw tokenData.error;
        } else {
            const accessToken = tokenData.access_token;

            const userResponse = await fetch("https://discord.com/api/users/@me", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            const userData = await userResponse.json();
            userLookup.set(auth, userData.username);
        }
    } catch (error) {
        console.error("Error exchanging code for token:", error);
    }
}

function generateId() {
    let r = Math.floor(Math.random() * 0xefffffff);
    return r.toString(16).padStart(8, "0");
}

function processNewData(data: any) {
    if (settings.moderators.includes(data.author)) {
        const allData = JSON.parse(fs.readFileSync(basePath + "/data.json", "utf-8"));
        data.id = generateId();
        allData.push(data);
        fs.writeFileSync(basePath + "/data.json", JSON.stringify(allData));
    } else {
        const allData = JSON.parse(fs.readFileSync(basePath + "/pending.json", "utf-8"));
        data.id = generateId();
        allData.push(data);
        fs.writeFileSync(basePath + "/pending.json", JSON.stringify(allData));
    }
}

function approveId(id: string, allow: boolean) {
    const pending: Array<RantData> = JSON.parse(fs.readFileSync(basePath + "/pending.json", "utf-8"));
    const rantIndex = pending.findIndex((r) => r.id == id);
    if (rantIndex != -1) {
        const rant = pending[rantIndex];
        pending.splice(rantIndex, 1);
        fs.writeFileSync(basePath + "/pending.json", JSON.stringify(pending));
        if (!allow) return;
        const allData: Array<RantData> = JSON.parse(fs.readFileSync(basePath + "/data.json", "utf-8"));
        allData.push(rant);
        fs.writeFileSync(basePath + "/data.json", JSON.stringify(allData));
    }
}

function modifyId(data: any) {
    const allData = JSON.parse(fs.readFileSync(basePath + "/data.json", "utf-8")) as Array<{ id: string }>;
    const idx = allData.findIndex((f) => f.id == data.id);
    allData[idx] = data;
    fs.writeFileSync(basePath + "/data.json", JSON.stringify(allData));
}

if (credentials) {
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(settings.port, () => {
        console.log(`Server is running at http://localhost:${settings.port}`);
    });
} else {
    app.listen(settings.port, () => {
        console.log(`Server is running at http://localhost:${settings.port}`);
    });
}
