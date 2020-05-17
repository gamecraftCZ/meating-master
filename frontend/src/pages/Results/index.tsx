import * as React from 'react';
import { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Divider, PageHeader } from 'antd';

import './style.sass';

import SpeakTime from './SpeakTime';
import Interruptions from './Interruptions';
import { getResults } from '@services/';

interface IResultProps {
	keepFetching: boolean
}

export default function Results (props) {
	const [users, setUsers] = useState([]);
	const [interruptions, setInterruptions] = useState([]);
	const [totalMeetingTime, setTotalMeetingTime] = useState(0);
	const [optimalMeetingTime, setOptimalMeetingTime] = useState(0);
	const [redirect, setRedirect] = useState('');
	const [myInterval, setMyInterval] = useState(null);

	const fetchResults = () => {
		getResults().then((results) => {
      if (results) {
        setUsers(results.users);
        setInterruptions(results.interruptions);
        setTotalMeetingTime(results.meeting_length);
        setOptimalMeetingTime(results.optimal_meeting_time);
      }
    });
	}

	useEffect(() => {
		fetchResults();

		if (props.keepFetching) {
			setMyInterval(setInterval(fetchResults, 3000));
		}

		return () => {
			setMyInterval(null);
		};
	}, []);

	if (redirect !== '') {
		return <Redirect to={redirect} />;
	}

	return (
    <div className="Results">
      <PageHeader
        title="Go Back"
        onBack={() => setRedirect('/')}
      />
      <SpeakTime
        optimalSpeakTime={optimalMeetingTime}
        users={users}
        totalMeetingTime={totalMeetingTime}
      />

      <Divider style={{ margin: '5vh 0' }} />

      <Interruptions interruptions={interruptions} />
    </div>
  );
}
