import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Header from './components /Header';
import Chat from './components /Chat';
import App from './App';

ReactDOM.render(
    <BrowserRouter>
       <Header/>
       <Switch>
              <Route exact path="/" component={App}/>
              <Route exact path="/chat" component={Chat}/>
      </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);