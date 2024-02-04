"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const querystring_1 = __importDefault(require("querystring"));
const app = (0, express_1.default)();
const port = 80;
const settings = JSON.parse(fs_1.default.readFileSync("settings.json", "utf8"));
if (!settings) {
    console.log("settings.json not found. Stopping...");
    process.exit(-1);
}
const basePath = path_1.default.join(__dirname, "..", "..", "client", "data");
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "..", "client", "build")));
app.use(express_1.default.static(basePath));
app.use(express_1.default.json());
app.get("/login", (req, res) => {
    res.redirect(`https://discord.com/api/oauth2/authorize?client_id=${settings.discordClientId}&redirect_uri=${encodeURIComponent(settings.discordRedirect)}&response_type=code&scope=identify`);
});
app.get("/callback", (req, res) => {
    processAuth(querystring_1.default.parse(req.url.split("?")[1]).code);
    res.sendFile(path_1.default.join(__dirname, "../../client/build/index.html"));
});
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../client/build/index.html"));
});
const userLookup = new Map();
app.post("/new", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    if (userLookup.has(data.author)) {
        data.author = userLookup.get(data.author);
        processNewData(data);
        res.status(200).json({ message: "Data received successfully" });
        return;
    }
    else {
        res.status(401).json({ message: "not authed" });
    }
}));
app.post("/moderator", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const username = userLookup.get(data.token);
    if (username) {
        res.status(200).json({ moderator: settings.moderators.includes(username) });
    }
    else {
        res.status(401).json({ message: "login error" });
    }
}));
function processAuth(auth) {
    return __awaiter(this, void 0, void 0, function* () {
        const tokenParams = {
            client_id: settings.discordClientId,
            client_secret: settings.discordSecret,
            grant_type: "authorization_code",
            code: auth,
            redirect_uri: settings.discordRedirect,
        };
        const body = querystring_1.default.stringify(tokenParams);
        try {
            const tokenResponse = yield fetch("https://discord.com/api/v10/oauth2/token", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body,
            });
            const tokenData = yield tokenResponse.json();
            if (tokenData.error) {
                throw tokenData.error;
            }
            else {
                const accessToken = tokenData.access_token;
                const userResponse = yield fetch("https://discord.com/api/users/@me", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                const userData = yield userResponse.json();
                userLookup.set(auth, userData.username);
            }
        }
        catch (error) {
            console.error("Error exchanging code for token:", error);
        }
    });
}
function processNewData(data) {
    if (settings.moderators.includes(data.author)) {
        const allData = JSON.parse(fs_1.default.readFileSync(basePath + "/data.json", "utf-8"));
        allData.push(data);
        fs_1.default.writeFileSync(basePath + "/data.json", JSON.stringify(allData));
    }
    else {
        const allData = JSON.parse(fs_1.default.readFileSync(basePath + "/pending.json", "utf-8"));
        allData.push(data);
        fs_1.default.writeFileSync(basePath + "/pending.json", JSON.stringify(allData));
    }
}
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
