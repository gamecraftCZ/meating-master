import * as React from 'react';
import { Typography } from 'antd';

import JoinButton from './JoinButton';
import ZoomLogo from '@assets/icons/zoom-logo.png';
import DiscordLogo from '@assets/icons/discord-logo.png';

import './style.sass';
import { router } from '@helpers/history';
import { observer } from 'mobx-react';

const { Title } = Typography;

export const Join: React.FC = observer(() => {
  return (
    <div className="Join">
      <Title>Select a meeting platform:</Title>
      <div className="buttonsContainer">
        <div>
          <JoinButton
            to={router.path('JOIN_DISCORD')}
            img={DiscordLogo}
            label="Discord"
          />
        </div>
        <div>
          <JoinButton
            to={router.path('JOIN_ZOOM')}
            img={ZoomLogo}
            label="Zoom"
          />
        </div>
      </div>
    </div>
  );
});
