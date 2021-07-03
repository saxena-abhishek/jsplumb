import React, { Component } from 'react';
import jsPlumb from "jsplumb/dist/js/jsplumb.min";
import "../styles/jsplumbdemo.css";
import { findPosition } from '../utils/domUtils';
import { connect } from 'react-redux';
import SlidingPanel from 'react-sliding-side-panel';
import {mapStateToProps,mapDispatchToProps} from './container';

class Main extends Component {
  
  constructor(props) {
    super(props);
    this.initialShow = this.initialShow.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.saveNodeJson = this.saveNodeJson.bind(this);
    this.traceConnections = this.traceConnections.bind(this);
    this.closeDiv = this.closeDiv.bind(this);
    this.iType=[];
    this.numberrs=[1,2,3,4,5,6]
    this.iName=[]; 
    this.state = { showDiv: false, id: '' ,showPanel:'',instanceType:'',instanceName:'',activeComponentId:'', activeNodeName:''};
  }

  handleChangeType(event) {
    this.setState({instanceType: event.target.value});
  }
  handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    this.saveConfig();
    this.setState({showPanel:false,showDiv:false ,instanceName:'',instanceType:''})
  }

  saveConfig(){
   let config={};
    config.configuration={
      InstName : this.state.instanceName,
      InstType: this.state.instanceType
    };
    config.id=this.state.id;
    this.props.updateNodeConfig(config); 
  }

  traceConnections() {    
    var connections = jsPlumb.jsPlumb.getAllConnections();
    let that = this;
    let original = { workspace: "Anirban", project: "HCL_BO" };
    if (this.props.nList) {
      for (let i = 0; i < this.props.nList.length; i++) {
        let targetIds = [];
        let sourceIds = [];
        connections.forEach(function (connection, id) {
      //  connections.map( connection => {
          if (connection.sourceId === that.props.nList[i].uniqueId) {
            targetIds.push(connection.targetId);
          }else if (connection.targetId === that.props.nList[i].uniqueId) {
            sourceIds.push(connection.sourceId);
          } 
        })  
        let config ={ id: that.props.nList[i].uniqueId,connectedTo: targetIds, connectedFrom: sourceIds }
        this.props.updateNodeConnection(config);
      }
      original.components = this.props.nList;
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
  onEdit(id,activeComponentId ,activeNodeName){
    
    this.setState({ showDiv: true, showPanel:true ,id: id ,activeComponentId:activeComponentId ,activeNodeName:activeNodeName});
    let i=this.props.nList.findIndex(node=>node.uniqueId===id);
    this.setState({instanceName:this.props.nList[i].configuration.InstName ,instanceType:this.props.nList[i].configuration.InstType})
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
      icon2.classList.add("fa", "fa-times", "fa-lg");
      var icon3 = document.createElement("span");
      icon3.classList.add("node");

      var item = this.props.nodeList.find(item => item.id === draggableElement.id);
      cloneEl.id = draggableElement.id + (++item.vc);
      icon2.id = draggableElement.id + "_cross_" + item.vc;
      dropzone.appendChild(cloneEl);
      let control = document.getElementById(cloneEl.id);
      icon2.addEventListener("click", e => this.removeNode(e, control.id), false);
      control.append(icon2);
      icon3.addEventListener("dblclick", (e) => this.onEdit(cloneEl.id ,item.componentId,id), false);
    
      control.append(icon3);

      this.props.addNode({ uniqueId: cloneEl.id, componentId: item.componentId, configuration:{},connectedTo:[],connectedFrom:[] });
//uniqueId: name, componentId: componentId,  configuration:{ variables: {instanceName : InstName , instanceType: InstType}}, connectedTo: , connectedFrom:  }
      document.getElementById(icon2.id).setAttribute("style", "top:-10px;right:-8px;position:absolute;cursor:pointer;color:red; ");
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
    jsPlumb.jsPlumb.removeAllEndpoints(el);
    jsPlumb.jsPlumb.remove(el);
    this.props.deleteNode(id);
      }

  componentDidMount() {
    this.initialShow();
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
      
   jsPlumb.jsPlumb.bind("click", function (component, event) {
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

  fetchOption(){
    let i=this.state.activeComponentId;
    return( <>{this.props.nodeList[i-1].configuration.instanceType.map((number,indx) =><option key={indx}>{number}</option>           
   )}
   </>
   )
     }

  render() {

    jsPlumb.jsPlumb.select().setLabel(this.props.rps);
    let comp = this.state.showDiv ?
    <div className="panel-container" > <div ><SlidingPanel
    type={'right'}
    isOpen={this.state.showPanel}
    size={100}
  className="panel-content"
  >
    <div style={{display:'flex',flexDirection:'column' ,textAlign:'center'}}>
     <div className="rightPanelHeader"> {this.state.activeNodeName} Configuration</div>
      {/* <div >ID : {this.state.id}</div> */}
      <div style={{padding:'10px 10px '}}>
      <div>Instance Name</div>
      <input style={{backgroundColor:'white'}} value={this.state.instanceName} name="instanceName" placeholder="Instance Name"  onChange={this.handleChange}></input>
      </div>
      Instance Type < form  className="form-group" onSubmit={this.handleSubmit}>
        <select value={this.state.instanceType} name="instanceType" onChange={this.handleChange}>
          <option>Instance Type</option>
        {this.fetchOption()}
        </select>
        <div style={{padding:'10px 10px '}}>
        <button type="submit">Save</button>
        <button onClick={() => this.setState({showPanel:false,showDiv:false ,instanceName:'',instanceType:''})}>Close</button>
        </div>
      </form>      
    </div>
  </SlidingPanel> </div> </div> : "";

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
              <button className="btn" onClick={(e)=>this.traceConnections(e)}>Validate</button>
            </div>
          </div>
        </div>
        <div style={{ padding: '20px 20px' }}></div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Main);