import { createBrowserHistory } from 'history';
import { createRobust } from 'robust-react-router';
import { Join } from '@pages/Join';
import { DiscordJoin } from '@pages/DiscordJoin';
import { Results } from '@pages/Results';
import { MeetingInProgress } from '@pages/MeetingInProgress';
import { ZoomJoin } from '@pages/ZoomJoin';

const history = createBrowserHistory();

export const router = createRobust(
  [
    { path: '/', key: 'JOIN', exact: true, component: Join },
    {
      path: '/zoom-join',
      key: 'JOIN_ZOOM',
      exact: true,
      component: ZoomJoin,
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
