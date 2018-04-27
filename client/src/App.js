import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import WaitTime from './containers/WaitTime';

const client = new ApolloClient({
    uri: 'http://localhost:5000/graphql',
    clientState: {
        resolvers: {
            Mutation: {
                selectTimePeriod: (_, { waitTimeDateID, timestamp}, { cache, getCacheKey }) => {
                    const id = getCacheKey({ __typename: 'WaitTimeDate', id: waitTimeDateID })
                    const data = {
                        __typename: 'WaitTimeDate',
                        selectedTimestamp: timestamp
                    };
                    cache.writeData({ id, data });
                    return null;
                }
            },
            WaitTimeDate: {
                selectedTimestamp: (waitTimeDate) => waitTimeDate.timePeriods && waitTimeDate.timePeriods.length && waitTimeDate.timePeriods[0].timestamp
            }
        }
    }
});

const DefaultResort = () => <Redirect to='/resorts/steamboat' />;

const App = () => (
    <ApolloProvider client={client}>
        <Switch>
            <Route exact path='/' component={DefaultResort} />
            <Route exact path='/resorts/:resort?' component={WaitTime} />
        </Switch>
    </ApolloProvider>
);

export default App;
