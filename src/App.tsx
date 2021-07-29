//@ts-nocheck
import React, { useEffect } from 'react';
import { Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import routes, { renderRoutes } from './Routes';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import SocketService from './hooks/SocketService';
// import './theme/bootstrap.scss';

function App() {
  const history = createBrowserHistory();
  SocketService.connect();

  // useEffect(() => {}, []);
  return (
    <Provider store={store}>
      <IonReactRouter>
        <IonRouterOutlet>
          <BrowserRouter>
            <Router history={history}> {renderRoutes(routes)}</Router>
          </BrowserRouter>
        </IonRouterOutlet>
      </IonReactRouter>
    </Provider>
  );
}

export default App;
