//@ts-nocheck
import React, { useEffect } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import routes, { renderRoutes } from './Routes';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { transitions, positions, Provider as AlertProvider } from 'react-alert';
import SocketService from './hooks/SocketService';
import AlertTemplate from './components/AlertTemplate/AlertTemplate';
const options = {
  position: positions.TOP_RIGHT,
  timeout: 5000,
  transition: transitions.SCALE,
};

function App() {
  const history = createBrowserHistory();
  SocketService.connect();

  return (
    <Provider store={store}>
      <BrowserRouter>
        <AlertProvider template={AlertTemplate} {...options}>
          <Router history={history}> {renderRoutes(routes)}</Router>
        </AlertProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
