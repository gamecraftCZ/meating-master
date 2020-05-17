import * as React from 'react';
import { Typography } from 'antd';

import JoinButton from './JoinButton';
import ZoomLogo from '@assets/icons/zoom-logo.png';
import DiscordLogo from '@assets/icons/discord-logo.png';

import './style.sass';

const { Title } = Typography;

export default function Join () {
	return (
    <div className="Join">
      <Title>Select a meeting platform:</Title>
      <div className="buttonsContainer">
        <div>
          <JoinButton to="discord-join" img={DiscordLogo} label="Discord" />
        </div>
        <div>
          <JoinButton to='zoom-join' img={ZoomLogo} label="Zoom" />
        </div>
      </div>
    </div>
  );
}
