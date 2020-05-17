import * as React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from 'antd';

import { leaveDiscordChannel } from '@services/';
import Results from '../Results';

import './style.sass';

export default function MeetingInProgress() {
	const [state, setState] = useState({
		redirect: ''
	});

	const endMeeting = async () => {
		await leaveDiscordChannel();

		setState({
			redirect: '/results'
		});
	}

	if (state.redirect !== '') {
		return <Redirect to={state.redirect} />;
	}

	return (
    <div className="MeetingInProgress">
      <div className="headingWrapper">
        <h1>Meeting in Progress</h1>
      </div>
      <div className="endMeetingWrapper">
        <Button type="primary" size="large" danger onClick={endMeeting}>
          End Meeting
        </Button>
      </div>
			<Results keepFetching={true} />
    </div>
  );
}
