import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import moment from 'moment';
import 'moment/min/locales';
import browserLocale from 'browser-locale';
import Rollbar from 'rollbar';

import './index.css';
import App from './app/App';
import registerServiceWorker from './registerServiceWorker';

Rollbar.init({
    accessToken: "77405bf881c942f5a153ceb6b8be9081",
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
        environment: "production"
    }
});

moment.locale(browserLocale());

ReactDOM.render((
    <BrowserRouter>
        <App />
    </BrowserRouter>
), document.getElementById('root'));

registerServiceWorker();
