import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import App from './app/App';
import registerServiceWorker from './registerServiceWorker';

if (process.env.NODE_ENV !== 'production') {
    localStorage.setItem('debug', 'wait-time:*');
}

ReactDOM.render(<App />, document.getElementById('root'));

registerServiceWorker();
