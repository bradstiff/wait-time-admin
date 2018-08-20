import React, { Component } from 'react';
import { matchPath } from 'react-router';
import { Switch, Route } from 'react-router-dom';

import { withStyles } from '@material-ui/core/styles';
import Hidden from '@material-ui/core/Hidden';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';

import Resorts from './resorts/Resorts';
import ResortCreate from './resorts//ResortCreate';
import Resort from './resorts/Resort';
import ResortDetails from './resorts/ResortDetails';
import ResortLifts from './resorts/ResortLifts';
import ResortStats from './resorts/ResortStats';

import Lifts from './lifts/Lifts';
import Lift from './lifts/Lift';
import LiftDetails from './lifts/LiftDetails';
import LiftUplifts from './lifts/LiftUplifts';
import LiftStats from './lifts/LiftStats';

import { UserConsumer } from '../app/UserContext';
import Login from '../common/Login';
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
    },
    title: {
        paddingRight: theme.spacing.unit * 2,
    },
    toolbarTabs: {
        flex: 'auto',
    },
});

class Admin extends Component {
    state = {
        showLogin: false,
    }

    handleShowLogin = () => this.setState({ showLogin: true });
    handleCancelLogin = () => this.setState({ showLogin: false });

    handleLogin = callback => {
        this.setState({ showLogin: false });
        callback();
    }

    render() {
        const { classes, location } = this.props;
        const { showLogin } = this.state;

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
                        <Hidden xsDown>
                            <Typography variant="title" className={classes.title}>Wait Time Admin</Typography>
                        </Hidden>
                        <Tabs value={activeTab} className={classes.toolbarTabs}>
                            <Tab label="Resorts" component={Locations.Resorts.toLink()} />
                            <Tab label="Lifts" component={Locations.Lifts.toLink({ isActive: true })} />
                        </Tabs>
                        <UserConsumer>
                            {({ user, onLogout }) => user
                                ? <Button onClick={onLogout} color="inherit">Logout</Button>
                                : <Button onClick={this.handleShowLogin} color="inherit">Login</Button>
                            }
                        </UserConsumer>
                    </Toolbar>
                </AppBar>
                <div className={classes.content}>
                    <Switch>
                        {Locations.Resorts.toRoute({ component: Resorts, noMatch: NotFound }, true)}
                        {Locations.Resort.toRoute({ component: Resort, noMatch: NotFound }, true)}
                        {Locations.ResortDetails.toRoute({ component: ResortDetails, noMatch: NotFound }, true)}
                        {Locations.ResortLifts.toRoute({ component: ResortLifts, noMatch: NotFound }, true)}
                        {Locations.ResortStats.toRoute({ component: ResortStats, noMatch: NotFound }, true)}
                        {Locations.Lifts.toRoute({ component: Lifts, noMatch: NotFound }, true)}
                        {Locations.Lift.toRoute({ component: Lift, noMatch: NotFound }, true)}
                        {Locations.LiftDetails.toRoute({ component: LiftDetails, noMatch: NotFound }, true)}
                        {Locations.LiftUplifts.toRoute({ component: LiftUplifts, noMatch: NotFound }, true)}
                        {Locations.LiftStats.toRoute({ component: LiftStats, noMatch: NotFound }, true)}
                        <Route component={NotFound} />
                    </Switch>
                </div>
                <UserConsumer>
                    {({ onLogin }) => <Login open={showLogin} onLogin={() => this.handleLogin(onLogin)} onCancel={this.handleCancelLogin} />}
                </UserConsumer>
            </div>
        );
    }
}

export default withStyles(styles)(Admin);