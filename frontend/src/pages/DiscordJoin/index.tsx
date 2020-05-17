import * as React from 'react';
import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, PageHeader, Steps } from 'antd';
import { observer } from 'mobx-react';

import { useWindowSize } from '@hooks/';
import { getDiscordBotLink } from '@services/';
import './style.sass';
import store from '@stores/index.ts';
import { RobustKeys } from 'robust-react-router/dist/typescriptMagic';
import { robust } from '@helpers/history';

const { Step } = Steps;

const DiscordJoin = observer(() => {
  const [redirect, setRedirect] = useState<RobustKeys<typeof robust>>();
  const [discordLink, setDiscordLink] = useState('');

  const windowSize = useWindowSize();

  useEffect(() => {
    getDiscordBotLink().then((discordLink) => {
      setDiscordLink(discordLink);
    });
  }, []);

  useEffect(() => {
    if (store.discordStep === 2) {
      setTimeout(() => {
        setRedirect('MEETING_IN_PROGRESS');
      }, 1000);
    }
  }, [store.discordStep]);

  if (redirect) {
    return <Redirect to={redirect} />;
  }

  const renderConnectButton = () => {
    if (store.discordStep !== 0) return;

    return (
      <div className="buttonContainer">
        <Button
          loading={discordLink === ''}
          type="primary"
          size="large"
          target="_blank"
          href={discordLink}
        >
          Connect
        </Button>
      </div>
    );
  };

  return (
    <div className="DiscordJoin">
      <PageHeader title="Go Back" onBack={() => setRedirect('JOIN')} />
      <div className="stepsContainer">
        <Steps
          current={store.discordStep}
          direction={windowSize.width > 750 ? 'horizontal' : 'vertical'}
        >
          <Step title="Connect the bot to your server" />
          <Step title="Message the bot" />
          <Step title="Done" />
        </Steps>
      </div>
      {renderConnectButton()}
    </div>
  );
});

export default DiscordJoin;
