import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import styled from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import lightBlue from '@material-ui/core/colors/lightBlue';
import orange from '@material-ui/core/colors/orange';

import WaitTime from '../waittime/WaitTime';
import Admin from '../admin/Admin';
import NotFound from './NotFound';
import Locations from './Locations';

import BackgroundImage from '../assets/resort-carousel-bg.jpg';

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
        type: 'dark',
        primary: lightBlue,
        secondary: orange,
        background: {
            paper: '#343434',
            default: '#282828',
        },
        divider: 'rgba(230, 230, 230, 0.12)',
    }
});

const Background = styled.div`
    background-image: url(${BackgroundImage});
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat; 
    background-attachment: fixed;
`;

const App = () => (
    <ApolloProvider client={client}>
        <CssBaseline>
            <MuiThemeProvider theme={theme}>
                <Background>
                    <Switch>
                        <Route path='/admin' component={Admin} />
                        {Locations.WaitTime.toRoute({ component: WaitTime, notFound: NotFound }, true)}
                        <Redirect from='/' to={Locations.WaitTime.toUrl({ slug: 'serre-chevalier-vallee' })} exact />
                        <Route component={NotFound} />
                    </Switch>
                </Background>
            </MuiThemeProvider>
        </CssBaseline>
    </ApolloProvider>
);

export default App;
