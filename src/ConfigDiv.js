import React from 'react';
export default function ConfigDiv(props){
    return(//<div>Hello new div!</div>
        <div className="cover"> 
         <div className="content">ID : {props.id} configs
         <span className="fa fa-times fa-lg" onClick={(e)=>props.closeDiv(props.showDiv)}></span>
         </div>
         </div>
    )
}