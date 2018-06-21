import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import WaitTime from '../waittime/WaitTime';
import Admin from '../admin/Admin';

const client = new ApolloClient({
    clientState: {
        resolvers: {
            Mutation: {
                selectTimePeriod: (_, { waitTimeDateID, timestamp}, { cache, getCacheKey }) => {
                    const id = getCacheKey({ __typename: 'WaitTimeDate', id: waitTimeDateID });
                    const data = {
                        __typename: 'WaitTimeDate',
                        selectedTimestamp: timestamp,
                    };
                    cache.writeData({ id, data });
                    return null;
                },
            },
            WaitTimeDate: {
                selectedTimestamp: (waitTimeDate) => waitTimeDate.timePeriods && waitTimeDate.timePeriods.length && waitTimeDate.timePeriods[0].timestamp,
            },
        },
    },
});

const theme = createMuiTheme({
    palette: {
        type: 'dark'
    }
});

const DefaultResort = () => <Redirect to='/resorts/steamboat' />;

const App = () => (
    <ApolloProvider client={client}>
        <CssBaseline>
            <MuiThemeProvider theme={theme}>
                <Switch>
                    <Route path='/admin' component={Admin} />
                    <Route exact path='/resorts/:resort?' component={WaitTime} />
                    <Route exact path='/' component={DefaultResort} />
                </Switch>
            </MuiThemeProvider>
        </CssBaseline>
    </ApolloProvider>
);

export default App;
