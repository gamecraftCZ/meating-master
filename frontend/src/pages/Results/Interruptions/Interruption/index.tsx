import * as React from 'react';
import ReactAudioPlayer from 'react-audio-player';
import { useEffect } from 'react';

import './style.sass';
import { IInterruptionData } from '../index';
import { RECORDINGS_URL } from '@constants/urls';

export interface IInterruptionProps {
  interruption: IInterruptionData;
}

export default function Interruption(props: IInterruptionProps) {
  return (
    <div className="Interruption">
      <p className="event">
        <b className="interruptor">{props.interruption.from.name}</b>
        interrupted
        <b>{props.interruption.to.name}</b>
      </p>

      <div className="recording">
        <ReactAudioPlayer
          src={RECORDINGS_URL + props.interruption.recordingId}
          controls
        />
      </div>
    </div>
  );
}
