import * as React from 'react';
import { Button } from 'antd';

import { leaveDiscordChannel } from '@services/';
import { Results } from '../Results';

import './style.sass';
import { router } from '@helpers/history';

export function MeetingInProgress() {
  const endMeeting = async () => {
    await leaveDiscordChannel();
    router.redirect('RESULTS');
  };

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
