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

// import React, { useState } from 'react';
// import SlidingPanel from 'react-sliding-side-panel';
 
// const App = () => {
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
 
// export default App;


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