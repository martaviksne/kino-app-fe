import React, { Component } from 'react';
import Header from './Header';
import QrScanner from './qr';

class ScanTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: '',
      codeFound: false
    }
  }
  componentDidMount() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then(mediaStream => {
      document.getElementById('qr-canvas').srcObject = mediaStream;
      new QrScanner(document.getElementById('qr-canvas'), result => {
        this.setState({code: result, codeFound: true});
      });
    })
    .catch(error => console.log(error));
  }
  render() {
    const { code, codeFound } = this.state;
    return(
      <div className="app-background">
        <Header/>
        {(code.length > 0 && <h1>{this.state.code}</h1>)}
        <div id="videoArea" className="video-area">
          {(!codeFound && <video autoPlay id="qr-canvas"
            style={{
              width: '100%',
              height: '100%',
              position: 'fixed',
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
