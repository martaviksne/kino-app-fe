import React, { Component } from 'react';
import config from '../config.js';
import axios from 'axios';
import ls from 'local-storage';
import {withRouter} from 'react-router-dom';
import Filma from './Filma';
import Header from './Header';
import Ticket from './Ticket';
import './bootstrap.css';
import './Dashboard.css';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filmas: [],
      tickets: [],
      fetching: true,
      ticketsFetching: true
    }
    this.addMovie = this.addMovie.bind(this);
    this.removeMovie = this.removeMovie.bind(this);
    this.saveMovie = this.saveMovie.bind(this);
    this.editInfo = this.editInfo.bind(this);
    this.editMovie = this.editMovie.bind(this);
    this.finishEditMovie = this.finishEditMovie.bind(this);
    this.logout = this.logout.bind(this);
    this.getMovies = this.getMovies.bind(this);
    this.getTickets = this.getTickets.bind(this);
    this.deleteMovie = this.deleteMovie.bind(this);
    this.deleteTicket = this.deleteTicket.bind(this);
    this.editTicket = this.editTicket.bind(this);
  }
  componentWillMount() {
    this.getMovies();
    this.getTickets();
  }
  componentDidMount() {
    document.getElementById('push_button').remove();
    document.getElementById('add_to_home').remove();
  }
  getMovies() {
    axios.get(config.server+'/api/filmas')
    .then((response) => {
      let theMovies = response.data;
      theMovies.forEach((item)=>{
        item.notSaved = false;
        item.id = item._id;
        item.seansi.forEach((seanss)=>{
          seanss.editing = false;
          seanss.id = seanss._id;
        })
      });
      this.setState({filmas: theMovies, ticketsFetching: false})
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  getTickets() {
    axios.get(config.server+'/api/tickets')
    .then((response) => {
      let theTickets = response.data;
      theTickets.forEach((item)=>{
        item.id = item._id;
      });
      this.setState({tickets: theTickets, fetching: false})
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  logout() {
    ls.remove("kino_jwt");
    this.props.history.push("/admin");
  }
  addMovie() {
    let newMovie = {
      id: this.state.filmas.length,
      name: "",
      director: "",
      genre: "",
      description: "",
      editing: true,
      notSaved: true
    }
    let movieArray = this.state.filmas;
    movieArray.push(newMovie);
    this.setState({filmas: movieArray});
  }
  removeMovie() {
    let movieArray = this.state.filmas;
    movieArray.pop();
    this.setState({filmas: movieArray});
  }
  deleteMovie(id) {
    let movieArray = this.state.filmas;
    let poster = movieArray[movieArray.findIndex(item => item.id === id)].poster;
    console.log(poster);
    if ((typeof poster !== 'undefined') && (poster.length > 0)) {
      axios.post(config.server+'/removeUpload/', {
        theFile: poster
      })
      .then((response) => {
        axios.delete(config.server+'/api/filmas/'+id)
        .then((response) => {
          this.getMovies();
        })
        .catch(function (error) {
          console.log('error', error);
        });
      })
      .catch(function (error) {
        console.log('error', error);
      });
    } else {
      axios.delete(config.server+'/api/filmas/'+id)
      .then((response) => {
        this.getMovies();
      })
      .catch(function (error) {
        console.log('error', error);
      });
    }
  }
  editInfo(id, key, value) {
    let movieArray = this.state.filmas;
    movieArray[movieArray.findIndex(item => item.id === id)][key] = value;
    this.setState({filmas: movieArray});
  }
  editMovie(id) {
    let movieArray = this.state.filmas;
    movieArray[movieArray.findIndex(item => item.id === id)].editing = true;
    this.setState({filmas: movieArray});
  }
  finishEditMovie(id, fields) {
    axios.put(config.server+'/api/filmas/'+id, {
      name: fields.name,
      director: fields.director,
      genre: fields.genre,
      description: fields.description
    })
    .then((response) => {
      this.getMovies();
    })
    .catch(function (error) {
      console.log('error', error);
      //this.getMovies();
    });
  }
  saveMovie(id, poster) {
    let movieArray = this.state.filmas;
    movieArray[movieArray.findIndex(item => item.id === id)].editing = false;
    movieArray[movieArray.findIndex(item => item.id === id)].notSaved = false;
    let filma = movieArray[movieArray.findIndex(item => item.id === id)];
    this.setState({fetching: true});
    axios.post(config.server+'/api/filmas', {
      name: filma.name,
      director: filma.director,
      genre: filma.genre,
      description: filma.description
    })
    .then((response) => {
      if (typeof poster.size !== 'undefined') {
        var data = new FormData();
        data.append('imgUploader', poster);
        data.append('id', response.data._id);
        console.log('response.data._id', response.data._id);
        axios.post(config.server+'/api/upload', data, {
          headers: { 'content-type': 'multipart/form-data' }
        })
        .then((response) => {
          this.getMovies();
        })
        .catch(function (error) {
          console.log('error', error);
        });
      } else {
        this.getMovies();
      }
      console.log(response);
    })
    .catch(function (error) {
      console.log('error', error);
    });
  }
  deleteTicket(id) {
    axios.delete(config.server+'/api/tickets/'+id)
    .then((response) => {
      this.getTickets();
    })
    .catch(function (error) {
      console.log('error', error);
    });
  }
  editTicket(id, valid) {
    axios.put(config.server+'/api/tickets/'+id, {
      valid: !valid
    })
    .then((response) => {
      this.getTickets();
    })
    .catch(function (error) {
      console.log('error', error);
      //this.getMovies();
    });
  }
  render() {
    let addDisabled = (typeof this.state.filmas !== 'undefined' && typeof this.state.filmas.find(item => item.editing === true) !== 'undefined');
    return ((this.state.fetching && this.state.ticketsFetching) ? <div>{'Fetching...'}</div> :
      <div>
        <Header type="admin" logout={this.logout}/>
        <div className="container mt-3">
          <h3>{'Filmas'}</h3>
              <div className="row mb-3">
            {(this.state.filmas.map((item, i) =>
                <Filma
                  removeMovie={this.removeMovie}
                  id={item.id}
                  name={item.name}
                  director={item.director}
                  description={item.description}
                  genre={item.genre}
                  seansi={item.seansi}
                  notSaved={item.notSaved}
                  editing={item.editing}
                  editInfo={this.editInfo}
                  editMovie={this.editMovie}
                  finishEditMovie={this.finishEditMovie}
                  saveMovie={this.saveMovie}
                  deleteMovie={this.deleteMovie}
                  poster={item.poster}
                  getMovies={this.getMovies}
                  key={i}
                /> ))}
              </div>
          <div className="row mb-4">
            <button
              onClick={this.addMovie}
              disabled={addDisabled}
              className="btn btn-primary">{'Pievienot filmu'}</button>
          </div>
        </div>

        {(this.state.tickets && this.state.tickets.length > 0 &&
        <div className="container mt-3">
          <h3>{'Biļetes'}</h3>
          <div className="row mb-3">
            {(this.state.tickets.map((item, i) =>
              <Ticket {...item}
                deleteTicket={this.deleteTicket}
                editTicket={this.editTicket}
                key={i}
              />
            ))}
          </div>
        </div> )}
      </div>
    );
  }
}

export default withRouter(Dashboard);
