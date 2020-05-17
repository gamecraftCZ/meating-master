import * as React from 'react';
import { Progress } from 'antd';

import './style.sass';

export interface ISpeakTimeBarProps {
	minutesSpoken: number
	name: string
	optimalMinutesSpoken: number
}

export default function SpeakTimeBar (props: ISpeakTimeBarProps) {
  return (
    <div className="SpeakTimeBar">
      <span className="name">{props.name}</span>
      <div className="progressWrapper">
        <Progress
          percent={props.optimalMinutesSpoken}
          showInfo={false}
          successPercent={props.minutesSpoken}
          status={
            Math.abs(props.minutesSpoken - props.optimalMinutesSpoken) > 20
              ? 'exception'
              : 'normal'
          }
        />
        <span className="minutesSpoken">
          {props.minutesSpoken} minutes spoken
        </span>
      </div>
    </div>
  );
}