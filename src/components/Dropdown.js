import React, { Component } from 'react';
import "../styles/jsplumbdemo.css";
class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return (   <div>  {this.props.instanceTypeLabel}
        <form className="form-group" onSubmit={this.props.handleSubmit}>
          <select
            value={this.props.instanceType}
            onChange={this.props.handleChangeType}
          >
            <option> {this.props.instanceTypeLabel}</option>
            {this.props.fetchOption()}
          </select>
          <div style={{ padding: "10px 10px " }}>
            <button type="submit">Save</button>
            <button
              onClick={this.props.onClose}
            >
              Close
            </button>
          </div>
        </form></div>);
    }
}
 
export default Dropdown;