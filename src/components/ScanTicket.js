import React, { Component } from 'react';
import Header from './Header';
import QrScanner from './qr';
import axios from 'axios';
import config from '../config.js';

class ScanTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      codeFound: false,
      searching: true,
      ticketFound: false,
      movie: '',
      seanss: ''
    }
    this.searchTicket = this.searchTicket.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.addZero = this.addZero.bind(this);
  }
  formatDate(date) {
    if (date && date.length > 0) {
      let theDate = new Date(date);
      var day = theDate.getDate();
      var monthIndex = theDate.getMonth();
      var year = theDate.getFullYear();
      var hours = this.addZero(theDate.getUTCHours());
      var min = this.addZero(theDate.getMinutes());
      return day + '. ' + config.monthNames[monthIndex] + ', ' + year + ' - '+hours+':'+min;
    } else {
      return '';
    }
  }
  addZero(i) {
      if (i < 10) {
          i = "0" + i;
      }
      return i;
  }
  searchTicket() {
    this.setState({searching: true})
    console.log('searching');
    axios.get(config.server+'/api/get-ticket/'+this.state.code)
    .then((response)=>{
      this.setState({
        seanss: response.data.seanss,
        seats: response.data.seats,
        valid: response.data.valid
      })
      console.log(response);
      axios.get(config.server+'/api/filmas/'+response.data.movie)
      .then((response)=>{
        console.log(response);
        this.setState({movie: response.data, searching: false, ticketFound: true});
      })
      .catch((err)=>{
        this.setState({searching: false, ticketFound: false})
      });
    })
    .catch((err)=>{
      this.setState({searching: false, ticketFound: false})
    });
  }
  componentDidMount() {
    navigator.mediaDevices.getUserMedia({video: { facingMode: "environment" }, audio: false})
    .then(mediaStream => {
      /* mediaStream.getTracks()[0].stop();
      document.getElementById('qr-canvas').remove();
      this.searchTicket(); */
      document.getElementById('qr-canvas').srcObject = mediaStream;
      new QrScanner(document.getElementById('qr-canvas'), result => {
        this.setState({code: result, codeFound: true});
        mediaStream.getTracks()[0].stop();
        if (document.getElementById('qr-canvas')) document.getElementById('qr-canvas').remove();
        this.searchTicket();
      });
    })
    .catch(error => console.log(error));
  }
  render() {
    let seanssInfo = 'undefined';
    const { code, codeFound, searching, ticketFound } = this.state;
    if (!this.state.searching && ticketFound) seanssInfo = this.state.movie.seansi.find((item)=>item._id === this.state.seanss);
    return(
      <div className="app-background">
        <Header path={this.props.location.pathname}/>
        {(code.length > 0 &&
          (searching ?
          <div className="container">
            <div className="row justify-content-center">
              <div className="card mb-4 mt-4 p-2 w-100 col-4">
                <div className="card-body">
                  <div className="row justify-content-center">
                    <p>{'Meklē biļeti...'}</p>
                  </div>
                  <div className="row justify-content-center mt-2">
                    <div className="loadersmall"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          :
          (ticketFound ?
          <div className="container">
            <div className="row justify-content-center">
              <div className="card mb-4 mt-4 p-2 w-100 col-4">
                <div className="card-body">
                  <div className="row justify-content-center">
                    <h4>{'Biļete atrasta'}</h4>
                  </div>
                  <div className="row justify-content-center mt-4">
                    <div className="col-12">
                      <div className="small-text">{'Filma'}</div>
                      <p className="card-text">{this.state.movie.name}</p>
                    </div>
                    <div className="col-12 mt-2">
                      <div className="small-text">{'Seanss'}</div>
                      <p className="card-text">{(seanssInfo && this.formatDate(seanssInfo.date))}</p>
                    </div>
                    <div className="col-12 mt-2">
                      <div className="small-text">{'Kopā samaksāts'}</div>
                      <p className="card-text">{(seanssInfo && `${parseFloat(seanssInfo.price * this.state.seats).toFixed(2)} €`)}</p>
                    </div>
                    <div className="col-12 mt-2">
                      <div className="small-text">{'Statuss'}</div>
                      <p className="card-text">{'Biļete ir '}{(this.state.valid ? <span style={{color: '#33d428'}}>{'derīga!'}</span> : <span style={{color: '#dc3545'}}>{'nederīga!'}</span>)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          :
          <div className="container">
            <div className="row justify-content-center">
              <div className="card mb-4 mt-4 p-2 w-100 col-4">
                <div className="card-body">
                  <div className="row justify-content-center">
                    <h4>{'Biļete netika atrasta'}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>)

        ))}
        <div id="videoArea" className="video-area">
          {(!codeFound && <video autoPlay id="qr-canvas"
            style={{
              width: '100%',
              height: '100%',
              position: 'fixed',
              zIndex: 5,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              objectFit: 'cover'
            }}
          ></video> )}
        </div>
      </div>
    );
  }
}

export default ScanTicket;
