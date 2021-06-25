import React, { Component } from "react";
import "../styles/jsplumbdemo.css";
import "../styles/header.css";
import logo from '../intellogoo.png';   // <img src={process.env.PUBLIC_URL + '/intellogoo.png'} /> 
import { connect } from 'react-redux';
import { callTraceFunction } from "../Action";

class Header extends Component {
  constructor(props) {
    super(props);
    this.launchBenchmark=this.launchBenchmark.bind(this)
    this.state = { rps: 0 , validate:false };
   
  }
  slidechanger(e) {
    this.setState({ rps: e });  
    this.props.slidechanger(e);
    if(e===0){
      document.documentElement.style.setProperty('background-color', "white");
    }
    document.documentElement.style.setProperty('--white-color', e);
  }

launchBenchmark(){
  console.log(this.state.validate,"validate")
  this.setState({validate:true})
  console.log(this.state.validate,"validate")
}


  render() {
    return (
      <div style={{display:'flex' , flexDirection:'column'}}>
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
                <button onClick={()=>this.props.callTracefunc({launchh:true})}>Launch Benchmark</button>
                <button>Cancel</button>
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
  // todo: state.todos[ownProps.id],
  status: state
})

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    // increment: () => dispatch({ type: 'INCREMENT' }),
    callTracefunc:data=>dispatch(callTraceFunction(data))

  }
}

export default connect(mapStateToProps, mapDispatchToProps)( Header);
