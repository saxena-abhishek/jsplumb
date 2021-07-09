import React, { Component } from 'react';
import { connect } from "react-redux";
import "../styles/jsplumbdemo.css";
class TextInput extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
    
        return ( <div  style={{ padding: "10px 10px " }}> <div>{this.props.instanceNameLabel}</div>
            <input
            key={this.props.id}
              style={{backgroundColor:'white'}}
              value={this.props.instanceName}
              placeholder={this.props.instanceTypeLabel}

              onChange={(e)=>this.props.handleChange(e,this.props.id)}
            ></input></div>);
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(TextInput);
  