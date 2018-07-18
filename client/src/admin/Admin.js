import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
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
import LiftNotFound from '../app/LiftNotFound';

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
        const { classes } = this.props;
        let activeTab = null;
        const pathname = this.props.location.pathname;
        if (pathname.toLowerCase().indexOf('/admin/resorts') > -1) {
            activeTab = 0;
        } else if (pathname.toLowerCase().indexOf('/admin/lifts') > -1) {
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
                            <Tab label="Resorts" component={Link} to='/admin/resorts' />
                            <Tab label="Lifts" component={Link} to='/admin/lifts' />
                        </Tabs>
                    </Toolbar>
                </AppBar>
                <div className={classes.content}>
                    <Switch>
                        {Locations.Resorts.toRoute({ component: Resorts }, true)}
                        {Locations.Resort.toRoute({ component: Resort }, true)}
                        {Locations.ResortEdit.toRoute({ component: ResortEdit }, true)}
                        {Locations.ResortLifts.toRoute({ component: ResortLifts }, true)}
                        {Locations.ResortStats.toRoute({ component: ResortStats }, true)}
                        {Locations.Lifts.toRoute({ component: Lifts }, true)}
                        {Locations.Lift.toRoute({ component: Lift }, true)}
                        {Locations.LiftEdit.toRoute({ component: LiftEdit }, true)}
                        {Locations.LiftUplifts.toRoute({ component: LiftUplifts }, true)}
                        {Locations.LiftStats.toRoute({ component: LiftStats }, true)}
                        <Route component={NotFound} />
                    </Switch>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Admin);