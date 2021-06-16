


const initialState = {
    nodeList:[{ id: 1, name: 'Locust', configuration: {instanceType: ['t2-micro', 't2-large']} },
    { id: 2, name: 'nginx', configuration: {instanceType: ['t2-micro', 't2-large']} },
    { id: 3, name: 'wordpress', configuration: {instanceType: ['t2-micro', 't2-large']}},
    { id: 4, name: 'mysql' , configuration: {instanceType: ['t2-micro', 't2-large']}} ]
    
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