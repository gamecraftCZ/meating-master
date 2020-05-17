import React, { Component } from 'react';
import { Switch, withRouter, Route } from 'react-router-dom';

import Join from '@pages/Join';
import MSTeamsJoin from '@pages/MSTeamsJoin';
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
          <Route path="/ms-teams-join" exact component={MSTeamsJoin} />
          <Route path="/discord-join" exact component={DiscordJoin} />
          <Route path="/results" exact component={Results} />
          <Route path='/meeting-in-progress'exact component={MeetingInProgress} />
        </Switch>
      </div>
    );
  }
}

export default withRouter(App);