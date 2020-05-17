import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Router, Switch } from 'react-router-dom';
import 'mobx-react-lite/batchingForReactDom';

import history from '@helpers/history';
import App from './App';

ReactDOM.render(
	<Router history={history}>
		<Switch>
			<App />
		</Switch>
	</Router>,
	document.getElementById('root')
);
