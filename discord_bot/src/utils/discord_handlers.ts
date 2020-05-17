import discord from "discord.js";
import {AUDIO_FOLDER} from "../constants";
import {v4 as uuid4} from 'uuid';

const {Readable} = require('stream');
const fs = require('fs');
const axios = require("axios")
const toAbsolutepath = require('path').resolve

let watchedChannelId = "---";
let voiceConnection: discord.VoiceConnection = null;
const usersListening: { user: discord.User; audio }[] = [];

export const channelUpdate = (client: discord.Client, oldVoice: discord.VoiceState, newVoice: discord.VoiceState) => {
    if (newVoice.member.user.id == client.user.id) {
        console.log("BOT will not be listening to itself.")
        return
    }

    if (newVoice.channelID == watchedChannelId) {
        const user = newVoice.member;
        console.log("New user joined: ", user.user.username);
        startListeningUser(user.user);
    }
    if (oldVoice.channelID == watchedChannelId) {
        const user = newVoice.member;
        console.log("User left: ", user.user.username);
        stopListeningUser(user.user);
    }
}

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

        // @ts-ignore
        voiceConnection.play(new Silence(), {type: 'opus'});

        // https://discordjs.guide/voice/receiving-audio.html
        const audio = voiceConnection.receiver.createStream(user, {mode: "pcm", end: "manual"})

        readAudio(audio, user)
    }
}

const stopListeningUser = (user: discord.User) => {
    console.log("Stopping listen for user: ", user.username);
    const listener = usersListening.find(u => u.user.id == user.id)
    if (listener) {
        listener.audio.destroy()
    }
}

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

const readAudio = (audioStream, user: discord.User) => {
    if (!audioStream.destroyed) {
        const recId = uuid4()
        const filename = `${recId}.pcm`

        const path = `${AUDIO_FOLDER}/${filename}`
        const fileStream = fs.createWriteStream(path)
        audioStream.pipe(fileStream)

        setTimeout(() => {
            audioStream.unpipe(fileStream)
            axios.post("http://localhost:2986/newRecording", {
                filepath: toAbsolutepath(path),
                recordingId: recId,
                start_timestamp: new Date().getUTCMilliseconds(),
                end_timestamp: new Date().getUTCMilliseconds() + 2_000,
                user: {name: user.username, id: user.id}
            }).catch(e => console.error("Cant send audio for recognition, error: ", e))
            // Must be about second or two, because when user is not talking, no data is sent.
            //  This can cause getting out of sync with the audio.
            readAudio(audioStream, user)
        }, 2_000)
    }
}

const stopListeningUser = (user: discord.User) => {
    console.log("Stopping listen for user: ", user.username);
    const listener = usersListening.find(u => u.user.id == user.id)
    if (listener) {
        listener.audio.destroy()
    }
}

export const receiveMessageHandler = async (client: discord.Client, message: discord.Message) => {
    try {
        if (message?.author?.bot) {
            return;
        }
        if (message.content === "/meat") {
            // Only try to join the sender's voice channel if they are in one themselves
            if (message?.member?.voice?.channel) {
                await message.delete()
                watchedChannelId = message.member.voice.channel.id;
                voiceConnection = await message.member.voice.channel.join();
                socket.emit('discordStepUpdate', 2);
                message.member.voice.channel.members
                    .filter(m => m.user.id != client.user.id)  // To net listen to itself
                    .forEach(member => startListeningUser(member.user));
            } else {
                message.reply('You need to join a voice channel first!');
            }
        }
    } catch (err) {
        console.error('Error while handling message: ', err);
    }
}
