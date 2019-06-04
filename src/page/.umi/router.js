import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';


let Router = require('dva/router').routerRedux.ConnectedRouter;

let routes = [
  {
    "path": "/login",
    "component": require('../login').default,
    "exact": true
  },
  {
    "path": "/",
    "component": require('../../layout').default,
    "routes": [
      {
        "path": "/",
        "component": require('../search').default,
        "exact": true
      },
      {
        "path": "/search",
        "component": require('../search').default,
        "exact": true
      },
      {
        "path": "/find",
        "component": require('../find').default,
        "exact": true
      },
      {
        "path": "/my",
        "component": require('../my').default,
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Volumes/CODE/project/front/antd-cource/node_modules/_umi-build-dev@1.8.1@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/page', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "component": () => React.createElement(require('/Volumes/CODE/project/front/antd-cource/node_modules/_umi-build-dev@1.8.1@umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/page', hasRoutesInConfig: true })
  }
];
window.g_routes = routes;
window.g_plugins.applyForEach('patchRoutes', { initialValue: routes });

// route change handler
function routeChangeHandler(location, action) {
  window.g_plugins.applyForEach('onRouteChange', {
    initialValue: {
      routes,
      location,
      action,
    },
  });
}
window.g_history.listen(routeChangeHandler);
routeChangeHandler(window.g_history.location);

export default function RouterWrapper() {
  return (
<Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
  );
}
