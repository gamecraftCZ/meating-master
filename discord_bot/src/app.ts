import express from 'express';
import Discord from 'discord.js';
require('dotenv').config();

import { PORT, BOT_JOIN_URL } from './constants';
import { serverJoinHandler, receiveMessageHandler } from './utils/discord';

const app = express();

const client = new Discord.Client();

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('guildCreate', (guild) => serverJoinHandler(guild, client));

client.on('message', (message) => receiveMessageHandler(message));

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
