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
        var connections = [];
        this.instance.getConnections().forEach(function (id, connection) {
            connections.push({
                SourceId: connection.sourceId,
                TargetId: connection.targetId
            });
        });
        const json = JSON.stringify({ nodes, connections });
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

          var item = this.nodenames.findIndex(item => item.id === draggableElement.id);
          cloneEl.id=draggableElement.id+(++this.nodenames[item].vc);
          dropzone.appendChild(cloneEl);
          jsPlumb.jsPlumb.draggable(cloneEl.id, { containment: true });
          jsPlumb.jsPlumb.addEndpoint(cloneEl.id, {
            endpoint: "Dot",
            anchor: ["RightMiddle"],
            isSource: true,
            connectionType: "red-connection",
            maxConnections: -1,
          });
      
          jsPlumb.jsPlumb.addEndpoint(cloneEl.id, {
            endpoint: "Dot",
            anchor: ["LeftMiddle"],
            isTarget: true,
            connectionType: "red-connection",
            maxConnections: -1,
          });
        }event.dataTransfer.clearData();
      }
      
        initialShow(){
          //let index = 0;
          const box = document.getElementById("toolbox");
          this.nodenames = [
              { id: 'nginx', name: 'Nginx', icon: 'fa-file',vc:0 },
              { id: 'wordpress', name: 'Wordpress', icon: 'fa-wordpress',vc:0 },
              { id: 'static', name: 'StaticServer', icon: 'fa-server',vc:0 },
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
          let that=this;
          
         // let canvas=document.getElementById("diagram");
          jsPlumb.jsPlumb.ready(function() {
            var j = jsPlumb.jsPlumb.getInstance({
              Endpoint: ["Dot", {radius: 2}],
              Connector:"StateMachine",
              HoverPaintStyle: { stroke: "red", strokeWidth: 8 },
              PaintStyle: { stroke: "red", strokeWidth: 4 },
              ConnectionOverlays: [
                  [ "Arrow", {
                      location: 1,
                      id: "arrow",
                      length: 14,
                      foldback: 0.8
                  } ],
                  [ "Label", { label: "FOO", id: "label", cssClass: "aLabel" }]
              ],
              Container: "diagram"

              // Container: canvas,
              // Connector: "StateMachine",
              // Endpoint: ["Dot", { radius: 3 }],
              // Anchor: "Center" 
            });
            j.registerConnectionType("basic", { anchor:"Continuous", connector:"StateMachine" });
      //saloni
      window.jsp = j;
      that.instance=j; 
      // jsPlumb.jsPlumb.registerConnectionTypes({
      //   "red-connection": {
      //       paintStyle: { stroke: "red", strokeWidth: 4 },
      //       hoverPaintStyle: { stroke: "red", strokeWidth: 8 },
      //       connector: "Flowchart"
      //   }
      // });
      var body = document.getElementsByTagName("body")[0];
      that.instance.bind("contextmenu", function (component, event) {
        if (component.hasClass("jtk-connector")) {
            event.preventDefault();
            window.selectedConnection = component;
            var dEl = document.createElement("div");
            dEl.classList.add("custom-menu");
            //dEl.id=
            var bEl = document.createElement("button");
            bEl.classList.add("delete-connection");
            var t = document.createTextNode("Delete connection"); 
            dEl.style.top=event.pageY + "px";
            dEl.style.left=event.pageX + "px";
            bEl.appendChild(t);
            dEl.append(bEl);
            dEl.append("body");
            bEl.addEventListener("onClick",()=>{j.deleteConnection(window.selectedConnection)},false);
            dEl.addEventListener("onClick",(e)=>{ console.log(e.target);j.remove(document.getElementById(e.target));})
            //document.getElementById(id).setAttribute("style", "border:2px solid red; background-color: rgb(255, 125, 115);");
           /* $("<div class='custom-menu'><button class='delete-connection'>Delete connection</button></div>")
                .appendTo("body")
                .css({ top: event.pageY + "px", left: event.pageX + "px" });*/
        }
      });//var j=this.instance;
      // body.addEventListener("click", ".delete-connection", function(event) {
      // //$("body").on("click", ".delete-connection", function (event) {
      //   j.deleteConnection(window.selectedConnection);
      // });
      
      /*$(document).bind("click", function (event) {
        $("div.custom-menu").remove();
      });*/
      
      // that.instance.on(document, "click", "div.custom-menu", function() {
      //        // var g = this.parentNode.getAttribute("group");
      //        j.remove(this);
      //         //j.removeGroup(g, this.getAttribute("delete-all") != null);
      //       });
      /*this.instance.on(body, "contextmenu", "#diagram .control", function(event) {
     // $("body").on("contextmenu", "#diagram .control", function (event) {
        event.preventDefault();
        window.selectedControl = document.getElementById("id");
        var dEl = document.createElement("div");
        dEl.classList.add("custom-menu");
        var bEl = document.createElement("button");
        bEl.classList.add("delete-connection");
        var t = document.createTextNode("Delete connection"); 
        dEl.style.top=event.pageY + "px";
        dEl.style.left=event.pageX + "px";
        bEl.appendChild(t);
        dEl.append(bEl);
        dEl.append("body");
      })*/
      //   $("<div class='custom-menu'><button class='delete-control'>Delete control</button></div>")
      //       .appendTo("body")
      //       .css({ top: event.pageY + "px", left: event.pageX + "px" });
      // });
    //uncomment this soon  
      // that.instance.on(body, "click", ".delete-control", function(event) {
      // //$("body").on("click", ".delete-control", function (event) {
      //   that.instance.remove(window.selectedControl);
      // });
      
      //       j.bind("connection", function(p) {
      //         p.connection.bind("click", function() {
      //           j.detach(this);
      //         });
      //       }); //uncomment this soon  
            jsPlumb.jsPlumb.fire("jsPlumbDemoLoaded", j);
          });
        }
      
        render() {
          return (
        <div className="container-fluid">
            <div className="row">
              <div className="col-md-3">
                <div id="toolbox" className="justify-content-center" >
                </div>
              </div>
              <div className="col-md-9">
                <div id="diagram" style={{height: "90vh", position: 'relative'}} onDragOver={(e)=>this.onDragOver(e)}
                onDrop={(event)=>this.onDrop(event)} >
                  <button className="btn" onClick={this.saveNodeJson}>Save Connections</button>
                </div>
              </div>
            </div>
          </div>
          );
        }
}
 
export default Main;