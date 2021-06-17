import React, { Component } from 'react';
import jsPlumb from "jsplumb/dist/js/jsplumb.min";
import "./jsplumbdemo.css";
import { findPosition } from './utils/domUtils';
import ConfigDiv from './ConfigDiv';
import { connect } from 'react-redux';


class Main extends Component {
  constructor(props) {
    super(props);

    this.initialShow = this.initialShow.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    // this.saveNodeJson = this.saveNodeJson.bind(this);
    this.traceConnections = this.traceConnections.bind(this);
    this.closeDiv = this.closeDiv.bind(this);
    this.nodenames = [];
    this.nList = [];
    this.state = { nodeList: [], nodeConnections: [], showDiv: false, id: '' };
  }
  traceConnections() {
    var connections = jsPlumb.jsPlumb.getAllConnections();
    let that = this;
    let original = { workspace: "Anirban", project: "HCL_BO" };
    let targetIds = [];
    let comp = [];
    if (this.nList) {

      for (let i = 0; i < this.nList.length; i++) {
        connections.forEach(function (connection, id) {
          if (connection.sourceId === that.nList[i].name) {
            targetIds.push(connection.targetId);
          }
        })
        comp.push({ uniqueId: that.nList[i].name, componentId: that.nList[i].componentId, configuration: [], connectedTo: targetIds, connectedFrom: that.nList[i].depth })
        targetIds = [];
      }
      original.components = comp;
    }

    console.log("format:" + JSON.stringify(original));
    this.callApi(original);
  }

  callApi(data) {
    fetch("http://65.1.81.30:5000/ec2/deploy", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { }
    })

      .then(response => response.json())
      .then(json => console.log(json));
  }

  validate() {
    console.log("validated!");
  }
  onDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);

  }
  onDragOver(event) {
    event.preventDefault();
  }

  onDrop(event) {
    const id = event
      .dataTransfer
      .getData('text');


    const draggableElement = document.getElementById(id);
    console.log(id);
    if (draggableElement.classList.contains('cln')) {
      let cloneEl = draggableElement.cloneNode(true);
      const dropzone = event.target;
      let positionX;
      let positionY;
      const position = findPosition(dropzone);
      positionX = event.pageX - position.x;
      positionY = event.pageY - position.y;

      cloneEl.setAttribute("style", "top:" + positionY + "px; left:" + positionX + "px;");
      var icon2 = document.createElement("i");
      icon2.type = "button";
      icon2.classList.add("fa", "fa-times", "fa-lg");
      var icon3 = document.createElement("i");
      icon3.type = "button";
      icon3.classList.add("fa", "fa-pencil");

      var item = this.props.nodeList.find(item => item.id === draggableElement.id);
      cloneEl.id = draggableElement.id + (++item.vc);
      icon2.id = draggableElement.id + "_cross_" + item.vc;
      dropzone.appendChild(cloneEl);
      let control = document.getElementById(cloneEl.id);
      icon2.addEventListener("click", e => this.removeNode(e, control.id), false);
      control.append(icon2);
      icon3.addEventListener("click", e => this.setState({ showDiv: true, id: cloneEl.id }), false);
      control.append(icon3);

      this.nList.push({ name: cloneEl.id, componentId: item.componentId, depth: [] });

      document.getElementById(icon2.id).setAttribute("style", "top:-12px;right:-8px;position:absolute;cursor:pointer;color:red; ");
      jsPlumb.jsPlumb.draggable(cloneEl.id, { containment: true });

      jsPlumb.jsPlumb.addEndpoint(cloneEl.id, {
        jtk: "Dot",
        paintStyle: { fill: "#0071c5", outlineStroke: "white", backgroundColor: "white", outlineWidth: 1 },
        anchor: ["RightMiddle"],
        isSource: true,
        connectionType: "black-connection",
        maxConnections: -1,

      });

      jsPlumb.jsPlumb.addEndpoint(cloneEl.id, {
        jtk: "Dot",
        paintStyle: { fill: "#0071c5", outlineStroke: "white", outlineWidth: 1 },
        anchor: ["LeftMiddle"],
        isTarget: true,
        connectionType: "black-connection",
        maxConnections: -1,
      });
      this.nodesListGenerate();
    } event.dataTransfer.clearData();

  }
  nodesListGenerate() {
    var testContainer = document.querySelector('#diagram');
    var controls = testContainer.querySelectorAll('.control');

    if (window.NodeList && !NodeList.prototype.map) {
      NodeList.prototype.map = Array.prototype.map;
    }
    var nodes = controls.map(item => {
      return {
        id: item.id,
      }
    });
    this.setState({ nodeList: nodes });
  }

  initialShow() {
    const box = document.getElementById("toolbox");
    this.nodenames = [
      { id: 'nginx', name: 'Nginx', icon: 'fa-file', vc: 0, stat: true },
      { id: 'wordpress', name: 'Wordpress', icon: 'fa-wordpress', vc: 0, stat: true },
      { id: 'mysql', name: 'MySQL', icon: 'fa-database', vc: 0, stat: true },
      { id: 'locust', name: 'Locust', icon: 'fa', vc: 0, stat: false }
    ]

    for (let i = 0; i < this.props.nodeList.length; i++) {
      var control = document.createElement("div");
      control.draggable = true;
      control.classList.add("cln");
      //var icon = document.createElement("i");
      //let iconclass = this.nodenames[i].icon;
      //icon.classList.add("fa", iconclass);
      //var img1 = document.createElement("img");
      // img1.src = "https://img.icons8.com/metro/20/0071c5/grasshopper.png";
      // if(this.nodenames[i].stat){
      // control.append(icon);
      //}          
      //else{
      // control.append(img1)
      //}
      var text = document.createElement("span");
      text.innerHTML = this.props.nodeList[i].name;
      //control.append("  ");
      control.append(text);
      control.classList.add('control');
      control.id = this.props.nodeList[i].id;
      box.append(control);
      control.addEventListener("dragstart", e => this.onDragStart(e), false);

    }
  }

  removeNode(e, id) {
    let el = document.getElementById(id);
    jsPlumb.jsPlumb.removeAllEndpoints(el);
    jsPlumb.jsPlumb.remove(el);
  }

  componentDidMount() {
    this.initialShow();
    let that = this;
    let canvas = document.getElementById("diagram");
    jsPlumb.jsPlumb.ready(function () {
      jsPlumb.jsPlumb.setContainer(canvas);


      jsPlumb.jsPlumb.registerConnectionTypes({
        "black-connection": {
          paintStyle: { stroke: "#0071c5" },
          hoverPaintStyle: { stroke: "red" },
          // connector: ["StateMachine", {curviness:0.7}],               
          overlays: [
            "Arrow",
            ["Label", { label: "", location: 0.25, id: "myLabel", color: 'blue', cursor: 'pointer', cssClass: 'fa fa-times red-color', cssClassColor: 'red' }]

          ],
        }
      })

      jsPlumb.jsPlumb.bind("connection", (info) => {
        let i = that.nList.findIndex(item => item.name === info.targetId);
        let li = that.nList.findIndex(item => item.name === info.sourceId);

        that.nList[i].depth.push(info.sourceId);
        console.log(that.nList[i].depth);
        that.nList[i].depth = (that.nList[i].depth).concat(that.nList[li].depth)

      });
      jsPlumb.jsPlumb.bind("contextmenu", (component, event) => {
        if (component.hasClass("jtk-connector")) {
          event.preventDefault();
          var conn = jsPlumb.jsPlumb.getConnections({
            source: component.sourceId,
            target: component.targetId
          });
          if (conn[0]) {
            jsPlumb.jsPlumb.deleteConnection(conn[0]);
          }
        }
      })

    });
  }
  closeDiv(showMe) {
    console.log("then:" + showMe + "now:" + !showMe)
    this.setState({ showDiv: !showMe })
  }

  render() {

    jsPlumb.jsPlumb.select().setLabel(this.props.rps);
    let comp = this.state.showDiv ? <ConfigDiv id={this.state.id} showDiv={this.state.showDiv} closeDiv={this.closeDiv} /> : "";
    return (
      <div className="container-fluid" >
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 2 }} >
            <div id="toolbox" className="justify-content-center" >
            </div>
          </div>
          <div style={{ flex: 7 }} >

            <div id="diagram" style={{ height: "90vh", position: 'relative' }} onDragOver={(e) => this.onDragOver(e)}
              onDrop={(event) => this.onDrop(event)}  ><div id="config-items" style={{ position: 'absolute', right: '200px', backgroundColor: '#e6e6e6' }}>{comp}</div>
              <button className="btn" onClick={this.traceConnections}>Validate</button>
            </div>
          </div>
        </div>
        <div style={{ padding: '20px 20px' }}></div>
      </div>
    );
  }

}
const mapStateToProps = (state, ownProps) => ({
  // todo: state.todos[ownProps.id],
  nodeList: state.nodeList
})

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    // increment: () => dispatch({ type: 'INCREMENT' }),
    dispatch

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);