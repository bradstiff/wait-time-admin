import { graphqlExpress } from 'apollo-server-express';
import makeExecutableSchema from './executableSchema';
import makeDataLoaders from '../db/dataLoaders';

export default (db, isProduction) => {
    const schema = makeExecutableSchema();
    const dataLoaders = makeDataLoaders(db);
    return graphqlExpress(() => ({
        schema,
        context: { db, dataLoaders },
        tracing: !isProduction,
        cacheControl: !isProduction,
    }))
};