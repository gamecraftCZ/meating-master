import * as React from 'react';
import { useEffect, useState } from 'react';
import { Divider } from 'antd';

import './style.sass';

import SpeakTime from './SpeakTime';
import Interruptions from './Interruptions';
import { getResults } from '@services/';

export default function Results() {
	const [users, setUsers] = useState([]);
	const [interruptions, setInterruptions] = useState([]);
	const [totalMeetingTime, setTotalMeetingTime] = useState(0);
	const [optimalMeetingTime, setOptimalMeetingTime] = useState(0);

	useEffect(() => {
		getResults().then(results => {
			console.log('results: ', results);
			if (results) {
				setUsers(results.users);
        setInterruptions(results.interruptions);
				setTotalMeetingTime(results.meeting_length);
				setOptimalMeetingTime(results.optimal_meeting_time);
			}
		});
	}, []);

	return (
    <div className="Results">
			<SpeakTime optimalSpeakTime={optimalMeetingTime} users={users} totalMeetingTime={totalMeetingTime} />
			
			<Divider style={{ margin: '5vh 0' }}/>

      <Interruptions interruptions={interruptions} />
    </div>
  );
}
