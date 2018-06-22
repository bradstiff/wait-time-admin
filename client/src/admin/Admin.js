import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import Resorts from './Resorts';
import Resort from './Resort';
import EditResort from './EditResort';
import AddResort from './AddResort';
import Lifts from './Lifts';
import LiftUplifts from './LiftUplifts';

class Admin extends Component {
    render() {
        let activeTab = null;
        const pathname = this.props.location.pathname;
        if (pathname.indexOf('/admin/resorts') > -1) {
            activeTab = 0;
        } else if (pathname.indexOf('/admin/lifts') > -1) {
            activeTab = 1;
        }
        return (
            <div>
                <AppBar position="static" color='default'>
                    <Toolbar>
                        <Typography variant="title">
                            Wait Times Admin
                        </Typography>
                        <Tabs value={activeTab}>
                            <Tab label="Resorts" component={Link} to='/admin/resorts' />
                            <Tab label="Lifts" component={Link} to='/admin/lifts' />
                        </Tabs>
                    </Toolbar>
                </AppBar>
                <Switch>
                    <Route exact path='/admin/resorts/create' component={AddResort} />
                    <Route exact path='/admin/resorts/:id' component={Resort} />
                    <Route exact path='/admin/resorts' component={Resorts} />
                    <Route exact path='/admin/lifts/:id/uplifts' component={LiftUplifts} />
                    <Route exact path='/admin/lifts' component={Lifts} />
                </Switch>
            </div>
        );
    }
}

export default Admin;