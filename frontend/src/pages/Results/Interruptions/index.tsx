import * as React from 'react';

import './style.sass';
import Interruption from './Interruption';

export interface IInterruptionData {
	interruptee: string
	interruptor: string
	audioId: string
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
