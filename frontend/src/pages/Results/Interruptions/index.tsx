import * as React from 'react';

import './style.sass';
import Interruption from './Interruption';

export interface IUser {
	id: number
	name: string
}

export interface IInterruptionData {
	from: IUser
	to: IUser
	recordingId: number
	startTimestamp: number
	endTimestamp: number
}

export interface IInterruptionsProps {
	interruptions: IInterruptionData[]
}

export default function Interruptions(props: IInterruptionsProps) {
	
	const interruptions = props.interruptions.map((interruption, i) => {
		return (<Interruption interruption={interruption} key={i} />)
	});

	return (
    <div className="Interruptions">
      <h2>Total interruptions: {interruptions.length}</h2>
			<div className="interruptionsWrapper">
				{interruptions}
			</div>
    </div>
  );
}
