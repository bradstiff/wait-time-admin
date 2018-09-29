require('dotenv').config();

import path from 'path';
import express from 'express';
import config from './config';
import bodyParser from 'body-parser';
import { graphiqlExpress } from 'apollo-server-express';
// import { ApolloEngine } from 'apollo-engine';
import cors from 'cors';
import compression from 'compression';

import configureRollbar from './rollbar';
import configureDB from './db';
import configureGraphQLExpress from './graphQL';

const isProduction = process.env.NODE_ENV === 'production';

const rollbar = configureRollbar();
const db = configureDB(rollbar);
const graphQLExpress = configureGraphQLExpress(db, isProduction);

const app = express()
    .use(rollbar.errorHandler())
    .use(compression())
    .use('/graphql', bodyParser.json(), graphQLExpress)
    .use(bodyParser.json())
    .post('/authenticate', (req, res) => {
        //just a placeholder to support the client workflow (which is also a placeholder)
        if (req.body.username === 'admin' && req.body.password === '@dm1n') {
            res.end('OK');
        } else {
            res.end('Invalid');
        }
    });

if (isProduction) {
    const staticPath = path.join(__dirname, 'public');
    app.use(express.static(staticPath));
    app.get('*', (req, res) => res.sendFile(`${staticPath}/index.html`));
}
else {
    app.use(cors());
    app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
} 

// MSSQL ConnectionPool asynchronously establishes a 'probe connection' to verify the config. 
// If we make requests before the probe connection completes, it will cause errors.
// Bring the server online after the ConnectionPool is ready for requests.
db.connect()
    .then(() => {
        const port = process.env.PORT || config.app.port;
        // const engine = new ApolloEngine({
        //    apiKey: config.app.apolloEngineApiKey
        // });

        // engine.listen({
        //    port,
        //    expressApp: app
        // });

        app.listen(port);
        console.log(`Express server running in ${process.env.NODE_ENV} mode.`);
    })
    .catch(error => {
        //container will auto-restart
        console.log(error);
        rollbar.error(error);
    });
