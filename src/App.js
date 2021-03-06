import React, { Component } from 'react';
import { Route, Redirect, withRouter } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import ScanTicket from './components/ScanTicket';
import ls from 'local-storage';
import axios from 'axios';
import config from './config.js';
//import createBrowserHistory from './history';

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
    return (
        <div id="router">
          <Route exact path="/" component={Home} />
          <Route exact path="/scan" component={ScanTicket} />
          <Route exact path="/admin" render={()=>(this.state.loggedIn ? <Redirect to="/dashboard" /> : <Login />)} />
          <Route exact path="/dashboard" render={()=>(this.state.loggedIn ? <Dashboard /> : <Redirect to="/admin" />)} />
        </div>
    );
  }
}

export default withRouter(App);
