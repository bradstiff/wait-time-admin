import React from 'react';
import ReactDOM from 'react-dom';

import { Route, Router, Switch } from 'react-router-dom';

import App from './App';
import Locations from './Locations';
import NotFound from './NotFound';
import LiftUplifts from '../admin/lifts/LiftUplifts';
import LiftStats from '../admin/lifts/LiftStats';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

//Page-level integration tests can import this container and wrap it with MockedProvider
export const IntegrationTestContainer = ({ history }) => {
    return (
        <Router history={history}>
            <Switch>
                {Locations.LiftUplifts.toRoute({ component: LiftUplifts, invalid: NotFound }, true)}
                {Locations.LiftStats.toRoute({ component: LiftStats, invalid: NotFound }, true)}
                <Route component={NotFound} />
            </Switch>
        </Router>
    );
};

