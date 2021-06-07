import React, { Component } from 'react';
import jsPlumb from "jsplumb/dist/js/jsplumb.min";
import "./jsplumbdemo.css";

class Main extends Component {
    constructor(props){
        super(props);
       this.initialShow = this.initialShow.bind(this);
       this.onDragStart = this.onDragStart.bind(this);
       this.nodenames = [];
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
          let canvas=document.getElementById("diagram");
          jsPlumb.jsPlumb.ready(function() {
            var j = (window.j = jsPlumb.jsPlumb.getInstance({
              Container: canvas,
              Connector: "StateMachine",
              Endpoint: ["Dot", { radius: 3 }],
              Anchor: "Center"
            }));
      //saloni
      jsPlumb.jsPlumb.registerConnectionTypes({
        "red-connection": {
            paintStyle: { stroke: "red", strokeWidth: 4 },
            hoverPaintStyle: { stroke: "red", strokeWidth: 8 },
            connector: "Flowchart"
        }
      });
      var body = document.getElementsByTagName("body")[0];
      j.bind("contextmenu", function (component, event) {
        if (component.hasClass("jtk-connector")) {
            event.preventDefault();
            window.selectedConnection = component;
           /* $("<div class='custom-menu'><button class='delete-connection'>Delete connection</button></div>")
                .appendTo("body")
                .css({ top: event.pageY + "px", left: event.pageX + "px" });*/
        }
      });
      j.on(body, "click", ".delete-connection", function(event) {
      //$("body").on("click", ".delete-connection", function (event) {
        j.deleteConnection(window.selectedConnection);
      });
      
      /*$(document).bind("click", function (event) {
        $("div.custom-menu").remove();
      });*/
      
      j.on(document, "click", "div.custom-menu", function() {
             // var g = this.parentNode.getAttribute("group");
             j.remove(this);
              //j.removeGroup(g, this.getAttribute("delete-all") != null);
            });
      
      /*$("body").on("contextmenu", "#diagram .control", function (event) {
        event.preventDefault();
        window.selectedControl = $(this).attr("id");
        $("<div class='custom-menu'><button class='delete-control'>Delete control</button></div>")
            .appendTo("body")
            .css({ top: event.pageY + "px", left: event.pageX + "px" });
      });*/
      
      j.on(body, "click", ".delete-control", function(event) {
      //$("body").on("click", ".delete-control", function (event) {
        j.remove(window.selectedControl);
      });
      
            /*j.bind("connection", function(p) {
              p.connection.bind("click", function() {
                j.detach(this);
              });
            });
      
            var evts = document.querySelector("#events");
            var _appendEvent = function(name, detail) {
              evts.innerHTML =
                "<br/><strong>" +
                name +
                "</strong><br/> " +
                detail +
                "<br/>" +
                evts.innerHTML;
            };
      */
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