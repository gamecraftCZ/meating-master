import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import '@styles/index.sass';
import '@styles/fonts.sass';
import '@styles/buttons.sass';
import { RobustSwitch } from 'robust-react-router';
import { router } from '@helpers/history';

class App extends Component {
  render() {
    return (
      <div className="App">
        <RobustSwitch router={router}/>
      </div>
    );
  }
}

export default withRouter(App);
