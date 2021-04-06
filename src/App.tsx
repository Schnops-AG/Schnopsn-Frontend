import React, { Component } from 'react';
import logo from './logo.svg';
import './App.scss';
import { StartPage } from './pages/StartPage/startPage';
import { Route, MemoryRouter as Router, Switch } from 'react-router';

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/">
            <StartPage />
          </Route>
        </Switch>

      </Router>
    </div>
  );
}

export default App;
