import express from "express";
import path from "path";
import fs from "fs";
import querystring from "querystring";
import url from "url";

const app = express();
const port = 3000;

const settings = JSON.parse(fs.readFileSync("settings.json", "utf8")) as {
    discordSecret: string;
    discordRedirect: string;
    discordClientId: string;
    moderators: Array<string>;
};

if (!settings) {
    console.log("settings.json not found. Stopping...");
    process.exit(-1);
}

const basePath = path.join(__dirname, "..", "..", "client", "data");

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

app.post("/moderator", async (req, res) => {
    const data = req.body;
    const username = userLookup.get(data.token);
    if (username) {
        res.status(200).json({ moderator: settings.moderators.includes(username) });
    } else {
        res.status(401).json({ message: "login error" });
    }
});

async function processAuth(auth: string) {
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

function processNewData(data: any) {
    if (settings.moderators.includes(data.author)) {
        const allData = JSON.parse(fs.readFileSync(basePath + "/data.json", "utf-8"));
        allData.push(data);
        fs.writeFileSync(basePath + "/data.json", JSON.stringify(allData));
    } else {
        const allData = JSON.parse(fs.readFileSync(basePath + "/pending.json", "utf-8"));
        allData.push(data);
        fs.writeFileSync(basePath + "/pending.json", JSON.stringify(allData));
    }
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
