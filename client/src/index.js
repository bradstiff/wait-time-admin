import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import moment from 'moment';
import 'moment/min/locales';
import browserLocale from 'browser-locale';

import './index.css';
import App from './app/App';
import registerServiceWorker from './registerServiceWorker';

moment.locale(browserLocale());

ReactDOM.render((
    <BrowserRouter>
        <App />
    </BrowserRouter>
), document.getElementById('root'));

registerServiceWorker();
