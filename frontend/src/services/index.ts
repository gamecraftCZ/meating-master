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

export const getZoomAuthLink = async () => {
  try {
    const res = await fetch(`${API_URL}/getZoomAuthLink`);
    const resJson = await res.json();

    return resJson?.zoomAuthLink;
  } catch (err) {
    console.error(err);
  }
};

export const leaveDiscordChannel = async () => {
	try {
		await fetch(`${API_URL}/leaveDiscordChannel`);
	} catch (err) {
		console.error(err);
	}
}