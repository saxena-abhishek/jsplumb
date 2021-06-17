


const initialState = {
    nodeList:[{ id: 'locust ', name: 'Locust', configuration: {instanceType: ['t2-micro', 't2-large']} ,vc:0},
    { id: 'nginx ', name: 'nginx', configuration: {instanceType: ['t2-micro', 't2-large']} ,vc:0},
    { id: 'wordpress ', name: 'wordpress', configuration: {instanceType: ['t2-micro', 't2-large']},vc:0},
    { id: 'mysql ', name: 'mysql' , configuration: {instanceType: ['t2-micro', 't2-large']},vc:0} ]
    
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