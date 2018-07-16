import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import styled from 'styled-components';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import Resorts from './Resorts';
import Resort from './Resort';
import ResortLifts from './ResortLifts';
import ResortEdit from './ResortEdit';
import ResortCreate from './ResortCreate';
import ResortStats from './ResortStats';
import Lifts from './Lifts';
import Lift from './Lift';
import LiftEdit from './LiftEdit';
import LiftUplifts from './LiftUplifts';
import LiftStats from './LiftStats';
import NotFound from '../app/NotFound';

import UserErrorMessage from '../common/UserErrorMessage';

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
                        <Route exact path='/admin/resorts/create' component={ResortCreate} />
                        <Route path='/admin/resorts/:id' children={({ match }) => {
                            const id = parseInt(match.params.id);
                            if (isNaN(id)) {
                                return <UserErrorMessage message={{ text: 'The resort ID in the address bar is invalid. Resort ID must be a whole number.', severity: 1}} />
                            }
                            return <Switch>
                                <Route exact path='/admin/resorts/:id/stats' component={() => <ResortStats id={id} />} />
                                <Route exact path='/admin/resorts/:id/lifts' component={() => <ResortLifts id={id} />} />
                                <Route exact path='/admin/resorts/:id/edit' component={() => <ResortEdit id={id} />} />
                                <Route exact path='/admin/resorts/:id' component={() => <Resort id={id} />} />
                                <Route component={NotFound} />
                            </Switch>
                        }} />
                        <Route exact path='/admin/resorts' component={Resorts} />
                        <Route path='/admin/lifts/:id' children={({ match }) => {
                            const id = parseInt(match.params.id);
                            if (isNaN(id)) {
                                return <UserErrorMessage message={{ text: 'The lift ID in the address bar is invalid. Lift ID must be a whole number.', severity: 1}} />
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