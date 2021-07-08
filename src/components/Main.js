import React, { Component } from 'react';
import "../styles/jsplumbdemo.css";
import { findPosition } from '../utils/domUtils';
import { connect } from 'react-redux';
import ConfigDiv from './ConfigDiv';
import {mapStateToProps,mapDispatchToProps} from './container';

class Main extends Component {
  
  constructor(props) {
    super(props);
    this.closePanel=this.closePanel.bind(this)
    this.initialShow = this.initialShow.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    // this.saveNodeJson = this.saveNodeJson.bind(this);
    //this.closeDiv = this.closeDiv.bind(this);
    // this.iType=[];
    // this.numberrs=[1,2,3,4,5,6]
    // this.iName=[]; 
    this.state = { showDiv: false, id: '' ,showPanel:'',instanceType:'',instanceName:'',activeComponentId:'', activeNodeName:''};
  }

  onDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);

  }
  onDragOver(event) {
    event.preventDefault();
  }
  closePanel(){
    console.log("clcked")
    this.setState({showPanel:false,showDiv:false})
  }
  onEdit(id,activeComponentId ,activeNodeName ,icon2,icon3){
    
    this.setState({ showDiv: true, showPanel:true ,id: id ,activeComponentId:activeComponentId ,activeNodeName:activeNodeName});
    let i=this.props.nList.findIndex(node=>node.uniqueId===id);
    this.setState({instanceName:this.props.nList[i].configuration.InstName ,instanceType:this.props.nList[i].configuration.InstType})
    this.removeSelected(icon2, icon3);
  }
  
  onSelect(icon2, icon3) {
    icon2.classList.add("fa", "fa-times", "fa-lg");
    icon3.classList.add("selected");
    icon3.addEventListener(
      "click",
      (e) => this.removeSelected(icon2, icon3),
      false
    );
  }

  removeSelected(icon2, icon3) {
    icon2.classList.remove("fa", "fa-times", "fa-lg");
    icon3.classList.remove("selected");
    icon3.addEventListener("click", (e) => this.onSelect(icon2, icon3), false);
  }

  onDrop(event) {
    const id = event
      .dataTransfer
      .getData('text');
    const draggableElement = document.getElementById(id);
    
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
      var icon3 = document.createElement("span");
      icon3.classList.add("node");

      var item = this.props.nodeList.find(item => item.id === draggableElement.id);
      cloneEl.id = draggableElement.id + (++item.vc);
      icon2.id = draggableElement.id + "_cross_" + item.vc;
      dropzone.appendChild(cloneEl);
      let control = document.getElementById(cloneEl.id);
      icon2.addEventListener("click", e => this.removeNode(e, control.id), false);
    
      icon3.addEventListener(
        "click",
        (e) => this.onSelect(icon2, icon3),
        false
      );
      icon3.addEventListener(
        "dblclick",
        (e) => this.onEdit(cloneEl.id, item.componentId, id, icon2, icon3),
        false
      );
    
      control.append(icon3);
      control.append(icon2);
      

      this.props.addNode({ uniqueId: cloneEl.id, componentId: item.componentId, configuration:{},connectedTo:[],connectedFrom:[] });
//uniqueId: name, componentId: componentId,  configuration:{ variables: {instanceName : InstName , instanceType: InstType}}, connectedTo: , connectedFrom:  }
      document.getElementById(icon2.id).setAttribute("style", "top:-10px;right:-8px;position:absolute;cursor:pointer;color:red; ");
      this.props.jsplumb.draggable(cloneEl.id, { containment: true });

      this.props.jsplumb.addEndpoint(cloneEl.id, {
        jtk: "Dot",
        paintStyle: { fill: "#0071c5", outlineStroke: "white", backgroundColor: "white", outlineWidth: 1 },
        anchor: ["RightMiddle"],
        isSource: true,
        connectionType: "black-connection",
        maxConnections: -1,

      });

      this.props.jsplumb.addEndpoint(cloneEl.id, {
        jtk: "Dot",
        paintStyle: { fill: "#0071c5", outlineStroke: "white", outlineWidth: 1 },
        anchor: ["LeftMiddle"],
        isTarget: true,
        connectionType: "black-connection",
        maxConnections: -1,
      });

    } event.dataTransfer.clearData();

  }

  initialShow() {
    const box = document.getElementById("toolbox");
    for (let i = 0; i < this.props.nodeList.length; i++) {
      var control = document.createElement("div");
      control.draggable = true;
      control.classList.add("cln");
      let icon = document.createElement("i");
       switch (this.props.nodeList[i].componentId){
      case 1:
        icon.classList.add("fa","fa-times");
        var img1 = document.createElement("img");
        img1.src = "https://img.icons8.com/metro/20/0071c5/grasshopper.png";
        control.append(img1)
        break;
      case 2:
          icon.classList.add("fa","fa-file");
          control.append(icon)
          break;
      case 3:
            icon.classList.add("fa","fa-wordpress");
            control.append(icon)
            break;

      case 4:
            icon.classList.add("fa","fa-database");
            control.append(icon)
            break;
      default:
       }
     
      var text = document.createElement("span");
      text.innerHTML = this.props.nodeList[i].name;
      control.append(" ");
      control.append(text);
      control.classList.add('control');
      control.id = this.props.nodeList[i].id;
      box.append(control);
      control.addEventListener("dragstart", e => this.onDragStart(e), false);

    }
  }

  removeNode(e, id) {
    let el = document.getElementById(id);
    this.props.jsplumb.removeAllEndpoints(el);
    this.props.jsplumb.remove(el);
    this.props.deleteNode(id);
      }

  componentDidMount() {
    this.initialShow();
    let that=this;
    let canvas = document.getElementById("diagram");
    this.props.jsplumb.ready(function () {
      that.props.jsplumb.setContainer(canvas);

      that.props.jsplumb.registerConnectionTypes({
        "black-connection": {
          paintStyle: { stroke: "#0071c5" },
          hoverPaintStyle: { stroke: "red" },             
          overlays: [
            "Arrow",
            ["Label", { label: "", location: 0.25, id: "myLabel", color: 'blue', cursor: 'pointer', cssClassColor: 'red' }]

          ],
        }
      })
      
      that.props.jsplumb.bind("click", function (component, event) {
        if (component.hasClass("jtk-connector")) {
          event.preventDefault();
          var conn = that.props.jsplumb.getConnections({
            source: component.sourceId,
            target: component.targetId
          });
          if (conn[0]) {
            that.props.jsplumb.deleteConnection(conn[0]);
          }
        }
      })

      that.props.jsplumb.bind("contextmenu", (component, event) => {
        if (component.hasClass("jtk-connector")) {
          event.preventDefault();
          var conn = that.props.jsplumb.getConnections({
            source: component.sourceId,
            target: component.targetId
          });
          if (conn[0]) {
            that.props.jsplumb.deleteConnection(conn[0]);
          }
        }
      })

    });
  }

  render() {
    this.props.jsplumb.select().setLabel(this.props.rps);
    let comp = this.state.showDiv ?
    <ConfigDiv id={this.state.id} activeComponentId={this.state.activeComponentId} activeNodeName={this.state.activeNodeName} showDiv={this.state.showDiv} closePanel={this.closePanel} /> : "";

    return (
      <div className="container-fluid" >
        <div style={{ display: 'flex' }}>
          <div style={{ flex: 2 }} >
            <div id="toolbox" className="justify-content-center" >
            </div>
          </div>
          <div style={{ flex: 7 }} >
            <div id="diagram" style={{ height: "90vh", position: 'relative' }} onDragOver={(e) => this.onDragOver(e)}
              onDrop={(event) => this.onDrop(event)}  ><div id="config-items">{comp}</div>
            </div>
          </div>
        </div>
        <div style={{ padding: '20px 20px' }}></div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);