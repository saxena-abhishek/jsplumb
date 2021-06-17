import React from 'react';
import './configDiv.css';
export default function ConfigDiv(props){
    return(//<div>Hello new div!</div>
        <div className="popup-popuptext" style={{borderStyle:"groove",backgroundColor:'#e6e6e6' ,width:'180px'}} > 
        <div style={{backgroundColor:'#e6e6e6',position:'relative',right:'1px',color:'red',cursor:'pointer'}} className="fa fa-times fa-lg" onClick={(e)=>props.closeDiv(props.showDiv)}></div>
         <div className="content" style={{backgroundColor:'#e6e6e6',color:'black',fontWeight:'500'}}>ID : {props.id} configs
         
         </div>
         </div>
    )
}