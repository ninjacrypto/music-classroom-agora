import { hasProxies } from '@reduxjs/toolkit/node_modules/immer/dist/internal';
import React from 'react';
import { RouteComponentProps } from 'react-router';
import Home from '../Home/Home';
import Start from '../Start/Start';

function Login(props: RouteComponentProps) {
  return (
    <div>
      <Home>
        <Start {...props} />
      </Home>
    </div>
  );
}

export default Login;
