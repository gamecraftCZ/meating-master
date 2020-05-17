import React, { Component } from 'react';
import { Switch, withRouter, Route } from 'react-router-dom';

import Join from '@pages/Join';
import ZoomJoin from '@pages/ZoomJoin';
import DiscordJoin from '@pages/DiscordJoin';
import Results from '@pages/Results';
import MeetingInProgress from '@pages/MeetingInProgress';

import '@styles/index.sass';
import '@styles/fonts.sass';
import '@styles/buttons.sass';

class App extends Component {

  render() {
    return (
      <div className="App">
        <Switch>
          <Route path="/" exact component={Join} />
          <Route path="/zoom-join" exact component={ZoomJoin} />
          <Route path="/discord-join" exact component={DiscordJoin} />
          <Route path="/results" exact component={Results} />
          <Route path='/meeting-in-progress'exact component={MeetingInProgress} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);