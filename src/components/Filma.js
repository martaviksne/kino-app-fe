import React, { Component } from 'react';
import config from '../config.js';
import Seanss from './Seanss';
import axios from 'axios';

class Filma extends Component {
  constructor(props) {
    super(props);
    this.state = {
      poster: '',
      seansi: this.props.seansi
    }
    this.selectPoster = this.selectPoster.bind(this);
    this.addSeanss = this.addSeanss.bind(this);
    this.editSeanssInfo = this.editSeanssInfo.bind(this);
    this.removeSeanss = this.removeSeanss.bind(this);
    this.saveSeanss = this.saveSeanss.bind(this);
    this.deleteSeanss = this.deleteSeanss.bind(this);
  }
  selectPoster(e) {
    this.setState({poster:e.target.files[0]});
  }
  addSeanss() {
    let newSeanss = {
      id: this.state.seansi.length,
      date: "",
      place: "",
      price: "",
      editing: true
    }
    let seansiArray = this.state.seansi;
    seansiArray.push(newSeanss);
    this.setState({seansi: seansiArray});
  }
  editSeanssInfo(id, key, value) {
    let seansiArray = this.state.seansi;
    seansiArray[seansiArray.findIndex(item => item.id === id)][key] = value;
    this.setState({seansi: seansiArray});
  }
  removeSeanss() {
    let seansiArray = this.state.seansi;
    seansiArray.pop();
    this.setState({filmas: seansiArray});
  }
  deleteSeanss(id) {
    const index = this.state.seansi.findIndex(item => item.id === id);
    console.log(index);
    let newSeansi = this.state.seansi;
    newSeansi.splice(index, 1);
    axios.put(config.server+'/api/filmas/'+this.props.id, {seansi: newSeansi})
    .then((response) => {
      this.setState({seansi: newSeansi});
    })
    .catch(function (error) {
      console.log('error', error);
    });
  }
  saveSeanss(place,price,date) {
    axios.get(config.server+'/api/filmas/'+this.props.id)
    .then((response)=>{
      let seansi = response.data.seansi;
      seansi.push({
        date, price, place
      });
      axios.put(config.server+'/api/filmas/'+this.props.id, {seansi: seansi})
      .then(()=>{
        axios.get(config.server+'/api/filmas/'+this.props.id)
        .then((next_response)=>{
            let seansiList = next_response.data.seansi;
            seansiList.forEach((item)=>{
              item.editing = false;
              item.id = item._id;
            })
            this.setState({seansi: seansiList});
          })
          .catch((err)=>{
            console.log('error', err);
          });
      })
      .catch((err)=>{
        console.log('error', err);
      })
    })
    .catch((err)=>{
      console.log('error', err);
    })
  }
  render() {
    const {
      id,
      name,
      editing,
      notSaved,
      director,
      genre,
      description,
      poster,
      frontend
    } = this.props;
    let addDisabled = (typeof this.state.seansi !== 'undefined' && typeof this.state.seansi.find(item => item.editing === true) !== 'undefined');
    return(
      !frontend ?
      <div className="col-6 d-flex">
        <div className="card mb-4 p-2 w-100">
          <div className="card-body">
            <div className="row">
                {(poster &&
                  <div className="col-auto">
                    <img className="card-img-bottom card-img-top" style={{width:"150px"}} src={config.server+'/'+poster} alt={name}/>
                  </div>
                )}
              {((editing || notSaved) ?
              <div className="col">
                <div className="small-text w-100">{'Nosaukums'}</div>
                <div className="input-group mb-3">
                  <input type="text" className="form-control" onChange={(e)=>this.props.editInfo(id, 'name', e.target.value)} value={name} placeholder="Nosaukums"></input>
                </div>
                <div className="small-text w-100">{'Žanrs'}</div>
                <div className="input-group mb-3">
                  <input type="text" className="form-control" onChange={(e)=>this.props.editInfo(id, 'genre', e.target.value)} value={genre} placeholder="Žanrs"></input>
                </div>
                <div className="small-text w-100">{'Režisors'}</div>
                <div className="input-group mb-3">
                  <input type="text" className="form-control" onChange={(e)=>this.props.editInfo(id, 'director', e.target.value)} value={director} placeholder="Režisors"></input>
                </div>
                <div className="small-text w-100">{'Apraksts'}</div>
                <div className="input-group mb-3">
                  <textarea style={{resize:'none'}} className="form-control" onChange={(e)=>this.props.editInfo(id, 'description', e.target.value)} value={description} placeholder="Apraksts" rows={3}></textarea>
                </div>
                {(notSaved &&
                <div className="input-group mb-3">
                  <label className="text-muted w-100">{'Filmas plakāts'} </label>
                  <input type="file" onChange={this.selectPoster}></input>
                </div> )}
                <button
                  disabled={!(name.length && genre.length && director.length && description.length)}
                  type="button"
                  style={{marginRight: "5px"}}
                  className="btn btn-primary btn-sm"
                  onClick={()=>(notSaved ? this.props.saveMovie(id, this.state.poster) : this.props.finishEditMovie(id, {
                    name,
                    genre,
                    director,
                    description
                  }))}
                >
                    {`Saglabāt`}
                </button>
                {(notSaved ?
                <button type="button" onClick={this.props.removeMovie} className="btn btn-outline-secondary btn-sm">Atcelt</button>
                : <button type="button" onClick={(e)=>this.props.editInfo(id, 'editing', false)} className="btn btn-outline-secondary btn-sm">Atcelt</button>)}
              </div>
              :
              <div className="col">
                  <div className="small-text">{'Nosaukums'}</div>
                  <h5 className="card-text">{name}</h5>
                  <div className="small-text">{'Žanrs'}</div>
                  <p className="card-text">{genre}</p>
                  <div className="small-text">{'Režisors'}</div>
                  <p className="card-text">{director}</p>
                  <div className="small-text">{'Apraksts'}</div>
                  <p className="card-text">{description}</p>
                  <hr></hr>
                  <button type="button" onClick={()=>this.props.editMovie(id)} className="btn btn-outline-secondary mr-2 btn-sm">{'Rediģēt'}</button>
                  <button type="button" onClick={()=>this.props.deleteMovie(id)} className="btn btn-outline-danger btn-sm">{'Dzēst'}</button>
              </div>)}
            </div>
            {(!notSaved &&
            <div className="row mt-4">
              <div className="col">
                <h6 className="">{'Seansi'}</h6>
                {(this.state.seansi.map((item, i) =>
                  <Seanss
                    key={i}
                    {...item}
                    editSeanssInfo={this.editSeanssInfo}
                    removeSeanss={this.removeSeanss}
                    saveSeanss={this.saveSeanss}
                    deleteSeanss={this.deleteSeanss}
                  />
                ))}
                <hr></hr>
                <button disabled={addDisabled} type="button" onClick={()=>this.addSeanss()} className="btn btn-outline-info mr-2 btn-sm">{'Pievienot jaunu seansu'}</button>
              </div>
            </div>)}
          </div>
        </div>
      </div>
      :
      <div className="col-6 d-flex">
        <div className="card mb-4 p-2 w-100">
          <div className="card-body">
            <div className="row">
                {(poster &&
                  <div className="col-auto">
                    <img className="card-img-bottom card-img-top" style={{width:"150px"}} src={config.server+'/'+poster} alt={name}/>
                  </div>
                )}
                <div className="col">
                    <div className="small-text">{'Nosaukums'}</div>
                    <h5 className="card-text">{name}</h5>
                    <div className="small-text">{'Žanrs'}</div>
                    <p className="card-text">{genre}</p>
                    <div className="small-text">{'Režisors'}</div>
                    <p className="card-text">{director}</p>
                    <div className="small-text">{'Apraksts'}</div>
                    <p className="card-text">{description}</p>
                </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Filma;
