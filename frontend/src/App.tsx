import React, { Component } from 'react';
import { Switch, withRouter, Route } from 'react-router-dom';


import '@styles/index.sass';
import '@styles/fonts.sass';
import '@styles/buttons.sass';
import { RobustSwitch } from 'robust-react-router';
import { robust } from '@helpers/history';

class App extends Component {

  render() {
    return (
      <div className="App">
        <RobustSwitch router={robust}/>
      </div>
    );
  }
}

export default withRouter(App);
