import * as React from 'react';
import { Progress } from 'antd';

import './style.sass';

export interface ISpeakTimeBarProps {
	minutesSpoken: number
	name: string
  optimalMinutesSpoken: number
  totalMeetingTime: number
}

export default function SpeakTimeBar(props: ISpeakTimeBarProps) {
  
  return (
    <div className="SpeakTimeBar">
      <span className="name">{props.name}</span>
      <div className="progressWrapper">
        <Progress
          percent={100 / (props.totalMeetingTime / props.optimalMinutesSpoken)}
          showInfo={false}
          successPercent={
            100 / (props.totalMeetingTime / props.minutesSpoken)
          }
          status='exception'
        />
        <span className="minutesSpoken">
          {props.minutesSpoken} minutes spoken
        </span>
      </div>
    </div>
  );
}
