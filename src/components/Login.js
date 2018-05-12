import React, { Component } from 'react';
import './Login.css';
import kinoteatris_logo from '../img/kinoteatris.svg';
import config from '../config.js';
import axios from 'axios';
import ls from 'local-storage';
import {withRouter} from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: false
    }
    this.checkLogin = this.checkLogin.bind(this);
    this.onUsernameChange = this.onUsernameChange.bind(this);
    this.onPasswordChange = this.onPasswordChange.bind(this);
  }
  onUsernameChange(e) {
    this.setState({username: e.target.value});
  }
  onPasswordChange(e) {
    this.setState({password: e.target.value});
  }
  checkLogin() {
    axios.post(config.server+'/authenticate', {
      username: this.state.username,
      password: this.state.password
    })
    .then((response)=> {
      this.setState({error: false});
      ls.set('kino_jwt', response.data.token);
      this.props.history.push("/dashboard");
      //console.log(response.data.token);
    })
    .catch((error)=> {
      this.setState({error: true});
    });
  }
  render() {
    return (
      <div className="login_page">
        <form className="form-signin">
            <div className="logoArea">
              <img className="mb-4 logo" src={kinoteatris_logo} alt=""/>
              <span className="logoName">{`Kinoteātris`}</span>
            </div>
            <h2 className="h3 mb-3 font-weight-normal">{`Administrācijas panelis`}</h2>
            <label htmlFor="inputEmail" className="sr-only">{`Lietotājvārds`}</label>
            <input onChange={this.onUsernameChange} value={this.state.username} type="text" id="inputEmail" className="form-control" placeholder="Lietotājvārds" required autoFocus/>
            <label htmlFor="inputPassword" className="sr-only">Parole</label>
            <input onChange={this.onPasswordChange} value={this.state.password} type="password" id="inputPassword" className="form-control" placeholder="Parole" required/>
            {(this.state.error && <div class="alert alert-danger" role="alert">
              {'Nepareizs lietotājvārds vai parole.'}
            </div>)}
            <button
              disabled={(!this.state.username || !this.state.password)}
              onClick={(e) => { e.preventDefault(); this.checkLogin(); }}
              className="btn btn-lg btn-primary btn-block">Pieslēgties
            </button>
        </form>
      </div>
    );
  }
}

export default withRouter(Login);
