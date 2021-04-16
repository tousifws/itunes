import NotFound from '@containers/NotFoundPage/Loadable';
import HomeContainer from '@containers/HomeContainer/Loadable';
import MusicContainer from '@containers/MusicContainer/Loadable';
import routeConstants from '@utils/routeConstants';

export const routeConfig = {
  repos: {
    component: HomeContainer,
    ...routeConstants.repos
  },
  music: {
    component: MusicContainer,
    ...routeConstants.music
  },
  notFoundPage: {
    component: NotFound,
    route: '/'
  }
};
