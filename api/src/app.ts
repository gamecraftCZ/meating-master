import Discord from 'discord.js';
import {channelUpdate, receiveMessageHandler, serverJoinHandler, leaveChannel} from './utils/discord_handlers';
import express from 'express';
import cors from 'cors';
import { BOT_JOIN_URL, PORT, WEBSOCKET_PORT } from './constants';
import socketIo from 'socket.io';
import http from 'http';

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = socketIo(server);

const client = new Discord.Client();

let SOCKET;

io.on('connection', (socket) => {
	SOCKET = socket;
	console.log('New client connected');

	client.on('guildCreate', () => serverJoinHandler(socket));
	client.on('message', (message) => receiveMessageHandler(client, message, socket));
	
	app.get('/leaveDiscordChannel', (req, res) => {
		leaveChannel(SOCKET);
		return res.status(200).send();
	});

	socket.on('disconnect', () => {
		console.log('Client disconnected');
	});
});

client.on("voiceStateUpdate", (...args) => channelUpdate(client, ...args))

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on("voiceStateUpdate", (...args) => channelUpdate(client, ...args))

client.login(process.env.DISCORD_SECRET);

app.get('/getDiscordBotInviteLink', (req, res) => {
	res.status(200).json({
		discordBotInviteLink: BOT_JOIN_URL
	});
});

app.listen(PORT, (err) => {
	if (err) {
		return console.error(err);
	}
	return console.log(`server listening on port ${PORT}`);
})

server.listen(WEBSOCKET_PORT, () => {
	return console.log(`websocket listening on port ${WEBSOCKET_PORT}`);
})
