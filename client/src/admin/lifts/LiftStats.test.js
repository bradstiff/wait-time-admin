import React from 'react';
import { render, cleanup, wait, fireEvent } from 'react-testing-library';
import gql from 'graphql-tag';
import { MockedProvider } from 'react-apollo/test-utils';
import { Route, Router, Switch } from 'react-router-dom';
import { createMemoryHistory } from 'history';

import Locations from '../../app/Locations';
import NotFound from '../../app/NotFound';
import LiftStats, { UPLIFT_STATS_BY_LIFT_QUERY } from './LiftStats';

const mocks = [
    {
        request: {
            query: UPLIFT_STATS_BY_LIFT_QUERY,
            variables: {
                id: 1,
                groupBy: 'Season',
            },
        },
        result: {
            data: {
                lift: {
                    id: '1',
                    name: 'Test Lift',
                    upliftGroupings: [
                        {
                            groupKey: 1,
                            groupDescription: '2016 - 2017',
                            upliftCount: 10,
                            waitTimeAverage: 20
                        },
                        {
                            groupKey: 2,
                            groupDescription: '2017 - 2018',
                            upliftCount: 11,
                            waitTimeAverage: 21
                        },
                    ]
                },
            },
        },
    },
    {
        request: {
            query: UPLIFT_STATS_BY_LIFT_QUERY,
            variables: {
                id: 1,
                groupBy: 'Month',
            },
        },
        result: {
            data: {
                lift: {
                    id: '1',
                    name: 'Test Lift',
                    upliftGroupings: [
                        {
                            groupKey: 1,
                            groupDescription: 'January',
                            upliftCount: 10,
                            waitTimeAverage: 20
                        },
                        {
                            groupKey: 2,
                            groupDescription: 'February',
                            upliftCount: 11,
                            waitTimeAverage: 21
                        },
                    ]
                },
            },
        },
    },
    {
        request: {
            query: UPLIFT_STATS_BY_LIFT_QUERY,
            variables: {
                id: 1,
                groupBy: 'Day',
            },
        },
        result: {
            data: {
                lift: {
                    id: '1',
                    name: 'Test Lift',
                    upliftGroupings: [
                        {
                            groupKey: 1,
                            groupDescription: 'Sunday',
                            upliftCount: 10,
                            waitTimeAverage: 20
                        },
                        {
                            groupKey: 2,
                            groupDescription: 'Monday',
                            upliftCount: 11,
                            waitTimeAverage: 21
                        },
                    ]
                },
            },
        },
    },
    {
        request: {
            query: UPLIFT_STATS_BY_LIFT_QUERY,
            variables: {
                id: 1,
                groupBy: 'Hour',
            },
        },
        result: {
            data: {
                lift: {
                    id: '1',
                    name: 'Test Lift',
                    upliftGroupings: [
                        {
                            groupKey: 8,
                            groupDescription: '8AM',
                            upliftCount: 10,
                            waitTimeAverage: 20
                        },
                        {
                            groupKey: 9,
                            groupDescription: '9AM',
                            upliftCount: 11,
                            waitTimeAverage: 21
                        },
                    ]
                },
            },
        },
    },
    {
        request: {
            query: UPLIFT_STATS_BY_LIFT_QUERY,
            variables: {
                id: 2,
                groupBy: 'Season',
            },
        },
        result: {
            data: {
                lift: null,
            },
        },
    },];

const history = createMemoryHistory({ initialEntries: [Locations.LiftStats.toUrl({ id: 1 })] });

const TestContainer = () => (
    <MockedProvider mocks={mocks} addTypename={false}>
        <Router history={history}>
            <Switch>
                {Locations.LiftStats.toRoute({ component: LiftStats, noMatch: NotFound }, true)}
                <Route component={NotFound} />
            </Switch>
        </Router>
    </MockedProvider>
);

afterEach(cleanup);

const firstColumn = container => [...container.querySelectorAll('tr > th:first-of-type')].map(th => th.innerHTML);

test('renders stats table by selected group', async () => {
    const { container, debug, getByText } = render(<TestContainer />);
    //defaults to By Season
    await wait(() => expect(firstColumn(container)).toEqual(['Season', '2016 - 2017', '2017 - 2018']));

    //change to By Month
    fireEvent.click(getByText('By season'));
    fireEvent.click(getByText('By month'));
    await wait(() => expect(firstColumn(container)).toEqual(['Month', 'January', 'February']));

    //change to By Day
    fireEvent.click(getByText('By month'));
    fireEvent.click(getByText('By day'));
    await wait(() => expect(firstColumn(container)).toEqual(['Day', 'Sunday', 'Monday']));

    //change to By Hour
    fireEvent.click(getByText('By day'));
    fireEvent.click(getByText('By hour'));
    await wait(() => expect(firstColumn(container)).toEqual(['Hour', '8AM', '9AM']));
});

test('renders LiftNotFound when mocked result is null for lift id', async () => {
    history.push(Locations.LiftStats.toUrl({id: 2}))
    const { container, debug, getByText } = render(<TestContainer />);
    await wait(() => expect(getByText('Page Not Found').toBeTruthy));
});