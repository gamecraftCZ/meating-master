import socketIOClient from 'socket.io-client';
import { WEBSOCKET_ENDPOINT } from '@constants/urls';
import { observable, action } from 'mobx';

class Store {
  socket;
  @observable discordStep =
    Number(window.localStorage.getItem('discordStep')) || 0;
  @observable zoomStep = Number(window.localStorage.getItem('zoomStep')) || 0;

  constructor() {
    this.socket = socketIOClient(WEBSOCKET_ENDPOINT);

    this.socket.on('discordStepUpdate', (step) => {
      this.setDiscordStep(step);
      window.localStorage.setItem('discordStep', step.toString());
    });

    this.socket.on('zoomStepUpdate', (step) => {
      this.setZoomStep(step);
      window.localStorage.setItem('zoomStep', step.toString());
    });
  }

  @action
  setDiscordStep(newStep) {
    this.discordStep = newStep;
  }

  @action
  setZoomStep(newStep) {
    this.zoomStep = newStep;
  }
}

export default new Store();
