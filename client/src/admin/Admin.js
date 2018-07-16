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
import { ResortController, ResortEditController, ResortLiftsController, ResortStatsController } from './resorts';

import Lifts from './Lifts';
import Lift from './Lift';
import LiftEdit from './LiftEdit';
import LiftUplifts from './LiftUplifts';
import LiftStats from './LiftStats';

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
                        <Route exact path='/admin/resorts' component={Resorts} />
                        <Route exact path='/admin/resorts/create' component={ResortCreate} />
                        <Route exact path='/admin/resorts/:id' component={ResortController} />
                        <Route exact path='/admin/resorts/:id/lifts' component={ResortLiftsController} />
                        <Route exact path='/admin/resorts/:id/edit' component={ResortEditController} />
                        <Route exact path='/admin/resorts/:id/stats' component={ResortStatsController} />

                        <Route path='/admin/lifts/:id' children={({ match }) => {
                            const id = parseInt(match.params.id);
                            if (isNaN(id)) {
                                return <LiftNotFound />
                            }
                            return <Switch>
                                <Route exact path='/admin/lifts/:id/stats' component={() => <LiftStats id={id} />} />
                                <Route exact path='/admin/lifts/:id/uplifts' component={() => <LiftUplifts id={id} />} />
                                <Route exact path='/admin/lifts/:id/edit' component={() => <LiftEdit id={id} />} />
                                <Route exact path='/admin/lifts/:id' component={() => <Lift id={id} />} />
                                <Route component={NotFound} />
                            </Switch>
                        }} />
                        <Route exact path='/admin/lifts' component={Lifts} />
                        <Route component={NotFound} />
                    </Switch>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(Admin);