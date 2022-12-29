import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import dataReducer from './reducers/data';
import tableHeadReducer from './reducers/tableHead';
import dataSortReducer from './reducers/dataSort';
import App from './App';

const store = configureStore({
  reducer:{
    data:dataReducer,
    tableHead:tableHeadReducer,
    dataSort:dataSortReducer,
  },
});
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

