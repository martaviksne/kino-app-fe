import 'array.prototype.fill';
/* polyfills.js */

import 'core-js/fn/array/find';
import 'core-js/fn/array/includes';
import 'core-js/fn/number/is-nan';

import Set from 'es6-set';

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router } from 'react-router-dom';

ReactDOM.render(<Router><App /></Router>, document.getElementById('root'));
registerServiceWorker();
