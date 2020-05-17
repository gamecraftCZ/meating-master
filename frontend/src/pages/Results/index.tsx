import * as React from 'react';
import { useEffect, useState } from 'react';
import { Divider } from 'antd';

import './style.sass';

import SpeakTime from './SpeakTime';
import Interruptions from './Interruptions';
import { getResults } from '@services/';

const interruptions = [
	{
		interruptee: 'Ondra',
		interruptor: 'Patrik',
		audioId: ''
	},
	{
		interruptee: 'David',
		interruptor: 'Dan',
		audioId: ''
	}
];

export default function Results() {

	useEffect(() => {
		getResults();
	}, []);

	return (
    <div className="Results">
      <SpeakTime optimalSpeakTime={50} />
			
			<Divider style={{ margin: '5vh 0' }}/>

      <Interruptions interruptions={interruptions} />
    </div>
  );
}
