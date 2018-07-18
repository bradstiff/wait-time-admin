import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ResortList from '../../common/ResortList';
import Locations from '../../app/Locations';

const styles = theme => ({
    container: {
        maxWidth: 700,
        backgroundColor: theme.palette.background.default,
    },
});

const Resorts = ({ classes }) => (
    <div className={classes.container}>
        <ResortList linkTo={resort => Locations.Resort.toUrl({ id: resort.id })} chevron />
    </div>
);

export default withStyles(styles)(Resorts);