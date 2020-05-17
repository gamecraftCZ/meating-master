import * as React from 'react';
import { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, PageHeader } from 'antd';

import './style.sass';

export default function MSTeamsJoin() {
	const [state, setState] = useState({
		toDashboard: false,
	});

	console.log('state: ', state);

	if (state.toDashboard) {
		return <Redirect to='/' />
	}

	return (
		<div className="MSTeamsJoin">
			<PageHeader title='Connect your MS Teams meeting' onBack={() => setState({ toDashboard: true })} />
      <Button
        type="primary"
        size="large"
        target="_blank"
      >
        Connect
      </Button>
    </div>
  );
}
