"use strict";
// export const joinMeeting = (client) => {
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiveMessageHandler = exports.serverJoinHandler = void 0;
// };
exports.serverJoinHandler = (guild, client) => {
    console.log(`Guild joined: ${guild}`);
    const accessibleChannels = client.channels.cache.array();
    console.log(`Accessible Channels: ${accessibleChannels}`);
};
exports.receiveMessageHandler = (message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        if ((_a = message === null || message === void 0 ? void 0 : message.author) === null || _a === void 0 ? void 0 : _a.bot) {
            return;
        }
        console.log('received message: ', message);
        console.log('message.member: ', message.member);
        // Only try to join the sender's voice channel if they are in one themselves
        if ((_c = (_b = message === null || message === void 0 ? void 0 : message.member) === null || _b === void 0 ? void 0 : _b.voice) === null || _c === void 0 ? void 0 : _c.channel) {
            const connection = yield message.member.voice.channel.join();
            console.log('connection: ', connection);
        }
        else {
            message.reply('You need to join a voice channel first!');
        }
    }
    catch (err) {
        console.error('Error while handling message: ', err);
    }
});
//# sourceMappingURL=discord.js.map