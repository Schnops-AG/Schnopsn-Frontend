import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import { LandingPage } from './pages/LandingPage/landingPage';
import { StartGame } from './pages/StartGame/startGame';
import { Route, Switch, BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
          <Switch>
            {/* <Route exact path="/" component={StartPage}/> */}
            <Route exact path="/">
              <LandingPage />
            </Route>
            <Route path="/2erSchnopsn">
              <StartGame title='2er Schnopsn'/>
            </Route>
            <Route path="/4erSchnopsn">
              <StartGame title='4er Schnopsn'/>
            </Route>
          </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
