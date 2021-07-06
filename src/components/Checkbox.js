import React, { Component } from 'react';
import "../styles/jsplumbdemo.css";
import { connect } from "react-redux";



class Checkbox extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( <div><input className ="checkbox" type="checkbox" />{this.props.checkboxLabel} </div> );
    }
}
 
const mapStateToProps = (state, ownProps) => ({
    // todo: state.todos[ownProps.id],
    rightPanelItems:state.rightPanelItems
  });
  
  const mapDispatchToProps = (dispatch) => {
    return {
      dispatch
    };
  };
  
  export default connect(mapStateToProps, mapDispatchToProps)(Checkbox);
  