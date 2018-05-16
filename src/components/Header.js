import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './bootstrap.css';
import './Dashboard.css';
import logo from '../img/kinoteatris_white.svg';

class Header extends Component {
  render() {
    const { type, logout, path } = this.props;
    return(
      <nav style={{zIndex: (path && path === '/scan' ? 6 : 1)}} className="navbar navbar-expand-lg navbar-dark bg-dark front-header">
        <div className="container w-100">
          <div className="row w-100">
            <img alt={'Kinoteātris'} className="the-logo mr-2" src={logo}/>
            <span className="navbar-text">
              {(type === 'admin' ? 'Administrācijas panelis' : 'Kinoteātris')}
            </span>
            {(type === 'admin' ?
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <div className="nav-link" style={{cursor:"pointer"}} onClick={logout}>{'Izrakstīties'}</div>
                </li>
              </ul>
            : <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  {(path && path === '/scan' ?
                    <Link className="nav-link" style={{cursor:"pointer"}} to={'/'}>{'Atpakaļ uz sākumu'}</Link>
                    :
                    <Link className="nav-link" style={{cursor:"pointer"}} to={'/scan'}>{'Skenēt biļeti'}</Link>
                  )}
                </li>
              </ul> )}
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
