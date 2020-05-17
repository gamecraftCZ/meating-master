import * as React from 'react';
import { Typography } from 'antd';

import JoinButton from './JoinButton';
import MSTeamsLogo from '@assets/icons/teams-logo.png';
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
          <JoinButton to="ms-teams-join" img={MSTeamsLogo} label="MS Teams" />
        </div>
      </div>
    </div>
  );
}
