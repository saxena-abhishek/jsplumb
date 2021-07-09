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
              placeholder={this.props.rightPanelItems[0].label}

              onChange={(e)=>this.props.handleChangeName(e,this.props.id)}

              // onChange={this.props.handleChangeName}
              // <button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
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
  