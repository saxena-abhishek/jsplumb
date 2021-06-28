import React, { Component } from "react";
import "../styles/jsplumbdemo.css";
import "../styles/header.css";
import logo from '../intellogoo.png';   // <img src={process.env.PUBLIC_URL + '/intellogoo.png'} /> 
import { connect } from 'react-redux';
import { callTraceFunction, callDownloadFunction } from "../Action";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
toast.configure()

class Header extends Component {
  constructor(props) {
    super(props);
    this.launchBenchmark = this.launchBenchmark.bind(this);
    this.downloadBenchmark = this.downloadBenchmark.bind(this);
    this.state = { rps: 0, validate: false, apiSuccess: false };
    this.responce = [];
    this.apiS = '';


  }
  slidechanger(e) {
    this.setState({ rps: e });
    this.props.slidechanger(e);
    if (e === 0) {
      document.documentElement.style.setProperty('background-color', "white");
    }
    document.documentElement.style.setProperty('--white-color', e);
  }

  launchBenchmark() {
    this.props.callTracefunc({ launchh: true })
   //this.callApi()
  }

  downloadBenchmark() {
    this.props.callDownloadfunc({ download: true })
  //  this.download();
  }

  download() {
    this.responce = axios.get(`http://65.1.81.30:5000/files`)
      .then(res => {
        this.setState({ apiSuccess: true })
        this.notify(this.state.apiSuccess)
        console.log(res, "success")
      }).catch(err => { console.log(err, "err"); this.notify(this.state.apiSuccess) })
  }


  callApi() {
    this.responce = axios.get(`http://65.1.81.30:5000/api/v1/terraform-manager/deploy`)
      .then(res => {
        this.setState({ apiSuccess: true })
        this.notify(this.state.apiSuccess)
        console.log(res, "success")
      }).catch(err => { console.log(err, "err"); this.notify(this.state.apiSuccess) })


  }

  notify = (isApiSuccess) => {
    isApiSuccess ?
      toast(<div style={{ backgroundColor: '#d4edda', color: 'green' }}> Launch Succeed</div>, { position: toast.POSITION.TOP_CENTER }) : toast(<div style={{ backgroundColor: '#f8d7da', color: 'red' }}> Launch Failed</div>, { position: toast.POSITION.TOP_CENTER })
  }


  render() {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, borderBottomStyle: 'groove', borderWidth: '1px', color: '#0071c5', fontSize: '22px' }}><img src={logo} alt="Logo" style={{ width: '65px', top: '0px' }} />     Benchmark Topology</div>
        <div style={{ display: "flex", textAlign: "center", flex: 3, backgroundColor: '#E7E7E7' }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 2 }}>
            <div style={{ flex: 2 }}></div>
            <div style={{ flex: 1, color: '#0071c5', fontSize: '17px' }}>Load Condition(RPS):{this.state.rps}</div>
            <div id="sliderbox" >
              <input
                onChange={(e) => this.slidechanger(e.target.value)}
                id="slider"
                className="slider"
                value={this.state.rps}
                type="range"
                min="0"
                max="500"
              ></input>
            </div>
            <div style={{ flex: 1 }}></div>
          </div>
          <div style={{ flex: 2, backgroundColor: '#E7E7E7' }}>
            <div style={{ fontWeight: 600, fontSize: '20px' }}></div>
            <table>
              <thead>
                <tr><th>Configure Distribution Percentage</th></tr>
              </thead>
            </table>
            <table>
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Destination</th>
                  <th>% of Load</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Load Balancer</td>
                  <td>Wordpress</td>
                  <td>
                    <input />
                  </td>
                </tr>
                <tr>
                  <td>Wordpress</td>
                  <td>MySQL database</td>
                  <td>
                    <input />
                  </td>
                </tr>
                <tr>
                  <td>Wordpress</td>
                  <td>Static Server</td>
                  <td>
                    <input />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
            <div style={{ flex: 3 }}></div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex" }}>

                <div style={{ flex: 3 }}>
                  <button onClick={this.launchBenchmark}>Launch Benchmark</button>
                  <button onClick={this.downloadBenchmark}>Download</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => ({
  status: state
})

const mapDispatchToProps = (dispatch) => {
  return {
    callTracefunc: data => dispatch(callTraceFunction(data)),
    callDownloadfunc: data => dispatch(callDownloadFunction(data)),

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
