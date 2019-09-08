import ReactViewRouter from 'react-view-router';

const router = new ReactViewRouter({
  inheritProps: false,
  install(ReactVueLike, { App }) {
    if (!App.inherits) App.inherits = {};
    App.inherits.$router = router;
  }
});

export default router;
