


const initialState = {
    nodeList:[{ id: 'locust 0', name: 'Locust', configuration: {instanceType: ['t2-micro', 't2-large']} ,vc:0},
    { id: 'nginx 0', name: 'nginx', configuration: {instanceType: ['t2-micro', 't2-large']} ,vc:0},
    { id: 'wordpress 0', name: 'wordpress', configuration: {instanceType: ['t2-micro', 't2-large']},vc:0},
    { id: 'mysql 0', name: 'mysql' , configuration: {instanceType: ['t2-micro', 't2-large']},vc:0} ]
    
}
 
const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case "UPDATE_NODES": {
            return (Object.assign({}, state, { nodeList: action.payload }));
        }
        
        default:
            return state;
    }
}
 
export default Reducer;