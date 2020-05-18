import * as React from 'react';
import * as ReactDOM from 'react-dom';
import 'mobx-react-lite/batchingForReactDom';

import App from './App';
import { RobustRouter } from 'robust-react-router';
import { router } from '@helpers/history';

ReactDOM.render(
  <RobustRouter router={router}>
    <App />
  </RobustRouter>,
  document.getElementById('root')
);
