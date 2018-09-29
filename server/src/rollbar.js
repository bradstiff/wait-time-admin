import Rollbar from 'rollbar';

export default () => new Rollbar({
    accessToken: '3f2da1bcb6b94fd6b710c351efcd137d',
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
        environment: process.env.NODE_ENV
    }
});
