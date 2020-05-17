import * as React from 'react';

import './style.sass';
import SpeakTimeBar from './SpeakTimeBar';

export interface ISpeakTimeProps {
	optimalSpeakTime: number
}

export default function SpeakTime(props: ISpeakTimeProps) {
	const renderSpeakTimeBars = () => {
		return [
      <SpeakTimeBar
        name="Patrik"
        minutesSpoken={40}
        optimalMinutesSpoken={props.optimalSpeakTime}
        key={0}
      />,
      <SpeakTimeBar
        name="Dan"
        minutesSpoken={80}
        optimalMinutesSpoken={props.optimalSpeakTime}
        key={1}
      />,
      <SpeakTimeBar
        name="Ondra"
        minutesSpoken={45}
        optimalMinutesSpoken={props.optimalSpeakTime}
        key={2}
      />,
      <SpeakTimeBar
        name="David"
        minutesSpoken={25}
        optimalMinutesSpoken={props.optimalSpeakTime}
        key={3}
      />,
    ];
	}

	const speakTimeBars = renderSpeakTimeBars();

	return (
		<div>
			<h2>Optimal speak time: {props.optimalSpeakTime} minutes</h2>
			{speakTimeBars}
		</div>
	);
}
