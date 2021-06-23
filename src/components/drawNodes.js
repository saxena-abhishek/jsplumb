import React, { Component } from 'react';
//import jsPlumb from "jsplumb/dist/js/jsplumb.min";
import "../styles/jsplumbdemo.css";

class DrawNodes extends Component {
  constructor(props) {
    super(props);
  }
  onDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.id);

  }
  render() {
        const box = document.getElementById("toolbox");
        // this.nodenames = [
        //   { id: 'nginx', name: 'Nginx', icon: 'fa-file', vc: 0, stat: true },
        //   { id: 'wordpress', name: 'Wordpress', icon: 'fa-wordpress', vc: 0, stat: true },
        //   { id: 'mysql', name: 'MySQL', icon: 'fa-database', vc: 0, stat: true },
        //   { id: 'locust', name: 'Locust', icon: 'fa', vc: 0, stat: false }
        // ]
let comp="",cls="";


    for (let i = 0; i < this.props.nodeList.length; i++) {
    
    switch (this.props.nodeList[i].componentId){
    case 1:
            cls="fa fa-times";
           // var img1 = document.createElement("img");
            //img1.src = "https://img.icons8.com/metro/20/0071c5/grasshopper.png";
            //control.append(img1)
            break;
    case 2:
            cls="fa fa-file";
           // control.append(icon)
            break;
    case 3:
            cls="fa fa-wordpress";
           // control.append(icon)
            break;

    case 4:
            cls="fa fa-database";
           // control.append(icon)
            break;
    }
    return(
        <div className="cln control" draggable="true" id={this.props.nodeList[i].id} onDragStart={e=>this.onDragStart(e)}>
        <i className={cls}></i>
        <span>{this.props.nodeList[i].name}</span>
    </div>
    )

    }

  }
}
  export default DrawNodes;