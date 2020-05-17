import { createBrowserHistory } from 'history';
import { createRouter } from 'robust-react-router';
import Join from '@pages/Join';
import DiscordJoin from '@pages/DiscordJoin';
import Results from '@pages/Results';
import MeetingInProgress from '@pages/MeetingInProgress';

const history = createBrowserHistory();

export const robust = createRouter(
  [
    { path: '/', key: 'JOIN', exact: true, component: Join },
    {
      path: '/zoom-join/:id',
      key: 'JOIN_ZOOM',
      exact: true,
      component: Join,
    },
    {
      path: '/discord-join',
      key: 'JOIN_DISCORD',
      exact: true,
      component: DiscordJoin,
    },
    { path: '/results', key: 'RESULTS', exact: true, component: Results },
    {
      path: '/meeting-in-progress',
      key: 'MEETING_IN_PROGRESS',
      exact: true,
      component: MeetingInProgress,
    },
  ] as const,
  { history }
);
