import React, { Component } from 'react';
import config from '../config.js';
import Datetime from 'react-datetime';

class Seanss extends Component {
  constructor(props) {
    super(props);
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
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var hours = this.addZero(date.getUTCHours());
    var min = this.addZero(date.getMinutes());
    return day + '. ' + config.monthNames[monthIndex] + ', ' + year + ' - '+hours+':'+min;
  }
  render() {
    const {
      id,
      place,
      price,
      date,
      editSeanssInfo,
      removeSeanss,
      saveSeanss,
      deleteSeanss,
      editing,
      frontend,
      openPopup,
      movieName,
      movieId
    } = this.props;
    let theDate = new Date(date);
    return(
      editing ?
      <form>
        <div className="form-row">
          <div className="col-6">
            <div className="small-text">{'Datums un laiks'}</div>
            <Datetime utc={true} value={date} onChange={(e)=>{
                if (typeof e.length === 'undefined')
                  editSeanssInfo(id, 'date', e.toDate())
                else editSeanssInfo(id, 'date', "")
              }
              }/>
          </div>
          <div className="col-3">
            <div className="small-text">{'Auditorija'}</div>
            <input type="number" value={place} onChange={(e)=>editSeanssInfo(id, 'place', e.target.value)} min="1" max="10" id="auditorija" className="form-control"></input>
          </div>
          <div className="col-3">
            <div className="small-text">{'Cena'}</div>
            <div className="input-group">
              <div className="input-group-prepend">
                <span className="input-group-text">{'€'}</span>
              </div>
              <input type="number" value={price} onChange={(e)=>editSeanssInfo(id, 'price', e.target.value)} min="0" step="0.01" data-number-to-fixed="2" data-number-stepfactor="100" className="form-control currency" id="c2" />
            </div>
          </div>
        </div>
        <div className="form-row mt-2">
          <div className="col w-100">
            <div className="float-right">
              <button
                disabled={!(price.length && place.length && date.toString().length)}
                type="button"
                style={{marginRight: "5px"}}
                className="btn btn-primary btn-sm"
                onClick={()=>saveSeanss(place,price,date)}
              >
                  {`Saglabāt`}
              </button>
              <button type="button" onClick={removeSeanss} className="btn btn-outline-secondary btn-sm">Atcelt</button>
            </div>
          </div>
        </div>
      </form>
      :
      <div>
        <hr></hr>
        <div className="row mb-2">
          <div className="col-xl-5 col-lg-4 col-md-4 col-sm-4 col-12">
            <div className="small-text">{'Datums un laiks'}</div>
            <div className="seanssText">{this.formatDate(theDate)}</div>
          </div>
          <div className="col-xl-2 col-lg-3 col-md-3 col-sm-3 col-12">
            <div className="small-text">{'Auditorija'}</div>
            <div className="seanssText">{place}</div>
          </div>
          <div className="col-xl-2 col-lg-2 col-md-2 col-sm-2 col-12">
            <div className="small-text">{'Cena'}</div>
            <div className="seanssText last">{`${parseFloat(price).toFixed(2)} €`}</div>
          </div>
          <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 col-12">
            {(!frontend ?
            <div onClick={()=>deleteSeanss(id)} className="float-right mt-3 btn btn-sm btn-link" style={{color: '#dc3545'}}>Dzēst</div>
            : <div onClick={()=>openPopup(movieName,place,price,date,id,movieId)} className="pull-left-sm btn btn-sm btn-link" >Pirkt biļeti</div>
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default Seanss;
