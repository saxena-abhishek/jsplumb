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
      doubleClick(){
        console.log("clicked");
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
          positionX = event.pageX - position.x;
          positionY = event.pageY - position.y;
      
          cloneEl.setAttribute("style","top:" + positionY + "px; left:" + positionX + "px;");
          var icon2 = document.createElement("i");
          icon2.type="button";
          icon2.classList.add("fa","fa-times");

          var item = this.nodenames.findIndex(item => item.id === draggableElement.id);
          cloneEl.id=draggableElement.id+(++this.nodenames[item].vc);
          icon2.id=draggableElement.id+"_cross_"+this.nodenames[item].vc;
          dropzone.appendChild(cloneEl);
          let control=document.getElementById(cloneEl.id);
          //icon2.classList.add("cross-button")
          control.append(icon2);
          document.getElementById(icon2.id).setAttribute("style", "top:-14px;right:-30px;position:absolute");
          

          jsPlumb.jsPlumb.draggable(cloneEl.id, { containment: true });
          
          icon2.addEventListener("click",this.removeNode(control.id),false);
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
      
        initialShow(){          
          const box = document.getElementById("toolbox");
          this.nodenames = [
              { id: 'nginx', name: 'Nginx', icon: 'fa-file',vc:0 ,stat:true},
              { id: 'wordpress', name: 'Wordpress', icon: 'fa-wordpress',vc:0 ,stat:true },
              { id: 'mysql', name: 'MySQL', icon: 'fa-database',vc:0 ,stat:true },
              { id: 'locust', name: 'Locust', icon: 'fa',vc:0 ,stat:false}
          ]
      
          for (let i = 0; i < this.nodenames.length; i++) {
              var control = document.createElement("div");
              control.draggable=true;
              control.classList.add("cln");
              var icon = document.createElement("i");
              let iconclass = this.nodenames[i].icon;
              icon.classList.add("fa", iconclass);
              var img1 = document.createElement("img");
              img1.src = "https://img.icons8.com/metro/20/0071c5/grasshopper.png";
              if(this.nodenames[i].stat){
              control.append(icon);
              }          
              else{
              control.append(img1)
              }
              // control.append(button1)
              var text = document.createElement("span");
              text.innerHTML = this.nodenames[i].name;
              control.append("  ");
              control.append(text);
              control.classList.add('control');                   
              control.id = this.nodenames[i].id; 
              box.append(control);             
              control.addEventListener("dragstart",e=>this.onDragStart(e),false); 
               
          }
        }

        removeNode(e){
          console.log("remove node clicked"+e);
         // jsPlumb.jsPlumb.removeAllEndpoints(e);
          //jsPlumb.jsPlumb.detachAllConnections(e);//document.getElementById(e));
         // jsPlumb.jsPlumb.remove(e);
        }
      
        componentDidMount() {
          this.initialShow();
         // let that=this;
          let canvas=document.getElementById("diagram");
          jsPlumb.jsPlumb.ready(function() {
            jsPlumb.jsPlumb.setContainer(canvas);

            jsPlumb.jsPlumb.registerConnectionTypes({
              "black-connection": {
                paintStyle: { stroke: "#0071c5" },
                hoverPaintStyle: { stroke: "red"  },
               // connector: ["StateMachine", {curviness:0.7}],
                overlays:[ 
                  "Arrow", 
                    [ "Label", { location:0.25, id:"myLabel" ,color:'blue'} ]
                  ],
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
    //  that.instance=j;
   //   jsPlumb.jsPlumb.deleteConnectionsForElement()
      // jsPlumb.jsPlumb.registerConnectionTypes({
      //   "red-connection": {
      //       paintStyle: { stroke: "red", strokeWidth: 4 },
      //       hoverPaintStyle: { stroke: "red", strokeWidth: 8 },
      //       connector: "Flowchart"
      //   }
      // });
      /*var body = document.getElementsByTagName("body")[0];
      that.instance.bind("contextmenu", function (component, event) {
        if (component.hasClass("jtk-connector")) {
            event.preventDefault();
            window.selectedConnection = component;
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
               top: -14px;
    right: -30px;
            //document.getElementById(id).setAttribute("style", "top:-14px;right:-30px");
 
        }
      });//var j=this.instance;
      that.instance.on(body, "click", ".delete-connection", function(event) {
      //$("body").on("click", ".delete-connection", function (event) {
        j.deleteConnection(window.selectedConnection);
      });
      
      
      that.instance.on(document, "click", "div.custom-menu", function() {
             // var g = this.parentNode.getAttribute("group");
             j.remove(this);
              //j.removeGroup(g, this.getAttribute("delete-all") != null);
            });
      that.instance.on(body, "click", ".delete-control", function(event) {
      //$("body").on("click", ".delete-control", function (event) {
        that.instance.remove(window.selectedControl);
      });
      
            j.bind("connection", function(p) {
              p.connection.bind("click", function() {
                j.detach(this);
              });
            });*/
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
                onDrop={(event)=>this.onDrop(event)}  >
                  <button className="btn" onClick={this.saveNodeJson}>Save Connections</button>
                </div>
              </div>
            </div>
            <div style={{padding:'20px 20px'}}></div>
          </div>
          );
        }
}
 
export default Main;