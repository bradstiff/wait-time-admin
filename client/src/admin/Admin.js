import React, { Component } from 'react';
import { matchPath } from 'react-router';
import { Switch, Route } from 'react-router-dom';
import styled from 'styled-components';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Resorts from './resorts/Resorts';
import ResortCreate from './resorts//ResortCreate';
import Resort from './resorts/Resort';
import ResortEdit from './resorts/ResortEdit';
import ResortLifts from './resorts/ResortLifts';
import ResortStats from './resorts/ResortStats';

import Lifts from './lifts/Lifts';
import Lift from './lifts/Lift';
import LiftEdit from './lifts/LiftEdit';
import LiftUplifts from './lifts/LiftUplifts';
import LiftStats from './lifts/LiftStats';

import Locations from '../app/Locations';
import NotFound from '../app/NotFound';

const styles = theme => ({
    container: {
        minHeight: '100vh',
        maxWidth: '1250px',
        margin: 'auto',
    },
    content: {
        marginTop: theme.spacing.unit * 2,
    }
});

class Admin extends Component {
    render() {
        const { classes, location } = this.props;
        let activeTab = null;
        if (matchPath(location.pathname, '/admin/resorts')) {
            activeTab = 0;
        } else if (matchPath(location.pathname, '/admin/lifts')) {
            activeTab = 1;
        }

        return (
            <div className={classes.container}>
                <AppBar position="static" color='default'>
                    <Toolbar>
                        <Typography variant="title">
                            Wait Time Admin
                        </Typography>
                        <Tabs value={activeTab}>
                            <Tab label="Resorts" component={Locations.Resorts.toLink()} />
                            <Tab label="Lifts" component={Locations.Lifts.toLink()} />
                        </Tabs>
                    </Toolbar>
                </AppBar>
                <div className={classes.content}>
                    <Switch>
                        {Locations.Resorts.toRoute({ component: Resorts, notFound: NotFound }, true)}
                        {Locations.Resort.toRoute({ component: Resort, notFound: NotFound }, true)}
                        {Locations.ResortEdit.toRoute({ component: ResortEdit, notFound: NotFound }, true)}
                        {Locations.ResortLifts.toRoute({ component: ResortLifts, notFound: NotFound }, true)}
                        {Locations.ResortStats.toRoute({ component: ResortStats, notFound: NotFound }, true)}
                        {Locations.Lifts.toRoute({ component: Lifts, notFound: NotFound }, true)}
                        {Locations.Lift.toRoute({ component: Lift, notFound: NotFound }, true)}
                        {Locations.LiftEdit.toRoute({ component: LiftEdit, notFound: NotFound }, true)}
                        {Locations.LiftUplifts.toRoute({ component: LiftUplifts, notFound: NotFound }, true)}
                        {Locations.LiftStats.toRoute({ component: LiftStats, notFound: NotFound }, true)}
                        <Route component={NotFound} />
                    </Switch>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Admin);