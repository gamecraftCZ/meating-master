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
exports.receiveMessageHandler = exports.channelUpdate = exports.serverJoinHandler = void 0;
const utils_1 = require("./utils");
const wav_1 = __importDefault(require("wav"));
const constants_1 = require("../constants");
const uuid_1 = require("uuid");
const stream_1 = require("stream");
let watchedChannelId = "---";
let voiceConnection = null;
const usersListening = [];
const read15SecondAudio = (audioStream, user) => {
    utils_1.sleep(2000).then(() => {
        const data = audioStream.read(96000 * 2);
        const filename = `${uuid_1.v4()}.wav`;
        wav_1.default.FileWriter(`${constants_1.AUDIO_FOLDER}/${filename}`, {
            endianness: 'LE',
            channels: 2,
            sampleRate: 48000,
            bitDepth: 16,
        });
    });
};
exports.serverJoinHandler = (socket) => {
    console.log('Joined server');
    socket.emit('discordStepUpdate', 1);
};
// https://discordjs.guide/voice/receiving-audio.html
const startListeningUser = (user) => {
    console.log("Starting listen for user: ", user.username);
    if (voiceConnection) {
        // Must send silence to start listening. issue: https://github.com/discordjs/discord.js/issues/2929
        const SILENCE_FRAME = Buffer.from([0xF8, 0xFF, 0xFE]);
        class Silence extends stream_1.Readable {
            _read() {
                this.push(SILENCE_FRAME);
                this.destroy();
            }
        }
        voiceConnection.play(new Silence(), { type: 'opus' });
        // https://discordjs.guide/voice/receiving-audio.html
        const audio = voiceConnection.receiver.createStream(user, { mode: "pcm", end: "manual" });
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
};
const stopListeningUser = (user) => {
    console.log('Stopping listen for user: ', user.username);
    const listener = usersListening.find((u) => u.user.id == user.id);
    if (listener) {
        // voiceConnection.
    }
};
exports.channelUpdate = (client, oldVoice, newVoice) => {
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
exports.receiveMessageHandler = (client, message, socket) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        if ((_a = message === null || message === void 0 ? void 0 : message.author) === null || _a === void 0 ? void 0 : _a.bot) {
            return;
        }
        if (message.content === "/meat") {
            // Only try to join the sender's voice channel if they are in one themselves
            if ((_c = (_b = message === null || message === void 0 ? void 0 : message.member) === null || _b === void 0 ? void 0 : _b.voice) === null || _c === void 0 ? void 0 : _c.channel) {
                watchedChannelId = message.member.voice.channel.id;
                voiceConnection = yield message.member.voice.channel.join();
                socket.emit('discordStepUpdate', 2);
                message.member.voice.channel.members
                    .filter(m => m.user.id != client.user.id) // To net listen to itself
                    .forEach(member => startListeningUser(member.user));
                yield message.delete();
            }
            else {
                message.reply('You need to join a voice channel first!');
            }
        }
    }
    catch (err) {
        console.error('Error while handling message: ', err);
    }
});
//# sourceMappingURL=discord.js.map