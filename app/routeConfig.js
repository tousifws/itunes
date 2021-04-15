import NotFound from '@containers/NotFoundPage/Loadable';
import HomeContainer from '@containers/HomeContainer/Loadable';
import routeConstants from '@utils/routeConstants';
export const routeConfig = {
  repos: {
    component: HomeContainer,
    ...routeConstants.repos
  },
  musics: {
    component: MusicContainer,
    ...routeConstants.musics
  },
  notFoundPage: {
    component: NotFound,
    route: '/'
  }
};
