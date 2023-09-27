import React from 'react';
// import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Chat from './components /Chat';
import App from './App';
import { createRoot } from 'react-dom/client';


const container = document.getElementById('root');
const root = createRoot(container);
root.render(
   <BrowserRouter>
          <Switch>
                  <Route exact path="/" component={App}/>
                  <Route exact path="/chat" component={Chat}/>
          </Switch>
    </BrowserRouter>
);