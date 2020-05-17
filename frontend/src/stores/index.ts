import socketIOClient from 'socket.io-client';
import { WEBSOCKET_ENDPOINT } from '@constants/urls';
import { observable, action } from 'mobx';

class Store {
	socket;
	@observable discordStep = 0;

	constructor() {
		this.socket = socketIOClient(WEBSOCKET_ENDPOINT);

		this.socket.on('discordStepUpdate', (step) => {
			console.log('[socket] step: ', step);
      this.setDiscordStep(step);
    });
	}

	@action
	setDiscordStep(newStep) {
		this.discordStep = newStep;
	}
}

export default new Store();