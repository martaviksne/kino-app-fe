import React, { Component } from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import ls from 'local-storage';
import axios from 'axios';
import config from './config.js';
//import createBrowserHistory from './history';

/* polyfills.js */

import 'core-js/fn/array/find';
import 'core-js/fn/array/includes';
import 'core-js/fn/number/is-nan';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    }
    this.requireAuth = this.requireAuth.bind(this);
  }
  componentWillMount() {
    this.requireAuth();
  }
  componentWillUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    this.requireAuth();
  }
  requireAuth() {
    var theToken = ls.get('kino_jwt');
    if (theToken) {
      axios.post(config.server+'/api/verifyToken', {}, {
        headers: {
          authorization: "Bearer "+theToken
        }
      })
      .then((response)=> {
        this.setState({loggedIn: true});
      })
      .catch((err) => {
        this.setState({loggedIn: false});
        console.log('error', err);
      });
    } else {
      this.setState({loggedIn: false});
    }
  }
  render() {
    console.log('env', process.env.NODE_ENV)
    return (
        <div id="router">
          <Route exact path="/" component={Home} />
          <Route exact path="/admin" render={()=>(this.state.loggedIn ? <Redirect to="/dashboard" /> : <Login />)} />
          <Route exact path="/dashboard" render={()=>(this.state.loggedIn ? <Dashboard /> : <Redirect to="/admin" />)} />
        </div>
    );
  }
}

export default withRouter(App);
