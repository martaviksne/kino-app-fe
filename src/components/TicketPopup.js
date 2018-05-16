import React, { Component } from 'react';
import './bootstrap.css';
import config from '../config.js';
var QRCode = require('qrcode.react');
var Recaptcha = require('react-recaptcha');

class TicketPopup extends Component {
  formatDate(date) {
    if (date.length > 0) {
      let theDate = new Date(date);
      var day = theDate.getDate();
      var monthIndex = theDate.getMonth();
      var year = theDate.getFullYear();
      var hours = this.addZero(theDate.getUTCHours());
      var min = this.addZero(theDate.getMinutes());
      return day + '. ' + config.monthNames2[monthIndex] + ', ' + year + ' - '+hours+':'+min;
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
  render() {
    const {
      popupClosed,
      ticketCount,
      modalTitle,
      movieName,
      moviePlace,
      moviePrice,
      movieDate,
      changeTicketCount,
      ticketBought,
      ticketCode,
      seanssId,
      movieId,
      buying,
      captcha
    } = this.props;
    return(
      <div className="modal fade show" style={{display:(popupClosed ? 'none' : 'block')}} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{modalTitle}</h5>
              <button type="button" style={{outline:0}} onClick={this.props.togglePopup} className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {((!ticketBought && !ticketCode) ?
              <div className="container">
                <p>{'Pirkt biļeti uz '}<b>{movieName}</b>{' auditorijā '}<b>{moviePlace}</b>{' uz seansu '}<b>{this.formatDate(movieDate)}</b></p>
                <form>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="inputAddress">Skaits</label>
                      <input onChange={(e)=>{changeTicketCount(e.target.value)}} type="number" className="form-control" value={ticketCount} id="inputAddress" min={1} max={40}/>
                    </div>
                  </div>
                  <div className="form-row">
                    <Recaptcha
                      ref="recaptcha"
                      sitekey="6LdTVlkUAAAAADqWZgQePqjmY7fiqUrY9kkZ1AaR"
                      verifyCallback={captcha}
                    />
                  </div>
                </form>
              </div>
              :
              <div className="container">
                <div className="row justify-content-center">
                  <p>{'Jūsu biļetes QR kods'}</p>
                </div>
                <div className="row justify-content-center">
                  <QRCode value={ticketCode} />
                </div>
                <hr></hr>
                <div className="row mt-4 justify-content-center">
                  <h6>{`Samaksāts: ${parseFloat(moviePrice * ticketCount).toFixed(2)} €`}</h6>
                </div>
              </div>
              )}
            </div>
            <div className="modal-footer">
              {(!ticketBought && !ticketCode && <button disabled={buying} onClick={()=>{
                this.props.buyTicket(
                  movieName,
                  movieDate,
                  moviePlace,
                  moviePrice,
                  ticketCount,
                  seanssId,
                  movieId)
              }} type="button" className="btn btn-primary mr-auto">{`Pirkt - ${parseFloat(moviePrice * ticketCount).toFixed(2)} €`}</button>)}
              <button disabled={buying} onClick={this.props.togglePopup} type="button" className="btn btn-secondary" data-dismiss="modal">{((!ticketBought && !ticketCode) ? 'Atcelt' : 'Aizvērt')}</button>
            </div>
          </div>
        </div>
      </div>);

  }
}

export default TicketPopup;
