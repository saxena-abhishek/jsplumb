import { nodeConstants } from './actionTypes';
//import { userService } from '../_services';
//import { history } from '../_helpers';


export const actions = {
    addNode: function(node) {
      return {
        type: nodeConstants.ADD_NODE,
        node: node,
      }
    },
    updateNodeConnection: function(config){
      return {
        type:nodeConstants.UPDATE_NODES_CONN,
        config:config
      }
    },
    listNodes: function() {
      return {
        type: nodeConstants.LIST_NODES
      }
    },
    deleteNode: function(id) {
      return {
        type: nodeConstants.DELETE_NODE,
        id: id
       }
    },
    updateNodeConfig : function(config){
      return {
        type:nodeConstants.UPDATE_NODES,
        config:config
      }
    },
    nodeTypes: function(){
      return{
        type:nodeConstants.TYPE_OF_NODES
      }
    }
  }