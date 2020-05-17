import * as React from 'react';

import './style.sass';
import SpeakTimeBar from './SpeakTimeBar';

interface IUserSpeakData {
  id: number
  name: string
  talkTime: number
}

interface ISpeakTimeProps {
  optimalSpeakTime: number
  totalMeetingTime: number
  users: IUserSpeakData[]
}

export default function SpeakTime(props: ISpeakTimeProps) {
  const renderSpeakTimeBars = () => {
    return props.users.map((user, i) => (
      <SpeakTimeBar
        name={user.name}
        minutesSpoken={Math.round((user.talkTime / 60000) * 10) / 10} // convert MS to minutes
        optimalMinutesSpoken={
          Math.round((props.optimalSpeakTime / 60000) * 10) / 10
        }
        totalMeetingTime={
          Math.round((props.totalMeetingTime / 60000) * 10) / 10
        }
        key={i}
      />
    ));
	}

	return (
    <div className='SpeakTime'>
      <div className="headingsWrapper">
        <h2>Optimal speak time per person: {Math.round((props.optimalSpeakTime / 60000) * 10) / 10} minutes</h2>
        <h2>Meeting length: {Math.round((props.totalMeetingTime / 60000) * 10) / 10} minutes</h2>
      </div>
      {renderSpeakTimeBars()}
    </div>
  );
}
