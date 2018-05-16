import React, { Component } from 'react';
import './bootstrap.css';
import config from '../config.js';
import axios from 'axios';
import Header from './Header';
import Filma from './Filma';
import TicketPopup from './TicketPopup';
var crypto = require('crypto');

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filmas: [],
      fetching: true,
      popupClosed: true,
      modalTitle: 'Pirkt biļeti',
      ticketCount: 1,
      movieName: '',
      moviePlace: '',
      moviePrice: '',
      movieDate: '',
      seanssId: '',
      movieId: '',
      buying: true,
      ticketBought: false
    }
    this.openPopup = this.openPopup.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    this.changeTicketCount = this.changeTicketCount.bind(this);
    this.buyTicket = this.buyTicket.bind(this);
    this.captchaVerify = this.captchaVerify.bind(this);
  }
  togglePopup() {
    document.getElementsByTagName("body")[0].classList.remove('modal-open');
    if (document.getElementById("modalBackdrop")) document.getElementById("modalBackdrop").remove();
    this.setState({popupClosed: !this.state.popupClosed});
  }
  openPopup(movieName, moviePlace, moviePrice, movieDate, seanssId, movieId) {
    this.setState({
      movieName: movieName,
      moviePlace: moviePlace,
      moviePrice: moviePrice,
      movieDate: movieDate,
      seanssId: seanssId,
      movieId: movieId,
      ticketCount: 1,
      modalTitle: 'Pirkt biļeti',
      ticketBought: false,
      buying: true,
      ticketCode: ''
    })
    document.getElementsByTagName("body")[0].classList.add('modal-open');
    this.setState({popupClosed: false});
  }
  changeTicketCount(e) {
    this.setState({ticketCount: e});
  }
  captchaVerify(e) {
    this.setState({buying: false});
  }
  buyTicket(movieName, movieDate, moviePlace, moviePrice, seats, seanssId, movieId) {
    this.setState({buying: true});
    let ticketCode = crypto.createHash('sha256').update(movieName+movieDate+Date.now()).digest("hex");

    axios.post(config.server+'/api/tickets', {
      date: movieDate,
      place: moviePlace,
      price: moviePrice,
      seats: seats,
      theId: ticketCode,
      seanss: seanssId,
      movie: movieId,
      buyDate: Date.now(),
      valid: true
    })
    .then((response) => {
      this.setState({
        ticketBought: true,
        ticketCode: ticketCode,
        modalTitle: 'Biļete veiksmīgi nopirkta',
        buying: false
      });
    })
    .catch((err)=> {
      console.log('error', err);
    })

  }
  componentDidMount() {
    if ('caches' in window) {
      caches.match(config.server+'/api/filmas').then((response)=> {
        if (response) {
          response.json().then(function updateFromCache(json) {
            //var results = json.query.results;
            json.forEach((item)=> {
              item.id = item._id;
            })
            this.setState({filmas: json, fetching: false})
          }.bind(this));
        }
      });
    }

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
            <Filma openPopup={this.openPopup} {...item} frontend={true} key={i} />)}
          </div>
        </div>
      :
      <div className="d-flex justify-content-center container mt-4">
        <div className="loadersmall"></div>
      </div>)}
      <TicketPopup
        modalTitle={this.state.modalTitle}
        togglePopup={this.togglePopup}
        popupClosed={this.state.popupClosed}
        ticketCount={this.state.ticketCount}
        movieName={this.state.movieName}
        moviePlace={this.state.moviePlace}
        moviePrice={this.state.moviePrice}
        movieDate={this.state.movieDate}
        changeTicketCount={this.changeTicketCount}
        ticketBought={this.state.ticketBought}
        buyTicket={this.buyTicket}
        ticketCode={this.state.ticketCode}
        seanssId={this.state.seanssId}
        movieId={this.state.movieId}
        buying={this.state.buying}
        captcha={this.captchaVerify}
      />
    {(!this.state.popupClosed && <div className="modal-backdrop fade show"></div>)}
      </div>
    );
  }
}

export default Home;
