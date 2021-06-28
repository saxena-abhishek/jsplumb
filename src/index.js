import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import MyJsPlumb from './App';
import reportWebVitals from './reportWebVitals';
import {Provider} from 'react-redux';
import { createStore } from "redux";
import Reducer from './reducers/reducer';
const store = createStore(Reducer);


ReactDOM.render(
  
  <Provider store={store}> <MyJsPlumb  /></Provider>
 ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
