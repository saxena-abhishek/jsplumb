


const initialState = {
    nodeList:[{ componentId: 1, id: 'locust', name: 'Locust', configuration: {instanceType: ['t2-micro', 't2-large']} ,vc:0},
    { componentId: 2, id: 'nginx', name: 'nginx', configuration: {instanceType: ['t2-micro', 't2-large']} ,vc:0},
    { componentId: 3, id: 'wordpress', name: 'wordpress', configuration: {instanceType: ['t2-micro', 't2-large']},vc:0},
    { componentId: 4, id: 'mysql', name: 'mysql' , configuration: {instanceType: ['t2-micro', 't2-large']},vc:0} ],

    launch:false
}
 
const Reducer = (state = initialState, action) => {
    
    switch (action.type) {

        case "UPDATE_NODES": {
            return (Object.assign({}, state, { nodeList: action.payload }));
        }
      
            case "CALL_TRACE_FUNCTION": {
                // console.log(action.payload,"data in reducer")
                return {
                    launch:action.payload.launchh
                }
            }
        default:
            return state;
    }
  
}
 
export default Reducer;