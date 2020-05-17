import discord from "discord.js";
import {AUDIO_FOLDER} from "../constants";
import {v4 as uuid4} from 'uuid';
const { Readable } = require('stream');
const fs = require('fs');

let watchedChannelId = "---";
let voiceConnection: discord.VoiceConnection = null;
let usersListening: { user: discord.User, audio }[] = [];

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
        voiceConnection.play(new Silence(), { type: 'opus' });

        // https://discordjs.guide/voice/receiving-audio.html
        const audio = voiceConnection.receiver.createStream(user, {mode: "pcm", end: "manual"})
        // audio.on('data',
        //     (chunk) => {
        //         console.log(`Received ${chunk.length} bytes of data.`);
        //     });

        read15SecondAudio(audio, user)
    }
}

const read15SecondAudio = (audioStream, user: discord.User) => {
    if (!audioStream.destroyed) {
        const filename = `${uuid4()}.pcm`

        const path = `${AUDIO_FOLDER}/${filename}`
        const fileStream = fs.createWriteStream(path)
        audioStream.pipe(fileStream)

        setTimeout(() => {
            audioStream.unpipe(fileStream)
            // TODO - send audio file path to audio_recognition
            // TODO - change to about second or 2, because when user is not talking, nothing is sent.
            //  this can cause getting out of sync with the audio.
            read15SecondAudio(audioStream, user)
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
