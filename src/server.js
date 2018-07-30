require('dotenv').config();

import fs from 'fs';
import path from 'path';
import express from 'express';
import config from './config';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
// import { ApolloEngine } from 'apollo-engine';
import cors from 'cors';
import compression from 'compression';
import sql from 'mssql';
import Rollbar from 'rollbar';

import resolvers from './resolvers';
import { makeDataLoaders } from './connectors';

const isProduction = process.env.NODE_ENV === 'production';

const rollbar = new Rollbar({
    accessToken: '3f2da1bcb6b94fd6b710c351efcd137d',
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
        environment: process.env.NODE_ENV
    }
});

// .env file required with environment-specific connection string, e.g, for MSSQL:
// CONNECTION_STRING=Server=<server>,<port>;Database=<db>;UID=<username>;PWD=<password>;encrypt=true
const db = new sql.ConnectionPool({
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    user: process.env.DB_UID,
    password: process.env.DB_PWD,
    port: process.env.DB_PORT,
});
db.on('error', error => rollbar.error(error));

const schemaFile = path.join(__dirname, 'schema.graphQL');
const typeDefs = fs.readFileSync(schemaFile, 'utf8');
const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express()
    .use(rollbar.errorHandler())
    .use(compression())
    .use(config.app.graphqlPath, bodyParser.json(), graphqlExpress(req => ({
        schema,
        context: { db, dataLoaders: makeDataLoaders(db) },
        tracing: !isProduction,
        cacheControl: !isProduction,
    })));

if (isProduction) {
    const staticPath = path.join(__dirname, 'client');
    app.use(express.static(staticPath));
    app.get('*', (req, res) => res.sendFile(`${staticPath}/index.html`));
}
else {
    app.use(cors());
    app.use('graphiql', graphiqlExpress({ endpointURL: config.app.graphqlPath }));
} 

// MSSQL ConnectionPool establishes a 'probe connection' to verify the config. This is asynchronous.
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
    .catch(error => rollbar.error(error));
