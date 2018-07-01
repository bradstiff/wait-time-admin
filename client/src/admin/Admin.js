import React, { Component } from 'react';
import { Switch, Route, Link } from 'react-router-dom';
import styled from 'styled-components';

import { withStyles } from '@material-ui/core/styles';
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
import ResortLifts from './ResortLifts';
import EditResort from './EditResort';
import AddResort from './AddResort';
import Lifts from './Lifts';
import Lift from './Lift';
import LiftUplifts from './LiftUplifts';
import LiftStats from './LiftStats';
import BackgroundImage from '../assets/resort-carousel-bg.jpg';

const Background = styled.div`
    background-image: url(${BackgroundImage});
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat; 
    background-attachment: fixed;
    min-height: 100vh;
`;

const styles = theme => ({
    container: {
        maxWidth: '1200px',
        margin: 'auto',
    },
    content: {
        marginTop: theme.spacing.unit,
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
            <Background>
                <div className={classes.container}>
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
                    <div className={classes.content}>
                        <Switch>
                            <Route exact path='/admin/resorts/create' component={AddResort} />
                            <Route exact path='/admin/resorts/:id/lifts' component={ResortLifts} />
                            <Route exact path='/admin/resorts/:id/edit' component={EditResort} />
                            <Route exact path='/admin/resorts/:id' component={Resort} />
                            <Route exact path='/admin/resorts' component={Resorts} />
                            <Route exact path='/admin/lifts/:id/stats' component={LiftStats} />
                            <Route exact path='/admin/lifts/:id/uplifts' component={LiftUplifts} />
                            <Route exact path='/admin/lifts/:id' component={Lift} />
                            <Route exact path='/admin/lifts' component={Lifts} />
                        </Switch>
                    </div>
                </div>
            </Background>
        );
    }
}

export default withStyles(styles)(Admin);