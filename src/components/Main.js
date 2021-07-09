import React, { Component } from "react";
import jsPlumb from "jsplumb/dist/js/jsplumb.min";
import "../styles/jsplumbdemo.css";
import { findPosition } from "../utils/domUtils";
import { connect } from "react-redux";
import SlidingPanel from "react-sliding-side-panel";
import { sendLaunchStatus, sendDownloadStatus } from "../Action";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextInput from "./TextInput";
import Dropdown from "./Dropdown";
import Checkbox from "./Checkbox";
class Main extends Component {
  constructor(props) {
    super(props);
    this.fieldList=this.props.rightPanelItems;
    this.onClose = this.onClose.bind(this);
    this.fetchOption = this.fetchOption.bind(this);
    this.initialShow = this.initialShow.bind(this);
    this.onDragStart = this.onDragStart.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.saveNodeJson = this.saveNodeJson.bind(this);
    this.traceConnections = this.traceConnections.bind(this);
    this.closeDiv = this.closeDiv.bind(this);
    this.nodenames = [];
    this.nList = [];
    this.iType = [];
    this.numberrs = [1, 2, 3, 4, 5, 6];
    this.iName = [];
    this.givenNodes =[];
    this.givenConnections =[];
    
    this.state = {
      loading: false,
      nodeList: [],
      nodeConnections: [],
      showDiv: false,
      id: "",
      showPanel: "",
      instanceType: "",
      instanceName: "",
      activeComponentId: "",
      activeNodeName: "",
      launchStatus: false,
      postApiSuccess: false,
      fieldList:this.props.rightPanelItems
    };
    //  this.connectionsList= new Map();
  }


handleChange(e,id) {
let field = this.fieldList.find((item) => item.key === id);
field.value=e.target.value;
this.setState({
  fieldList: this.fieldList,
});
  // console.log(this.fieldList)
  this.saveConfig(field.value,id)
}

  handleSubmit(event) {
    event.preventDefault();
    this.saveConfig();
    this.setState({
      showPanel: false,
      showDiv: false,
    });
  }

  saveConfig(value,id) {
    let indx = this.nList.findIndex((node) => node.name === this.state.id);
    if(id==='instanceName'){
    this.nList[indx].configuration.InstName = value;
    }
    if(id==='instanceType'){
    this.nList[indx].configuration.InstType = value;
    
  }
}

  traceConnections(download) {
    this.setState({ loading: true });
    var connections = jsPlumb.jsPlumb.getAllConnections();
    let that = this;
    let original = { workspace: "Anirban", project: "HCL_BO" };
    let targetIds = [];
    let sourceIds = [];
    let comp = [];
    if (this.nList) {
      for (let i = 0; i < this.nList.length; i++) {
        connections.forEach(function (connection, id) {
          if (connection.sourceId === that.nList[i].name) {
            targetIds.push(connection.targetId);
          }
          if (connection.targetId === that.nList[i].name) {
            sourceIds.push(connection.sourceId);
          }
        });
        comp.push({
          uniqueId: that.nList[i].name,
          componentId: that.nList[i].componentId,
          configuration: {
            variables: {
              instanceName: this.nList[i].configuration.InstName,
              instanceType: this.nList[i].configuration.InstType,
            },
          },
          connectedTo: targetIds,
          connectedFrom: sourceIds,
        });
        targetIds = [];
        sourceIds = [];
      }
      original.components = comp;
    }
    console.log("format:" + JSON.stringify(original));
    if (download) {
      this.download(original);
    } else {
      this.callApi(original);
      this.props.sendLaunchStatus({ launchStatus: false });
    }
    this.props.sendDownloadStatus({ download: false });
  }

  callApi(data) {
    fetch("http://65.1.81.30:5000/api/v1/terraform-manager/deploy", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {},
    })
      .then((response) => {
        this.setState({ loading: false });
        this.notify(true);
      })
      .catch((error) => {
        this.setState({ loading: false });
        this.notify(false);
      });
  }

  download(data) {
    fetch("http://65.1.81.30:5000/files", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {},
    })
      .then((response) => response.blob())
      .then((zipFile) => {
        this.setState({ loading: false });
        var blob = zipFile;
        var link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = "terraform-scripts";
        link.click();
        // this.notify(true)
      })
      .catch((error) => {
        console.log("Error: ", error);
      });
  }

  validate() {
    console.log("validated!");
  }
  onDragStart(event) {
    //console.log("drag start:"+event)
    event.dataTransfer.setData("text/plain", event.target.id);
  }
  onDragOver(event) {
    //console.log("drag over before:"+event)
    event.preventDefault();
    //console.log("drag over after:"+event)
  }
  onEdit(id, activeComponentId, activeNodeName, icon2, icon3) {
    this.setState({
      showDiv: true,
      showPanel: true,
      id: id,
      activeComponentId: activeComponentId,
      activeNodeName: activeNodeName,
    });
    let i;
    for (i = 0; i < this.nList.length; i++) {
      if (this.nList[i].name === id) {
        this.setState({
          instanceName: this.nList[i].configuration.InstName,
          instanceType: this.nList[i].configuration.InstType,
        });
        // icon2.classList.remove("fa", "fa-times", "fa-lg");
        // icon3.classList.remove("selected");
        this.removeSelected(icon2, icon3);
      }
    }
  }

  removeSelected(icon2, icon3) {
    icon2.classList.remove("fa", "fa-times", "fa-lg");
    icon3.classList.remove("selected");
    icon3.addEventListener("click", (e) => this.onSelect(icon2, icon3), false);
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
  onDrop(event) {
    const id = event.dataTransfer.getData("text");

    const draggableElement = document.getElementById(id);

    if (draggableElement && draggableElement.classList.contains("cln")) {
      let cloneEl = draggableElement.cloneNode(true);
      const dropzone = event.target;
      let positionX;
      let positionY;
      const position = findPosition(dropzone);
      positionX = event.pageX - position.x;
      positionY = event.pageY - position.y;
      cloneEl.setAttribute(
        "style",
        "top:" + positionY + "px; left:" + positionX + "px;"
      );
      var icon2 = document.createElement("i");
      icon2.type = "button";
      var icon3 = document.createElement("span");

      //icon3.type = "button";
      icon3.classList.add("node");
      var item = this.props.nodeList.find(
        (item) => item.id === draggableElement.id
      );
      cloneEl.id = draggableElement.id + ++item.vc;
      icon2.id = draggableElement.id + "_cross_" + item.vc;
      dropzone.appendChild(cloneEl);
      let control = document.getElementById(cloneEl.id);
      icon2.addEventListener(
        "click",
        (e) => this.removeNode(e, control.id),
        false
      );
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
      this.nList.push({
        name: cloneEl.id,
        componentId: item.componentId,
        configuration: {},
      });
      document
        .getElementById(icon2.id)
        .setAttribute(
          "style",
          "top:-10px;right:-8px;position:absolute;cursor:pointer;color:red; "
        );
      jsPlumb.jsPlumb.draggable(cloneEl.id, { containment: true });

      jsPlumb.jsPlumb.addEndpoint(cloneEl.id, {
        jtk: "Dot",
        paintStyle: {
          fill: "#0071c5",
          outlineStroke: "white",
          backgroundColor: "white",
          outlineWidth: 1,
        },
        anchor: ["RightMiddle"],
        isSource: true,
        connectionType: "black-connection",
        maxConnections: -1,
      });

      jsPlumb.jsPlumb.addEndpoint(cloneEl.id, {
        jtk: "Dot",
        paintStyle: {
          fill: "#0071c5",
          outlineStroke: "white",
          outlineWidth: 1,
        },
        anchor: ["LeftMiddle"],
        isTarget: true,
        connectionType: "black-connection",
        maxConnections: -1,
      });
      this.nodesListGenerate();
    }
    event.dataTransfer.clearData();
  }
  nodesListGenerate() {
    var testContainer = document.querySelector("#diagram");
    var controls = testContainer.querySelectorAll(".control");

    if (window.NodeList && !NodeList.prototype.map) {
      NodeList.prototype.map = Array.prototype.map;
    }
    var nodes = controls.map((item) => {
      return {
        id: item.id,
      };
    });
    this.setState({ nodeList: nodes });
  }

  initialShow() {
    const box = document.getElementById("toolbox");
    // this.nodenames = [
    //   { id: 'nginx', name: 'Nginx', icon: 'fa-file', vc: 0, stat: true },
    //   { id: 'wordpress', name: 'Wordpress', icon: 'fa-wordpress', vc: 0, stat: true },
    //   { id: 'mysql', name: 'MySQL', icon: 'fa-database', vc: 0, stat: true },
    //   { id: 'locust', name: 'Locust', icon: 'fa', vc: 0, stat: false }
    // ]

    for (let i = 0; i < this.props.nodeList.length; i++) {
      var control = document.createElement("div");
      control.draggable = true;
      control.classList.add("cln");
      let icon = document.createElement("i");
      switch (this.props.nodeList[i].componentId) {
        case 1:
          icon.classList.add("fa", "fa-times");
          var img1 = document.createElement("img");
          img1.src = "https://img.icons8.com/metro/20/0071c5/grasshopper.png";
          control.append(img1);
          break;
        case 2:
          icon.classList.add("fa", "fa-file");
          control.append(icon);
          break;
        case 3:
          icon.classList.add("fa", "fa-wordpress");
          control.append(icon);
          break;

        case 4:
          icon.classList.add("fa", "fa-database");
          control.append(icon);
          break;
        default:
      }

      var text = document.createElement("span");
      text.innerHTML = this.props.nodeList[i].name;
      control.append(" ");
      control.append(text);
      control.classList.add("control");
      control.id = this.props.nodeList[i].id;
      box.append(control);
      control.addEventListener("dragstart", (e) => this.onDragStart(e), false);
    }
  }
  onClose() {
    this.setState({
      showPanel: false,
      showDiv: false,
      instanceName: "",
      instanceType: "",
    });
  }
  removeNode(e, id) {
    let el = document.getElementById(id);
    jsPlumb.jsPlumb.removeAllEndpoints(el);
    jsPlumb.jsPlumb.remove(el);
    let i;
    console.log(this.nList, "ids");

    for (i = 0; i < this.nList.length; i++) {
      if (id === this.nList[i].name) {
        this.nList.splice(i, 1);
      }
    }
  }

  componentDidMount() {
    this.initialShow();
    // this.reDraw();
     let that = this;
    let canvas = document.getElementById("diagram");
    jsPlumb.jsPlumb.ready(function () {
      jsPlumb.jsPlumb.setContainer(canvas);

      jsPlumb.jsPlumb.registerConnectionTypes({
        "black-connection": {
          zIndex: -1,
          paintStyle: { stroke: "#0071c5" },
          hoverPaintStyle: { stroke: "red" },
          // connector: ["StateMachine", {curviness:0.7}],
          overlays: [
            "Arrow",
            [
              "Label",
              {
                label: "",
                location: 0.25,
                id: "myLabel",
                color: "blue",
                cursor: "pointer",
                cssClass: "connectClass",
                cssClassColor: "red",
              },
            ],
          ],
        },
      });

      jsPlumb.jsPlumb.bind("connection", (info) => {
       
      });

      this.givenNodes = ["mysql0", "nginx0", "locust0"];
      this.givenConnections = [
        { source: "mysql0", target: "nginx0" },
        { source: "nginx0", target: "locust0" },
      ];

      const box1 = document.getElementById("diagram");
      for (let i = 0; i < this.givenNodes.length; i++) {
        var redrawElement = document.createElement("div");

        redrawElement.classList.add("cln","control");
        redrawElement.id = this.givenNodes[i];

        var text1 = document.createElement("span");
        text1.innerHTML = this.givenNodes[i];
        redrawElement.append(text1);
        redrawElement.append(" ");

        box1.append(redrawElement);
        // redrawElement.draggable = true;
        //  redrawElement.draggable=true;
        jsPlumb.jsPlumb.draggable(redrawElement);
        jsPlumb.jsPlumb.addEndpoint(redrawElement, {
          jtk: "Dot",
          paintStyle: {
            fill: "black",
            outlineStroke: "white",
            backgroundColor: "white",
            outlineWidth: 1,
          },
          anchor: ["RightMiddle"],
          isSource: true,
          connectionType: "black-connection",
          maxConnections: -1,
        });

        jsPlumb.jsPlumb.addEndpoint(redrawElement, {
          jtk: "Dot",
          paintStyle: {
            fill: "black",
            outlineStroke: "white",
            outlineWidth: 1,
          },
          anchor: ["LeftMiddle"],
          isTarget: true,
          connectionType: "black-connection",
          maxConnections: -1,
        });
      }
      for (let i = 0; i < this.givenNodes.length; i++) {
        for (let j = 0; j < this.givenConnections.length; j++) {
          if (this.givenNodes[i] === this.givenConnections[j].source) {
            let s1 = document.getElementById(this.givenNodes[i]);
            let t1 = document.getElementById(this.givenConnections[j].target);
            console.log("source", s1, "target", t1);

            jsPlumb.jsPlumb.connect({
              anchors: ["Right", "Left"],
              source: s1,
              target: t1,

              overlays: [
                "Arrow",
                [
                  "Label",
                  {
                    label: "",
                    location: 0.25,
                    id: "myLabel",
                    color: "blue",
                    cursor: "pointer",
                    cssClass: "connectClass",
                    cssClassColor: "red",
                  },
                ],
              ],
            });
          }
        }
      }

      //     jsPlumb.jsPlumb.draggable(control1);
      //     jsPlumb.jsPlumb.draggable(control2);
      //   jsPlumb.jsPlumb.connect({
      //     anchors:["Right", "Left"],
      //       source:control2,
      //       paintStyle: { fill: "#0071c5", outlineStroke: "white", backgroundColor: "white", outlineWidth: 1 },
      //       target:control1,

      jsPlumb.jsPlumb.bind("click", (component, event) => {
        if (component.hasClass("jtk-connector")) {
          event.preventDefault();
          var conn = jsPlumb.jsPlumb.getConnections({
            source: component.sourceId,
            target: component.targetId,
          });
          if (conn[0]) {
            jsPlumb.jsPlumb.deleteConnection(conn[0]);
          }
        }
      });
    });
  }

  notify = (isApiSuccess) => {
    isApiSuccess
      ? toast(
          <div style={{ backgroundColor: "#d4edda", color: "green" }}>
            Deployment Initiated
          </div>,
          { position: toast.POSITION.TOP_CENTER }
        )
      : toast(
          <div style={{ backgroundColor: "#f8d7da", color: "red" }}>
            Deployment Failed
          </div>,
          { position: toast.POSITION.TOP_CENTER }
        );
  };

  closeDiv(showMe) {
    console.log("then:" + showMe + "now:" + !showMe);
    this.setState({ showDiv: !showMe });
  }

  fetchOption() {
    let i = this.state.activeComponentId;
    return (
      <>
        {this.props.nodeList[i - 1].configuration.instanceType.map(
          (number, i) => (
            <option>{number}</option>
          )
        )}
      </>
    );
  }

  render() {
    let status = this.props.launch ? this.traceConnections(false) : "";
    let status1 = this.props.download
      ? this.traceConnections(this.props.download)
      : "";
console.log("showDiv:"+this.state.showDiv)
    // jsPlumb.jsPlumb.select().setLabel(this.props.rps);
    let comp = this.state.showDiv ? (
      <div className="panel-container">
        <div>
          <SlidingPanel
            type={"right"}
            isOpen={this.state.showPanel}
            size={100}
            className="panel-content"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <div className="rightPanelHeader">
                {this.state.activeNodeName} Configuration
              </div>

              {this.props.rightPanelItems.map(items => {
                switch (items.key) {
                  case "collectLogs":
                    return <Checkbox 
                    checkboxLabel={items.label}
                    id={items.key} />;

                  case "instanceName":
                    return (
                      <TextInput
                        id={items.key}
                        instanceNameLabel={items.label}
                        instanceName={items.value}
                        handleChange={this.handleChange}
                      />
                    );

                  case "instanceType":
                    return (
                      <Dropdown
                        id={items.key}
                        instanceTypeLabel={items.label}
                        instanceType={items.value}
                        handleChange={this.handleChange}
                        fetchOption={this.fetchOption}
                        onClose={this.onClose}
                        handleSubmit={this.handleSubmit}
                      />
                    );
                }
              })}
            </div>
          </SlidingPanel>
        </div>
      </div>
    ) : (
      ""
    );

    return (
      <div className="container-fluid">
        {this.state.loading ? <div class="loading"> Loading </div> : null}

        <div style={{ display: "flex" }}>
          <div style={{ flex: 2 }}>
            <div id="toolbox" className="justify-content-center"></div>
          </div>
          <div style={{ flex: 7 }}>
            <div
              id="diagram"
              style={{ height: "90vh", position: "relative" }}
              onDragOver={(e) => this.onDragOver(e)}
              onDrop={(event) => this.onDrop(event)}
            >
              <div id="config-items">{comp}</div>
            </div>
          </div>
        </div>
        <div style={{ padding: "20px 20px" }}></div>
      </div>
    );
  }
}
const mapStateToProps = (state, ownProps) => ({
  // todo: state.todos[ownProps.id],
  nodeList: state.nodeList,
  launch: state.launch,
  download: state.download,
  rightPanelItems: state.rightPanelItems,
});

const mapDispatchToProps = (dispatch) => {
  return {
    sendLaunchStatus: (data) => dispatch(sendLaunchStatus(data)),
    sendDownloadStatus: (data) => dispatch(sendDownloadStatus(data)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Main);
