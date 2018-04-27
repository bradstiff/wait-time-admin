require('dotenv').config();

import fs from 'fs';
import path from 'path';
import express from 'express';
import config from './config';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import { ApolloEngine } from 'apollo-engine';
import cors from 'cors';
import sql from 'mssql';

import resolvers from './resolvers';
import { makeDataLoaders } from './connectors';
import { setTimeout } from 'timers';

//.env file required with environment-specific connection string, e.g, for MSSQL:
//CONNECTION_STRING=Server=<server>,<port>;Database=<db>;UID=<username>;PWD=<password>;encrypt=true
const db = new sql.ConnectionPool(process.env.CONNECTION_STRING);
db.on('error', err => console.log(err));

const schemaFile = path.join(__dirname, 'schema.graphql');
const typeDefs = fs.readFileSync(schemaFile, 'utf8');
const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express()
    .use(cors())
    .use(config.app.graphqlPath, bodyParser.json(), graphqlExpress(req => ({
        schema,
        context: { db, dataLoaders: makeDataLoaders(db) },
        tracing: true,
        cacheControl: true
    })
    ));

if (process.env.NODE_ENV === 'development') {
    app.use('graphiql', graphiqlExpress({ endpointURL: config.app.graphqlPath }));
} else if (process.env.NODE_ENV === 'production') {
    const staticPath = path.join(__dirname, '/client');
    app.use(express.static(staticPath));
    app.get('*', (req, res) => res.sendFile(`${staticPath}/index.html`));
}

//MSSQL ConnectionPool establishes a 'probe connection' to verify the config. This is asynchronous.
//If we make requests before the probe connection completes, it will cause errors.
//Bring the server online after the ConnectionPool is ready for requests.
db.connect()
    .catch(err => console.log(err))
    .finally(() => {
        const port = process.env.PORT || config.app.port;
        const engine = new ApolloEngine({
            apiKey: config.app.apolloEngineApiKey
        });

        engine.listen({
            port,
            expressApp: app
        });

        console.log(`Express server running in ${process.env.NODE_ENV} mode.`);
    });