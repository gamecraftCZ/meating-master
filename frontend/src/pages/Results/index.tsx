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

	useEffect(() => {
		getResults().then(results => {
			setUsers(results.users);
			setInterruptions(results.interruptions);
		});
	}, []);

	return (
    <div className="Results">
			<SpeakTime optimalSpeakTime={34.7} users={users} totalMeetingTime={100} />
			
			<Divider style={{ margin: '5vh 0' }}/>

      <Interruptions interruptions={interruptions} />
    </div>
  );
}
