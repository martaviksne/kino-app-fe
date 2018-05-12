import React, { Component } from 'react';
import './bootstrap.css';
import config from '../config.js';
import axios from 'axios';
import Header from './Header';
import Filma from './Filma';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filmas: [],
      fetching: true
    }
  }
  componentDidMount() {
    axios.get(config.server+'/api/filmas')
    .then((response) => {
      let theMovies = response.data;
      theMovies.forEach((item)=>{
        item.id = item._id;
        item.seansi.forEach((seanss)=>{
          seanss.id = seanss._id;
        })
      });
      this.setState({filmas: theMovies, fetching: false})
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  render() {
    const { fetching } = this.state;
    return(
      <div className="app-background">
      <Header/>
      {(!fetching ?
        <div className="container mt-4">
          <div className="row mb-3">
          {this.state.filmas.map((item,i)=>
            <Filma {...item} frontend={true} key={i} />)}
          </div>
        </div>
      :
      <div class="d-flex justify-content-center container mt-4">
        <div class="loadersmall"></div>
      </div>)}
      </div>
    );
  }
}

export default Home;