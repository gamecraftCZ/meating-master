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
        optimalMinutesSpoken={props.optimalSpeakTime}
        key={i}
      />
    ));
	}

	return (
    <div className='SpeakTime'>
      <div className="headingsWrapper">
        <h2>Optimal speak time per person: {props.optimalSpeakTime} minutes</h2>
        <h2>Meeting length: {props.totalMeetingTime} minutes</h2>
      </div>
      {renderSpeakTimeBars()}
    </div>
  );
}
