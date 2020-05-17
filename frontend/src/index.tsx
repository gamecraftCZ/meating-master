import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Switch } from 'react-router-dom';
import 'mobx-react-lite/batchingForReactDom';

import App from './App';
import { RobustRouter } from 'robust-react-router';
import { robust } from '@helpers/history';

ReactDOM.render(
	<RobustRouter router={robust}>
		<Switch>
			<App />
		</Switch>
	</RobustRouter>,
	document.getElementById('root')
);
