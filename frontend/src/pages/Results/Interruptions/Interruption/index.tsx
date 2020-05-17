import * as React from 'react';
import ReactAudioPlayer from 'react-audio-player';

import './style.sass';
import { IInterruptionData } from '../index';
import { RECORDINGS_URL } from '@constants/urls';

export interface IInterruptionProps {
	interruption: IInterruptionData
}

export default function Interruption (props: IInterruptionProps) {
	return (
    <div className="Interruption">
      <p className='event'>
				<b className='interruptor'>{props.interruption.interruptor}</b>
				interrupted
				<b>{props.interruption.interruptee}</b>
			</p>

			<div className='recording'>
				<ReactAudioPlayer
					src={RECORDINGS_URL + props.interruption.audioId}
					controls
				/>
			</div>
    </div>
  );
}
