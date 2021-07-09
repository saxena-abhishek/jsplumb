import { nodeConstants } from '../../actionables/actionTypes';

const initialState = {
    nodeList:[{ componentId: 1, id: 'locust', name: 'Locust', configuration: {instanceType: ['t2-micro', 't2-large']} ,vc:0},
    { componentId: 2, id: 'nginx', name: 'nginx', configuration: {instanceType: ['t2-micro', 't2-large']} ,vc:0},
    { componentId: 3, id: 'wordpress', name: 'wordpress', configuration: {instanceType: ['t2-micro', 't2-large']},vc:0},
    { componentId: 4, id: 'mysql', name: 'mysql' , configuration: {instanceType: ['t2-micro', 't2-large']},vc:0} ],
    nList:[],
    nodeConfig:{}
    
}

//nList:[{this.nList.push({ name: cloneEl.id, componentId: item.componentId, depth: [],configuration:{} });}]
 const reducer=(state = initialState, action) =>{
  switch (action.type) {
    case nodeConstants.TYPE_OF_NODES:
        return {
          nodeList: state.nodeList
        };
    case nodeConstants.ADD_NODE:
          return Object.assign({}, state, state.nList.push(action.node))
           // nList: [action.node, ...state.nList]//name: cloneEl.id, componentId: item.componentId, depth: [],configuration:{} });
    case nodeConstants.LIST_NODES:
      return {
        nList: state.nList
      };
    case nodeConstants.DELETE_NODE:
          return Object.assign({}, state, {
            nList: state.nList.filter((node) => {
              return node.uniqueId !== action.id
            })
          });
    case nodeConstants.FETCH_NODE_CONFIG://configuration:{ variables: {instanceName : InstName , instanceType: InstType}},
          let i= state.nList.findIndex(node=> node.uniqueId===action.id);
          //={"variables":action.config.configuration};
          return Object.assign({}, state,{nodeConfig:state.nList[i].configuration})
    case nodeConstants.UPDATE_NODES://configuration:{ variables: {instanceName : InstName , instanceType: InstType}},
          let indx= state.nList.findIndex(node=> node.uniqueId===action.config.id);
          state.nList[indx].configuration={"variables":action.config.configuration};
          return Object.assign({}, state, state.nList);
    case nodeConstants.UPDATE_NODES_CONN:
          let ind= state.nList.findIndex(node=> node.uniqueId===action.config.id);
          state.nList[ind].connectedTo=action.config.connectedTo;
          state.nList[ind].connectedFrom=action.config.connectedFrom;
          return Object.assign({}, state, state.nList);
    default:
      return state;
  }
}
 export default reducer;
