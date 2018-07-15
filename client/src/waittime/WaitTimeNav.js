import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import { compose } from 'react-apollo';

import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';

import DateNav from './DateNav';
import ResortList from '../common/ResortList';

const DESKTOP_BREAKPOINT = 600;

const ResortName = styled.span`
    flex: auto;
    vertical-align: middle;
    text-transform: uppercase;
    border: none;
    font-family: "Gotham A", "Century Gothic", sans-serif;
    font-weight: 800;
    @media (min-width: ${DESKTOP_BREAKPOINT}px) {
        font-size: 28px;
        color: #FFF;
        padding: 2px 5px 2px 5px;
        margin-right: 10px;
    }
`;

const styles = theme => ({
    resortDrawer: {
        backgroundColor: theme.palette.background.default,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
});

class WaitTimeNav extends Component {
    state = {
        showMenu: false,
    }

    handleToggleMenu = show => {
        this.setState({
            showMenu: show,
        });
    }

    handleSelectDate = date => {
        this.props.history.push(`/resorts/${this.props.resort.slug}?date=${date.format('YYYY-MM-DD')}`);
    }

    render() {
        const { resortSlug, resort, date, classes, width } = this.props;
        const resortName = resort ? resort.name : 'Loading';
        const dateDisplayFormat = isWidthUp('sm', width)
            ? 'dddd, LL'
            : 'ddd, LL';
        const dateNavStyle = isWidthUp('sm', width)
            ? { minWidth: 400, display: 'inline-flex' }
            : { padding: 10 };

        return ([
            <AppBar position="static" color='default'>
                <Toolbar>
                    <IconButton className={classes.menuButton} aria-label="Menu" onClick={() => this.handleToggleMenu(true)}>
                        <MenuIcon />
                    </IconButton>
                    <ResortName>{(resort && resort.name) || 'Loading'} Wait Times</ResortName>
                    <Hidden smDown>
                        <DateNav
                            dates={resort && resort.dates}
                            date={date}
                            displayFormat={dateDisplayFormat}
                            style={dateNavStyle}
                            selectDate={this.handleSelectDate}
                            />
                    </Hidden>
                </Toolbar>
            </AppBar>,
            <Hidden mdUp>
                <DateNav
                    dates={resort && resort.dates}
                    date={date}
                    displayFormat={dateDisplayFormat}
                    style={dateNavStyle}
                    selectDate={this.handleSelectDate}
                />
            </Hidden>,
            <Drawer open={this.state.showMenu} onClose={() => this.handleToggleMenu(false)} classes={{ paper: classes.resortDrawer }}>
                <ResortList linkTo={resort => `/resorts/${resort.slug}`} onClick={() => this.handleToggleMenu(false)} />
            </Drawer>
        ]);
    };
}

export default compose(
    withRouter,
    withWidth(),
    withStyles(styles),
)(WaitTimeNav);
