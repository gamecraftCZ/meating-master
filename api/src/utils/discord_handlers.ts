import discord from "discord.js";
import {AUDIO_FOLDER} from "../constants";
import {v4 as uuid4} from 'uuid';

import {Readable} from 'stream';
import fs from 'fs';
import axios from "axios"
import {resolve as toAbsolutepath} from 'path'
import {Socket} from "socket.io";

let watchedChannelId = "---";
let voiceConnection: discord.VoiceConnection = null;
let usersListening: { user: discord.User; audio }[] = [];

const stopListeningUser = (user: discord.User) => {
    try {
        console.log('Stopping listen for user: ', user.username);
        const listener = usersListening.find((u) => u.user.id == user.id);
        if (listener) {
            listener.audio.destroy();
            usersListening = usersListening.filter((u) => u.user.id != user.id);
        }
    } catch (err) {
        console.error('Error while stopping listening to user: ', err);
    }
}

export const serverJoinHandler = (socket: Socket) => {
    try {
        console.log('Joined server');
        usersListening = [];
        socket.emit('discordStepUpdate', 1);
    } catch (err) {
        console.error('Error inside serverJoinHandler: ', err);
    }
};

const readAudio = (audioStream, user: discord.User) => {
    try {
        if (!audioStream.destroyed) {
            const recId = uuid4();
            const filename = `${recId}.pcm`;

            const path = `${AUDIO_FOLDER}/${filename}`;
            const fileStream = fs.createWriteStream(path).on('error', (err) => {
                console.error('Error while attempting to write to file: ', err);
            });
            audioStream.pipe(fileStream);

            setTimeout(() => {
                audioStream.unpipe(fileStream);
                fileStream.close();
                axios.post('http://localhost:2986/newRecording', {
                    filepath: toAbsolutepath(path),
                    recordingId: recId,
                    startTimestamp: new Date().getTime(),
                    endTimestamp: new Date().getTime() + 3_000,
                    user: {name: user.username, id: user.id},
                });
                // Must be about second or two, because when user is not talking, no data is sent.
                //  This can cause getting out of sync with the audio.
                readAudio(audioStream, user);
            }, 3_000);
        } else {
            audioStream.close();
        }
    } catch (err) {
        console.error('Error while reading audio: ', err);
    }
}

// https://discordjs.guide/voice/receiving-audio.html
const startListeningUser = (user: discord.User) => {
    try {
        if (usersListening.find((u) => u.user.id == user.id)) {
            return;
        }
        console.log('Starting listen for user: ', user.username);
        if (voiceConnection) {
            // Must send silence to start listening. issue: https://github.com/discordjs/discord.js/issues/2929
            const SILENCE_FRAME = Buffer.from([0xf8, 0xff, 0xfe]);

            class Silence extends Readable {
                _read() {
                    this.push(SILENCE_FRAME);
                    this.destroy();
                }
            }

            voiceConnection.play(new Silence(), {type: 'opus'});

            // https://discordjs.guide/voice/receiving-audio.html
            const audio = voiceConnection.receiver.createStream(user, {mode: 'pcm', end: 'manual'});

            readAudio(audio, user);
        }
    } catch (err) {
        console.error('Error while starting to listen to user: ', err);
    }
}

export const channelUpdate = (
    client: discord.Client,
    oldVoice: discord.VoiceState,
    newVoice: discord.VoiceState
) => {
    try {
        usersListening = [];
        if (newVoice.member.user.id == client.user.id) {
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
            if (user.user.id === client.user.id) {
                axios.post('http://localhost:2986/endMeeting');
                console.log('[ENDED] meeting ended - ', new Date().getTime());
            }
            stopListeningUser(user.user);
        }
    } catch (err) {
        console.error('Error while handling channel update: ', err);
    }
};

export const receiveMessageHandler = async (client: discord.Client, message: discord.Message, socket: Socket) => {
    try {
        if (message?.author?.bot) {
            return;
        }
        if (message.content === "/meat") {
            // Only try to join the sender's voice channel if they are in one themselves
            if (message?.member?.voice?.channel) {
                watchedChannelId = message.member.voice.channel.id;
                axios.post("http://localhost:2986/startMeeting")
                console.log("[STARTED] meeting started - ", new Date().getTime())
                voiceConnection = await message.member.voice.channel.join();
                socket.emit('discordStepUpdate', 2);
                message.member.voice.channel.members
                    .filter(m => m.user.id != client.user.id)  // To not listen to itself
                    .forEach(member => startListeningUser(member.user));
                await message.delete(); // don't fucking move
            } else {
                message.reply('You need to join a voice channel first!');
            }
        }
    } catch (err) {
        console.error('Error while handling message: ', err);
    }
}

export const leaveChannel = (socket: Socket) => {
    usersListening = []
    try {
        socket.emit('discordStepUpdate', 0);
        if (voiceConnection) {
            axios.post("http://localhost:2986/endMeeting")
            console.log("[ENDED] meeting ended - ", new Date().getTime())
            voiceConnection.disconnect(); // This line gets executed successfully
        }
    } catch (err) {
        console.error('Error while leaving channel: ', err);
    }
}
