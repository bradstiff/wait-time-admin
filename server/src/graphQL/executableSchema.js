import fs from 'fs';
import path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';

export default () => {
    const schemaFile = path.join(__dirname, 'schema.graphQL');
    const typeDefs = fs.readFileSync(schemaFile, 'utf8');
    return makeExecutableSchema({ typeDefs, resolvers });
};
