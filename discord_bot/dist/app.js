"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const discord_js_1 = __importDefault(require("discord.js"));
require('dotenv').config();
const constants_1 = require("./constants");
const discord_1 = require("./utils/discord");
const app = express_1.default();
const client = new discord_js_1.default.Client();
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.on('guildCreate', (guild) => discord_1.serverJoinHandler(guild, client));
client.on('message', (message) => discord_1.receiveMessageHandler(message));
client.login(process.env.DISCORD_SECRET);
app.get('/getDiscordBotInviteLink', (req, res) => {
    res.status(200).json({
        discordBotInviteLink: constants_1.BOT_JOIN_URL
    });
});
app.listen(constants_1.PORT, (err) => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server listening on port ${constants_1.PORT}`);
});
//# sourceMappingURL=app.js.map