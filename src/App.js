import Footer from './Footer';
import Header from './Header';
import Main from './Main';
import React, { Component } from 'react';
import { connect} from 'react-redux';
import { Provider } from 'react-redux';
import { createStore } from "redux";
import Reducer from './Reducer';


const store = createStore(Reducer);


class MyJsPlumb extends Component {
  constructor(props) {
    super(props);
    this.state = { rps:0 }
    this.slidechanger=this.slidechanger.bind(this);
  }
  slidechanger(e) {
    console.log("event value"+e);
    //var ref = e.target.value;
    this.setState({ rps: e });
  }

/*rpsconnection =(rpsconnection)=>{
  this.setState({rps:rpsconnection})

}*/


  render() { 
   
    return (  <div>
      <Header slidechanger={this.slidechanger}/>
    <Provider store={store}><Main rps={this.state.rps}/></Provider>
      <Footer/>
    </div>);
  }
}


export default (MyJsPlumb);


  