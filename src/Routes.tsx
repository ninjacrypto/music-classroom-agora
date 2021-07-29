// @ts-nocheck
import React, { Suspense, lazy } from 'react';
import { Switch, Route } from 'react-router-dom';

export const renderRoutes = (routes = []) => (
  <Suspense fallback={''}>
    <Switch>
      {routes.map((route, i) => {
        const Component: any = route.component;
        return <Route key={i} path={route.path} exact={route.exact} render={(props) => <Component {...props} />} />;
      })}
    </Switch>
  </Suspense>
);
const routes = [
  {
    exact: true,
    path: '/',
    component: lazy(() => import('./components/login/Login')),
  },
  {
    exact: true,
    path: '/meeting',
    component: lazy(() => import('./Call')),
  },
  {
    exact: true,
    path: '/join',
    component: lazy(() => import('./components/Join/Join')),
  },
];

export default routes;
