export default {
  repos: {
    route: '/',
    props: {
      maxwidth: 500,
      padding: 20
    },
    exact: true
  },
  music: {
    route: '/tracks',
    props: {
      padding: 20
    },
    exact: true
  },
  trackDetails: {
    route: '/track-details/:trackId',
    props: {
      padding: 20
    },
    exact: true
  }
};
