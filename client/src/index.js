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
import Error from './app/Error';

Rollbar.init({
    accessToken: "77405bf881c942f5a153ceb6b8be9081",
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
        environment: process.env.NODE_ENV
    }
});

//window.addEventListener('error', function (event) {
//    let { error } = event;
//    console.log(error.stack);
//    // Ignore errors that will be processed by componentDidCatch: https://github.com/facebook/react/issues/10474
//    if (error.stack && error.stack.indexOf('invokeGuardedCallbackDev') >= 0) {
//        return true;
//    }
//    Rollbar.error(error);
//    ReactDOM.render(<Error />, document.getElementById('root'));
//});

moment.locale(browserLocale());

ReactDOM.render((
    <BrowserRouter>
        <App />
    </BrowserRouter>
), document.getElementById('root'));

registerServiceWorker();
