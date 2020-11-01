import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import configureStore from './configureStore';
import './index.css';
import "./assets/css/nucleo-icons.css";
import "./assets/scss/black-dashboard-pro-react.scss?v=1.1.0";
import "./assets/demo/demo.css";

ReactDOM.render(
  <Provider store={configureStore()}>
    <App />
  </Provider>,
  document.getElementById('root')
);


