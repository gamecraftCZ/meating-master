import * as React from 'react';
import { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, PageHeader, Steps } from 'antd';

import './style.sass';
import store from '@stores/index.ts';
import { useWindowSize } from '@hooks/index.ts';
import { getZoomAuthLink } from '@services/index.ts';

const { Step } = Steps;

export default function ZoomJoin() {
	const [state, setState] = useState({
		toDashboard: false,
	});
	const [zoomLink, setZoomLink] = useState('');

	const windowSize = useWindowSize();

	useEffect(() => {
    getZoomAuthLink().then((zoomLink) => {
      setZoomLink(zoomLink);
    });
  }, []);

	if (state.toDashboard) {
		return <Redirect to='/' />
	}

	const renderConnectButton = () => {
    if (store.zoomStep !== 0) return;

    return (
      <div className="buttonContainer">
        <Button
          loading={zoomLink === ''}
          type="primary"
          size="large"
          target="_blank"
          href={zoomLink}
        >
          Connect
        </Button>
      </div>
    );
  };

	return (
    <div className="ZoomJoin">
      <PageHeader
        title="Connect your Zoom meeting"
        onBack={() => setState({ toDashboard: true })}
      />
      <div className="stepsContainer">
        <Steps
          current={store.zoomStep}
          direction={windowSize.width > 750 ? 'horizontal' : 'vertical'}
        >
          <Step title="Connect your Zoom account" />
          <Step title="Message the bot" />
          <Step title="Done" />
        </Steps>
      </div>
      {renderConnectButton()}
    </div>
  );
}
