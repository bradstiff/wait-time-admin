import React from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import Rollbar from 'rollbar';
import moment from 'moment';
import 'moment/min/locales';
import browserLocale from 'browser-locale';

import styled from 'styled-components';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import lightBlue from '@material-ui/core/colors/lightBlue';
import orange from '@material-ui/core/colors/orange';

import { QueryProgressProvider } from './QueryProgressContext';
import { UserProvider } from './UserContext';
import WaitTime from '../waittime/WaitTime';
import Admin from '../admin/Admin';
import NotFound from './NotFound';
import Locations from './Locations';
import ErrorPage from './Error';
import ErrorBoundary from '../common/ErrorBoundary';

import BackgroundImage from '../assets/resort-carousel-bg.jpg';

let client;
try {
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

    client = new ApolloClient({
        clientState: {
            resolvers: {
                Mutation: {
                    selectTimePeriod: (_, { waitTimeDateID, timestamp }, { cache, getCacheKey }) => {
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
                    selectedTimestamp: waitTimeDate => {
                        if (!waitTimeDate.timePeriods || !waitTimeDate.timePeriods.length) {
                            return null;
                        }
                        //default to middle time period
                        const middleIndex = Math.round(waitTimeDate.timePeriods.length / 2);
                        return waitTimeDate.timePeriods[middleIndex].timestamp;
                    },
                },
            },
        },
        onError: ({ graphQLErrors, networkError, operation, response, forward }) => {
            const logError = (error, type) => {
                Rollbar.error(error, {
                    type,
                    operation,
                });
            };
            if (graphQLErrors) {
                graphQLErrors.forEach(error => logError(error, 'GraphQL Error'));
            }
            if (networkError) {
                logError(networkError, 'Network Error');
            }
            throw new Error('ApolloClient.onError');
        },
    });
}
catch (error) {
    Rollbar.error(error)
}

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

class App extends React.Component {
    render() {
        return (
            <ApolloProvider client={client} >
                <CssBaseline>
                    <MuiThemeProvider theme={theme}>
                        <Background>
                            <ErrorBoundary component={ErrorPage}>
                                <BrowserRouter>
                                    <UserProvider>
                                        <QueryProgressProvider>
                                            <Switch>
                                                <Route path='/admin' component={Admin} />
                                                {Locations.WaitTime.toRoute({ component: WaitTime, notFound: NotFound }, true)}
                                                <Redirect from='/' to={Locations.WaitTime.toUrl({ slug: 'serre-chevalier-vallee' })} exact />
                                                <Route component={NotFound} />
                                            </Switch>
                                        </QueryProgressProvider>
                                    </UserProvider>
                                </BrowserRouter>
                            </ErrorBoundary>
                        </Background>
                    </MuiThemeProvider>
                </CssBaseline>
            </ApolloProvider>
        );
    }
}

export default App;
