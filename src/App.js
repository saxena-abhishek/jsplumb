import Footer from './Footer';
import Header from './Header';
import Main from './Main';
import React, { Component } from 'react';
class MyJsPlumb extends Component {
  constructor(props) {
    super(props);
    this.state = { rps:0 }
    this.rpsconnection=this.rpsconnection.bind(this);
  }
rpsconnection =(rpsconnection)=>{
  this.setState({rps:rpsconnection})

}

  render() { 
    return (  <div>
      <Header rpsconnection={this.rpsconnection}/>
      <Main rps={this.state.rps}/>
      <Footer/>
    </div>);
  }
}
 
export default MyJsPlumb;


  