 import React, {Component} from 'react';
 import SlidingPanel from 'react-sliding-side-panel';
 import { connect } from 'react-redux';
import {mapStateToProps,mapDispatchToProps} from './container';
 
 class ConfigDiv extends Component {
      constructor(props) {
          super(props);
          this.iType=[];
          this.numberrs=[1,2,3,4,5,6]
          this.iName=[]; 
          this.state ={showPanel:props.showDiv,instanceName:"Enter",instanceVal:"",activeNodeName:props.activeNodeName,activeComponentId:props.activeComponentId,id:props.id};
          this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
          //this.state = { showP:this.props.showPanel ,showD:this.props.showD }
      }
      handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
      }
    
      handleSubmit(event) {
        event.preventDefault();
        this.saveConfig();
        this.setState({showPanel:false ,instanceName:'',instanceType:''})
      }
    
      fetchOption(){
        let i=this.state.activeComponentId;
        return( <>{this.props.nodeList[i-1].configuration.instanceType.map((number,indx) =><option key={indx}>{number}</option>           
       )}
       </>
       )
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
        
  
      render() { 
        return(

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
  </SlidingPanel> </div> </div>
        )
      }
    }
    export default connect(mapStateToProps, mapDispatchToProps)(ConfigDiv);