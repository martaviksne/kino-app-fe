import React, { Component } from 'react';
import config from '../config.js';
import axios from 'axios';
var QRCode = require('qrcode.react');

class Ticket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movie: '',
      seanss: '',
      fetching: true
    }
    this.formatDate = this.formatDate.bind(this);
    this.addZero = this.addZero.bind(this);
  }
  addZero(i) {
      if (i < 10) {
          i = "0" + i;
      }
      return i;
  }
  formatDate(date) {
    let theDate = new Date(date);
    var day = theDate.getDate();
    var monthIndex = theDate.getMonth();
    var year = theDate.getFullYear();
    var hours = this.addZero(theDate.getUTCHours());
    var min = this.addZero(theDate.getMinutes());
    return day + '. ' + config.monthNames[monthIndex] + ', ' + year + ' - '+hours+':'+min;
  }
  componentWillMount() {
    axios.get(config.server+'/api/filmas/'+this.props.movie)
    .then((response)=>{
      this.setState({movie: response.data, fetching: false});
    });
  }
  render() {
    const { deleteTicket, editTicket } = this.props;
    let seanssInfo = 'undefined';
    if (!this.state.fetching) seanssInfo = this.state.movie.seansi.find((item)=>item._id === this.props.seanss);
    return(
      <div className="card w-100 mt-4">
        {(this.state.fetching ?
          <p>{'Meklē datus...'}</p>
        :
        <div className="card-body">
          <div className="row">
            <div className="col-auto">
              <QRCode value={this.props.theId} />
            </div>
            <div className="col-3">
              <div className="small-text">{'Filma'}</div>
              <p className="card-text">{this.state.movie.name}</p>
              <div className="small-text">{'Seanss'}</div>
              <p className="card-text">{(seanssInfo && this.formatDate(seanssInfo.date))}</p>
            </div>
            <div className="col-3">
              <div className="small-text">{'Sēdvietu skaits'}</div>
              <p className="card-text">{this.props.seats}</p>
              <div className="small-text">{'Cena'}</div>
              <p className="card-text">{(seanssInfo && `${parseFloat(seanssInfo.price).toFixed(2)} €`)}</p>
            </div>
            <div className="col-3">
              <div className="small-text">{'Kopā samaksāts'}</div>
              <p className="card-text">{(seanssInfo && `${parseFloat(seanssInfo.price * this.props.seats).toFixed(2)} €`)}</p>
                <div className="small-text">{'Statuss'}</div>
                <p className="card-text">{(this.props.valid ? 'Derīga' : 'Nederīga')}</p>
            </div>
          </div>
          <div className="row">
            <div className="col mt-3">
              <button onClick={()=>editTicket(this.props.id, this.props.valid)} className={'btn btn-sm '+(this.props.valid ? 'btn-danger' : 'btn-primary')}>{(this.props.valid ? 'Anulēt' : 'Atjaunot')}</button>
              <button onClick={()=>deleteTicket(this.props.id)} className={'btn btn-sm btn-link'} style={{color: '#dc3545'}}>{'Dzēst'}</button>
            </div>
          </div>
        </div> )}
      </div>

    )
  }
}

export default Ticket;
