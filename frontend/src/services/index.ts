import { API_URL } from '@constants/urls';

export const getDiscordBotLink = async () => {
	try {
		const res = await fetch(`${API_URL}/getDiscordBotInviteLink`);
		const resJson = await res.json();

		return resJson?.discordBotInviteLink;
	} catch (err) {
		console.error(err);
	}
}