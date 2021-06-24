import Footer from './components/Footer';
import Header from './components/Header';
import Main from './components/Main';
import React, { Component } from 'react';


class MyJsPlumb extends Component {
  constructor(props) {
    super(props);
    this.state = { rps:0 }
    this.slidechanger=this.slidechanger.bind(this);
  }
  slidechanger(e) {
    //console.log("event value"+e);
    //var ref = e.target.value;
    this.setState({ rps: e });
  }
  saveConnections(nodes,nodeConnections){


  }

/*rpsconnection =(rpsconnection)=>{
  this.setState({rps:rpsconnection})

}*/

  render() { 
    return (  <div>
      <Header slidechanger={this.slidechanger}/>
      <Main rps={this.state.rps}/>
      <Footer/>
    </div>);
  }
}
 
export default MyJsPlumb;


  