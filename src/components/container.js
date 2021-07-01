import {actions} from '../actionables/actionCreator';

export const mapStateToProps = (state, ownProps) => ({
    nodeList: state.nodeList,
    nList: state.nList
  })
export const mapDispatchToProps = (dispatch) => {
    return {
      addNode: node=>dispatch(actions.addNode(node)),
      updateNodeConfig: config=>dispatch(actions.updateNodeConfig(config)),
      deleteNode: id=>dispatch(actions.deleteNode(id)),
      updateNodeConnection: config=>dispatch(actions.updateNodeConnection(config)),
    //  deleteNode: id=>dispatch(actions.deleteNode(id)),
    }
}

