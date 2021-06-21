// import React from 'react';
// import './configDiv.css';
// export default function ConfigDiv(props){
//     return(//<div>Hello new div!</div>
//         <div className="popup-popuptext" style={{borderStyle:"groove",backgroundColor:'#e6e6e6' ,width:'180px'}} > 
//         <div style={{backgroundColor:'#e6e6e6',position:'relative',right:'1px',color:'red',cursor:'pointer'}} className="fa fa-times fa-lg" onClick={(e)=>props.closeDiv(props.showDiv)}></div>
//          <div className="content" style={{backgroundColor:'#e6e6e6',color:'black',fontWeight:'500'}}>ID : {props.id} configs
         
//          </div>
//          </div>
//     )
// }

 import React, {Component} from 'react';
 import SlidingPanel from 'react-sliding-side-panel';
 
 class ConfigDiv extends Component {
      constructor(props) {
          super(props);
          this.state ={showPanel:props.showDiv,instanceName:"Enter",instanceVal:""};
          this.handleChange=this.handleChange.bind(this);
          //this.state = { showP:this.props.showPanel ,showD:this.props.showD }
      }
      handleChange(e){
        this.setState({[e.target.name]:e.target.value});
      }
  
      render() { 
        return(

          <div className="panel-container" > <div ><SlidingPanel
              type={'right'}
              isOpen={this.state.showPanel}
              size={100}
            className="panel-content"
            >
              <div>
                ID : {this.props.id}
                <div>Instance Name:</div>
                <input value={this.state.instanceName} name={this.state.instanceName}  onChange={(e)=>this.handleChange(e)}></input>
                <input type="text" value={this.state.instanceVal} name={this.state.instanceVal} onChange={(e)=>this.handleChange(e)}></input>
                {/* Instance Type: < form onSubmit={this.handleSubmit}>
                  <select value={this.state.instanceType} onChange={this.handleChangeType}>
                    <option>Select Instance Type</option>
                    <option>t2-large</option>
                    <option>t2-micro</option>
                  </select>
                  <button type="submit">Save</button>
                </form> */}
              
                <button onClick={() => this.setState({showPanel:false,showDiv:false ,instanceName:'',instanceVal:''})}>Close</button>
              </div>
            </SlidingPanel> </div> </div>
        )
      }
    }
    export default ConfigDiv;
// const ConfigDiv = () => {
//   const [openPanel, setOpenPanel] = useState(false);
//   return (
//     <div>
//       <div>
//         <button onClick={() => setOpenPanel(true)}>Open</button>
//       </div>
//       <SlidingPanel
//         type={'left'}
//         isOpen={openPanel}
//         size={30}
//       >
//         <div>
//           <div>My Panel Content</div>
//           <button onClick={() => setOpenPanel(false)}>close</button>
//         </div>
//       </SlidingPanel>
//     </div>
//   );
// };
 
// export default ConfigDiv;


// import React, { Component } from 'react';
// import SlidingPanel from 'react-sliding-side-panel';

// class ConfigDiv extends Component {
//     constructor(props) {
//         super(props);
//         this.state = { showP:this.props.showPanel ,showD:this.props.showD }
//     }

//     render() { 
//         return ( );
//     }
// }
 
// export default ConfigDiv;