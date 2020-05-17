import discord from "discord.js";
import {sleep} from "./utils"
import wav from "wav"
import {AUDIO_FOLDER} from "../constants";
import {v4 as uuid4} from 'uuid';
import { Readable } from 'stream';

let watchedChannelId = "---";
let voiceConnection: discord.VoiceConnection = null;
const usersListening: { user: discord.User; audio }[] = [];

const read15SecondAudio = (audioStream, user: discord.User) => {
	sleep(2_000).then(() => {
		const data = audioStream.read(96_000 * 2);

		const filename = `${uuid4()}.wav`;
		wav.FileWriter(`${AUDIO_FOLDER}/${filename}`, {
			endianness: 'LE',
			channels: 2,
			sampleRate: 48000,
			bitDepth: 16,
		});
	});
};

export const serverJoinHandler = (socket) => {
    console.log('Joined server');
    socket.emit('discordStepUpdate', 1);
}; 

// https://discordjs.guide/voice/receiving-audio.html
const startListeningUser = (user: discord.User) => {
    console.log("Starting listen for user: ", user.username);
    if (voiceConnection) {

        // Must send silence to start listening. issue: https://github.com/discordjs/discord.js/issues/2929
        const SILENCE_FRAME = Buffer.from([0xF8, 0xFF, 0xFE]);
        class Silence extends Readable {
            _read() {
                this.push(SILENCE_FRAME);
                this.destroy();
            }
        }

        voiceConnection.play(new Silence(), { type: 'opus' });

        // https://discordjs.guide/voice/receiving-audio.html
        const audio = voiceConnection.receiver.createStream(user, {mode: "pcm", end: "manual"})
        // audio.on('data',
        //     (chunk) => {
        //         console.log(`Received ${chunk.length} bytes of data.`);
        //     });


        // const fs = require('fs');
        // audio.pipe(fs.createWriteStream('user_audio.pcm'));
        // const data = audio.read(96_000 * 2)
        // console.log("data: ", data)

        // read15SecondAudio(audio, user)
    }
}

const stopListeningUser = (user: discord.User) => {
	console.log('Stopping listen for user: ', user.username);
	const listener = usersListening.find((u) => u.user.id == user.id);
	if (listener) {
		// voiceConnection.
	}
};

export const channelUpdate = (
	client: discord.Client,
	oldVoice: discord.VoiceState,
	newVoice: discord.VoiceState
) => {
	if (newVoice.member.user.id == client.user.id) {
		console.log('BOT will not be listening to itself.');
		return;
	}

	if (newVoice.channelID == watchedChannelId) {
		const user = newVoice.member;
		console.log('New user joined: ', user.user.username);
		startListeningUser(user.user);
	}
	if (oldVoice.channelID == watchedChannelId) {
		const user = newVoice.member;
		console.log('User left: ', user.user.username);
		stopListeningUser(user.user);
	}
};

export const receiveMessageHandler = async (client: discord.Client, message: discord.Message, socket) => {
    try {
        if (message?.author?.bot) {
            return;
        }
        if (message.content === "/meat") {
            // Only try to join the sender's voice channel if they are in one themselves
            if (message?.member?.voice?.channel) {
                watchedChannelId = message.member.voice.channel.id;
                voiceConnection = await message.member.voice.channel.join();
                socket.emit('discordStepUpdate', 2);
                message.member.voice.channel.members
                    .filter(m => m.user.id != client.user.id)  // To net listen to itself
                    .forEach(member => startListeningUser(member.user));
                await message.delete();
            } else {
                message.reply('You need to join a voice channel first!');
            }
        }
    } catch (err) {
        console.error('Error while handling message: ', err);
    }
}
