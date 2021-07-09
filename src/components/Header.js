import React, { Component } from "react";
import "../styles/jsplumbdemo.css";
import "../styles/header.css";
import logo from '../intellogoo.png';   // <img src={process.env.PUBLIC_URL + '/intellogoo.png'} />
import { connect } from 'react-redux';
import {mapStateToProps,mapDispatchToProps} from './container'; 
import { toast,ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { rps: 0 ,loading:false};
    this.traceConnections=this.traceConnections.bind(this);
  }
  slidechanger(e) {
    this.setState({ rps: e });  
    this.props.slidechanger(e);
    if(e===0){
      document.documentElement.style.setProperty('background-color', "white");
    }
    document.documentElement.style.setProperty('--white-color', e);
  }

  callApi(data) {
    console.log("called api");
    
    fetch("http://65.1.81.30:5000/api/v1/terraform-manager/deploy", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {},
    })
      .then((response) => {
        this.setState({ loading: false });
        this.notify(true);
      })
      .catch((error) => {
        this.setState({ loading: false });
        this.notify(false);
      });
      
  }

  traceConnections(download) {   
    this.setState({ loading: true }) 
    var connections = this.props.jsplumb.getAllConnections();
    let that = this;
    let original = { workspace: "Anirban", project: "HCL_BO" };
    if (this.props.nList) {
      for (let i = 0; i < this.props.nList.length; i++) {
        let targetIds = [];
        let sourceIds = [];
        connections.forEach(function (connection, id) {
      //  connections.map( connection => {
          if (connection.sourceId === that.props.nList[i].uniqueId) {
            targetIds.push(connection.targetId);
          }else if (connection.targetId === that.props.nList[i].uniqueId) {
            sourceIds.push(connection.sourceId);
          } 
        })  
        let config ={ id: that.props.nList[i].uniqueId,connectedTo: targetIds, connectedFrom: sourceIds }
        this.props.updateNodeConnection(config);
      }
      original.components = this.props.nList;
    }
    console.log("format:" + JSON.stringify(original));
    if(download===true){
      this.download(original);
  }
    else{this.callApi(original);}
  }

  download(data) {
    fetch("http://65.1.81.30:5000/files", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {},
    })
      .then((response) => response.blob())
      .then((zipFile) => {
        this.setState({ loading: false });
        var blob = zipFile;
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "terraform-scripts";
        link.click();
        // this.notify(true)
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }

  notify=(isApiSuccess)=>{
    console.log("called notify")
    isApiSuccess
      ? 
     // alert("success")
      toast(
          <div style={{ backgroundColor: "#d4edda", color: "green" }}>
            Deployment Initiated
          </div>,
          { position: toast.POSITION.TOP_CENTER }
        )
      :
       toast(
          <div style={{ backgroundColor: "#f8d7da", color: "red" }}>
            Deployment Failed
          </div>,
          { position: toast.POSITION.TOP_CENTER }
        );
      //alert("faliure")
  };
  render() {
    return (
      <div style={{display:'flex' , flexDirection:'column'}}>
          {this.state.loading ? <div class="loading"> Loading </div> : null}
      <div style={{flex:1 , borderBottomStyle:'groove', borderWidth: '1px' , color:'#0071c5' , fontSize:'22px'}}><img src={logo} alt="Logo" style={{width:'65px',top:'0px'}} />     Benchmark Topology</div>
      <div style={{ display: "flex", textAlign: "center",flex:3 , backgroundColor:'#E7E7E7'}}>
        <div style={{ display: "flex", flexDirection: "column", flex: 2 }}>
          <div style={{ flex: 2 }}></div>
          <div style={{ flex: 1 ,color:'#0071c5', fontSize:'17px'}}>Load Condition(RPS):{this.state.rps}</div>
          <div id="sliderbox" >
          <input
            onChange={(e)=>this.slidechanger(e.target.value)}
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
        <div style={{ flex: 2,backgroundColor:'#E7E7E7'}}>
          <div style={{fontWeight:600 ,fontSize:'20px'}}></div>
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
              <div style={{ flex: 1 }}></div>
              <div style={{ flex: 2 }}>
                <button onClick={()=>this.traceConnections(false)}>Deploy</button>
                <button onClick={()=>this.traceConnections(true)}>Download</button>
                <ToastContainer autoClose={2000} />
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    );
  }
}

export default  connect(mapStateToProps, mapDispatchToProps)(Header);
