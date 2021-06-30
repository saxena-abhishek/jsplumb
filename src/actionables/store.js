import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
//import { createLogger } from 'redux-logger';
import reducer from '../redux/reducers/reducer';

//const loggerMiddleware = createLogger();
//const st= createStore()
 export const store = createStore(reducer,composeWithDevTools(
    applyMiddleware(thunkMiddleware)));
   // reducer//,
   /* applyMiddleware(
        thunkMiddleware,
       // loggerMiddleware
    )*/
//);