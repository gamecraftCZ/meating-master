// export const joinMeeting = (client) => {
	
// };

export const serverJoinHandler = (guild, client) => {
	console.log(`Guild joined: ${guild}`);
	const accessibleChannels = client.channels.cache.array();
	console.log(`Accessible Channels: ${accessibleChannels}`);
}

export const receiveMessageHandler = async (message) => {
	try {
		if (message?.author?.bot) {
			return;
		}
		console.log('received message: ', message);
		console.log('message.member: ', message.member);

		// Only try to join the sender's voice channel if they are in one themselves
		if (message?.member?.voice?.channel) {
			const connection = await message.member.voice.channel.join();
			console.log('connection: ', connection);
		} else {
			message.reply('You need to join a voice channel first!');
		}
	} catch (err) {
		console.error('Error while handling message: ', err);
	}
}