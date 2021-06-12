import React, { Component } from 'react';
import jsPlumb from "jsplumb/dist/js/jsplumb.min";
import "./jsplumbdemo.css";
import { findPosition } from './utils/domUtils';

class Main extends Component {
    constructor(props){
        super(props);
       this.initialShow = this.initialShow.bind(this);
       this.onDragStart = this.onDragStart.bind(this);
       this.saveNodeJson = this.saveNodeJson.bind(this);
       this.nodenames = [];
       this.instance ='';
       this.connectorProperties={};
      }
      
      saveNodeJson() {
        var testContainer = document.querySelector('#diagram');
        var controls = testContainer.querySelectorAll('.control');
        console.log(controls);
        if (window.NodeList && !NodeList.prototype.map) {
            NodeList.prototype.map = Array.prototype.map;
          }
       var nodes = controls.map(item=> {
            return {
                id: item.id,
            }
        });      
        var connections = jsPlumb.jsPlumb.getAllConnections();
        var tryht = [];
        console.log(connections);
        connections.forEach(function (connection, id ) {
          tryht.push({
                SourceId: connection.sourceId,
                TargetId: connection.targetId
            });
        });
        const json = JSON.stringify({ nodes, tryht });
        console.log(json);
        }
      onDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
      
       // console.log(event.currentTarget.id);
      }
      onDragOver(event) {
        event.preventDefault();
      }
      onDrop(event) {
        const id = event
          .dataTransfer
          .getData('text'); 
      
        const draggableElement = document.getElementById(id);
        if(draggableElement.classList.contains('cln')){
          let cloneEl = draggableElement.cloneNode(true);
          const dropzone = event.target;
          let positionX;
          let positionY;
          const position= findPosition(dropzone);
          positionX = event.clientX - position.x;
          positionY = event.clientY - position.y;
      
          cloneEl.setAttribute("style","top:" + positionY + "px; left:" + positionX + "px;");
         
         // cloneEl.classList.add("");
          var item = this.nodenames.findIndex(item => item.id === draggableElement.id);
          cloneEl.id=draggableElement.id+(++this.nodenames[item].vc);
          let iel = document.createElement("i");
          iel.setAttribute("class","fa fa-times"); 
          cloneEl.appendChild(iel);
          dropzone.appendChild(cloneEl);
          /*cloneEl.dblclick(function(e) {
            jsPlumb.jsPlumb.detachAllConnections($(this));
            $(this).remove();
            e.stopPropagation();
          }); */        
          cloneEl.addEventListener("click",this.removeNode(iel.id),false);
          jsPlumb.jsPlumb.draggable(cloneEl.id, { containment: true });
         // jsPlumb.jsPlumb.addEndpoint(cloneEl.id,this.connectorProperties)
          jsPlumb.jsPlumb.addEndpoint(cloneEl.id, {
            endpoint: "Dot",
            paintStyle:{ fill:"#0071c5", outlineStroke:"white", outlineWidth:1 },
            anchor: ["RightMiddle"],
            isSource: true,
            connectionType: "black-connection",
            maxConnections: -1,
          });
      
          jsPlumb.jsPlumb.addEndpoint(cloneEl.id, {
            endpoint: "Dot",
            paintStyle:{ fill:"#0071c5", outlineStroke:"white", outlineWidth:1 },
            anchor: ["LeftMiddle"],
            isTarget: true,
            connectionType: "black-connection",
            maxConnections: -1,
          });//*/
        }event.dataTransfer.clearData();
      }
        removeNode(e){
          console.log("remove node clicked"+e);
          jsPlumb.jsPlumb.removeAllEndpoints(e);
          //jsPlumb.jsPlumb.detachAllConnections(e);//document.getElementById(e));
          jsPlumb.jsPlumb.remove(e);
        }
        initialShow(){
          //let index = 0;
          const box = document.getElementById("toolbox");
          this.nodenames = [
              { id: 'nginx', name: 'Nginx', icon: 'fa-file',vc:0 },
              { id: 'wordpress', name: 'Wordpress', icon: 'fa-wordpress',vc:0 },
              { id: 'mysql', name: 'MySQL', icon: 'fa-database',vc:0 }
          ]
      
          for (let i = 0; i < this.nodenames.length; i++) {
              var control = document.createElement("div");
              control.draggable=true;
              control.classList.add("cln");
              var icon = document.createElement("i");
              let iconclass = this.nodenames[i].icon;
              icon.classList.add("fa", iconclass);
              control.append(icon);
              var text = document.createElement("span");
              text.innerHTML = this.nodenames[i].name;
              control.append(text);
              control.classList.add('control');
              control.id = this.nodenames[i].id; 
              box.append(control);
              control.addEventListener("dragstart",e=>this.onDragStart(e),false);        
          }
        }
      
  componentDidMount() {
      this.initialShow();
      let canvas=document.getElementById("diagram");
      jsPlumb.jsPlumb.ready(function() {
      jsPlumb.jsPlumb.setContainer(canvas);
      //saloni
      jsPlumb.jsPlumb.registerConnectionTypes({
          "red-connection": {
            paintStyle: { stroke: "red", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "red", strokeWidth: 8 },
            connector:"Flowchart",// ["StateMachine", {curviness:0.001}],
            /*connectorOverlays:
              [ 
                "Arrow", 
                { location: [0.5, 0.5], width: 40, length: 40 } 
              
            ],*/
           // connector: "Flowchart",
            //connectorOverlays:[["Arrow", { location:0.99, width:70, length:70 } ]],
            endpoint: ["Dot", { radius: 1 }],
          }
            })
     jsPlumb.jsPlumb.bind("connection",(info)=>{
        console.log("connection h")//+info)
        let el =info.connection.id;
        console.log(el);
     });
     jsPlumb.jsPlumb.bind("contextmenu", (component, event) => {
        if(component.hasClass("jtk-connector")){
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
    //      jsPlumb.jsPlumb.fire("jsPlumbDemoLoaded", j);
          });
        }
      
        render() {
          return (
        <div className="container-fluid" >
            <div style={{display:'flex'}}>
              <div style={{flex:2}} >
                <div id="toolbox" className="justify-content-center" >
                </div>
              </div>
              <div style={{flex:7}} >
                <div id="diagram" style={{height: "90vh", position: 'relative'}} onDragOver={(e)=>this.onDragOver(e)}
                onDrop={(event)=>this.onDrop(event)} >
                  <button className="btn" onClick={this.saveNodeJson}>Save Connections</button>
                </div>
              </div>
            </div>
            <div style={{padding:'18px 18px'}}></div>
          </div>
          );
        }
}
 
export default Main;