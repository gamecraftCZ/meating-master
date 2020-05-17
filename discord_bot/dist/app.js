"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const discord_1 = require("./utils/discord");
const constants_1 = require("./constants");
const socket_io_1 = __importDefault(require("socket.io"));
const http_1 = __importDefault(require("http"));
require('dotenv').config();
const app = express_1.default();
app.use(cors_1.default());
const server = http_1.default.createServer(app);
const io = socket_io_1.default(server);
const client = new discord_js_1.default.Client();
io.on('connection', (socket) => {
    console.log('New client connected');
    client.on('guildCreate', () => discord_1.serverJoinHandler(socket));
    client.on('message', (message) => discord_1.receiveMessageHandler(client, message, socket));
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.on("voiceStateUpdate", (...args) => discord_1.channelUpdate(client, ...args));
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
server.listen(constants_1.WEBSOCKET_PORT, () => {
    return console.log(`websocket listening on port ${constants_1.WEBSOCKET_PORT}`);
});
//# sourceMappingURL=app.js.map