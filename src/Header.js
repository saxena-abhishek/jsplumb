import React, { Component } from "react";
import ReactTable from "react-table";
import "./jsplumbdemo.css";
import "./header.css";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = { rps: 0 };
    this.slidechanger = this.slidechanger.bind(this);
  }
  slidechanger(e) {
    var ref = e.target.value;
    this.setState({ rps: ref });
  }
  render() {
    return (
      <div style={{ display: "flex", textAlign: "center" }}>
        <div style={{ flex: 2 }}>
          <div>Load Condition(RPS):{this.state.rps}</div>
          <input
            onChange={this.slidechanger}
            id="my"
            className="slider"
            value={this.state.rps}
            type="range"
            min="0"
            max="1000"
          ></input>
        </div>
        <div style={{ flex: 2 }}>
          <table>
            <thead>
              <th>Configure Distribution Percentage</th>
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
                <button>Launch Benchmark</button>
                <button>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
