import React from "react";
import jsPlumb from "jsplumb/dist/js/jsplumb.min";
import "./jsplumbdemo.css";
import Header from "./Header";
import Main from "./Main";

export default class MyJsPlumb extends React.Component {
  constructor(props) {
    super(props);
    this.initialShow = this.initialShow.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
  }
  onDragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);

    console.log(event.currentTarget.id);
  }
  initialShow() {
    //let index = 0;
    const box = document.getElementById("toolbox");
    let nodenames = [
      { id: "nginx", name: "Nginx", icon: "fa-file" },
      { id: "wordpress", name: "Wordpress", icon: "fa-wordpress" },
      { id: "static", name: "StaticServer", icon: "fa-server" },
      { id: "mysql", name: "MySQL", icon: "fa-database" },
    ];

    for (let i = 0; i < nodenames.length; i++) {
      var control = document.createElement("div");
      control.draggable = true;
      var icon = document.createElement("i");
      let iconclass = nodenames[i].icon;
      icon.classList.add("fa", iconclass);
      control.append(icon);
      var text = document.createElement("span");
      text.innerHTML = nodenames[i].name;
      control.append(text);
      control.classList.add("control");
      control.id = nodenames[i].id;
      box.append(control);
      control.addEventListener("dragstart", (e) => this.onDragStart(e), false);
    }
  }

  componentDidMount() {
    this.initialShow();
    let canvas = document.getElementById("diagram");
    jsPlumb.jsPlumb.ready(function () {
      var j = (window.j = jsPlumb.jsPlumb.getInstance({
        Container: canvas,
        Connector: "StateMachine",
        Endpoint: ["Dot", { radius: 3 }],
        Anchor: "Center",
      }));
      //saloni
      j.registerConnectionTypes({
        "red-connection": {
          paintStyle: { stroke: "red", strokeWidth: 4 },
          hoverPaintStyle: { stroke: "red", strokeWidth: 8 },
          connector: "Flowchart",
        },
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
      j.on(body, "click", ".delete-connection", function (event) {
        //$("body").on("click", ".delete-connection", function (event) {
        j.deleteConnection(window.selectedConnection);
      });

      /*$(document).bind("click", function (event) {
  $("div.custom-menu").remove();
});*/

      j.on(document, "click", "div.custom-menu", function () {
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

      j.on(body, "click", ".delete-control", function (event) {
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
      j.bind("group:addMember", function(p) {
        _appendEvent("group:addMember", p.group.id + " - " + p.el.id);
      });
      j.bind("group:removeMember", function(p) {
        _appendEvent("group:removeMember", p.group.id + " - " + p.el.id);
      });
      j.bind("group:expand", function(p) {
        _appendEvent("group:expand", p.group.id);
      });
      j.bind("group:collapse", function(p) {
        _appendEvent("group:collapse", p.group.id);
      });
      j.bind("group:add", function(p) {
        _appendEvent("group:add", p.group.id);
      });
      j.bind("group:remove", function(p) {
        _appendEvent("group:remove", p.group.id);
      });
//saloni
let c1_1= document.getElementById("c1_1");
let c1_2= document.getElementById("c1_2");
let c2_1= document.getElementById("c2_1");
let c2_2= document.getElementById("c2_2");
let c3_1= document.getElementById("c3_1");
let c3_2= document.getElementById("c3_2");
let c4_1= document.getElementById("c4_1");
let c4_2= document.getElementById("c4_2");

let container1= document.getElementById("container1");
let container2= document.getElementById("container2");
let container3= document.getElementById("container3");
let container4= document.getElementById("container4");
//saloni
      // connect some before configuring group
      j.connect({ source: c1_1, target: c2_1 });
      j.connect({ source: c2_1, target: c3_1 });
     // j.connect({ source: c2_2, target: c6_2 });
      j.connect({ source: c3_1, target: c4_1 });
      //j.connect({ source: c4_1, target: c5_1 });
      j.connect({ source: c1_1, target: c1_2 });
      j.connect({ source: c2_1, target: c2_2 });

      // NOTE ordering here. we make one draggable before adding it to the group, and we add the other to the group
      //before making it draggable. they should both be constrained to the group extents.
      j.draggable(c1_1);
      j.addGroup({
        el: container1,
        id: "one",
        constrain: true,
        anchor: "Continuous",
        endpoint: "Blank",
        droppable: false
      });
      j.addToGroup("one", c1_1);
      j.addToGroup("one", c1_2);
      j.draggable(c1_2);

      j.draggable(c2_1);
      j.addGroup({
        el: container2,
        id: "two",
        dropOverride: true,
        endpoint: ["Dot", { radius: 3 }]
      }); //(the default is to revert)
      j.addToGroup("two", c2_1);
      j.addToGroup("two", c2_2);
      j.draggable(c2_2);

      j.draggable(c3_1);
      j.addGroup({
        el: container3,
        id: "three",
        revert: false,
        endpoint: ["Dot", { radius: 3 }]
      });
      j.addToGroup("three", c3_1);
      j.addToGroup("three", c3_2);
      j.draggable(c3_2);

      j.draggable(c4_1);
      j.addGroup({
        el: container4,
        id: "four",
        prune: true,
        endpoint: ["Dot", { radius: 3 }]
      });
      j.addToGroup("four", c4_1);
      j.addToGroup("four", c4_2);
      j.draggable(c4_2);

      // the independent element that demonstrates the fact that it can be dropped onto a group
      j.draggable("standalone");

      //... and connect others afterwards.
      j.connect({ source: c3_1, target: c3_2 });
      j.connect({ source: c4_1, target: c4_2 });
      // delete group button
      j.on(canvas, "click", ".del", function() {
        var g = this.parentNode.getAttribute("group");
        j.removeGroup(g, this.getAttribute("delete-all") != null);
      });
saloni*/
      // collapse/expand group button
      // j.on(canvas, "click", ".node-collapse", function() {
      //   var g = this.parentNode.getAttribute("group"),
      //     collapsed = j.hasClass(this.parentNode, "collapsed");

      //   j[collapsed ? "removeClass" : "addClass"](this.parentNode, "collapsed");
      //   j[collapsed ? "expandGroup" : "collapseGroup"](g);
      // });

      jsPlumb.jsPlumb.fire("jsPlumbDemoLoaded", j);
    });
  }

  componentWillUnmount() {}

  render() {
    return (
      <div className="jtk-demo-main">
        <div
          id="canvas"
          ref={(el) => (this.el = el)}
          className="jtk-demo-canvas canvas-wide flowchart-demo jtk-surface jtk-surface-nopan"
          style={{ height: "600px" }}
        >
          <div className="group-container" id="container1" group="one">
            <div id="c1_1" className="w" style={{ left: "30px", top: "35px" }}>
              1.1
            </div>
            <div
              id="c1_2"
              className="w"
              style={{ left: "160px", top: "140px" }}
            >
              1.2
            </div>
          </div>

          <div className="group-container" id="container2" group="two">
            <div id="c2_1" className="w" style={{ left: "30px", top: "40px" }}>
              2.1
            </div>
            <div
              id="c2_2"
              className="w"
              style={{ left: "150px", top: "160px" }}
            >
              2.2
            </div>
          </div>

          <div className="group-container" id="container3" group="three">
            <div id="c3_1" className="w" style={{ left: "30px", top: "35px" }}>
              3.1
            </div>
            <div id="c3_2" className="w" style={{ left: "80px", top: "162px" }}>
              3.2
            </div>
          </div>

          <div className="group-container" id="container4" group="four">
            <div id="c4_1" className="w" style={{ left: "30px", top: "35px" }}>
              4.1
            </div>
            <div
              id="c4_2"
              className="w"
              style={{ left: "110px", top: "150px" }}
            >
              4.2
            </div>
          </div>
          <div
            className="w"
            id="standalone"
            style={{ left: "455px", top: "280px" }}
            title="drag me into a group. if you want to."
          >
            ?
          </div>
          <div className="events">
            <h3>Events</h3>
            <div id="events" />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Header style={{ flex: 2 }} />
          <Main style={{ flex: 2 }} />
        </div>
      </div>
    );
  }
}
