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
      editing
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
      <div className="row mb-2">
        <div className="col-5">
          <div className="small-text">{'Datums un laiks'}</div>
          {this.formatDate(theDate)}
        </div>
        <div className="col-2">
          <div className="small-text">{'Auditorija'}</div>
          {place}
        </div>
        <div className="col-2">
          <div className="small-text">{'Cena'}</div>
          {`${parseFloat(price).toFixed(2)} €`}
        </div>
        <div className="col-3">
          <div onClick={()=>deleteSeanss(id)} className="float-right mt-3 btn btn-sm btn-link" style={{color: '#dc3545'}}>Dzēst</div>
        </div>
      </div>
    )
  }
}

export default Seanss;
