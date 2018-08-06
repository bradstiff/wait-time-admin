import React from 'react';
import { compose } from 'react-apollo';

import { withStyles } from '@material-ui/core/styles';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

import ResortList from '../../common/ResortList';
import Locations from '../../app/Locations';

const styles = theme => ({
    container: {
        maxWidth: 700,
        backgroundColor: theme.palette.background.default,
    },
});

const Resorts = ({ classes, width }) => (
    <div className={classes.container}>
        <ResortList linkTo={resort => Locations.Resort.toUrl({ id: resort.id })} chevron={isWidthUp('sm', width)} />
    </div>
);

export default compose(
    withStyles(styles),
    withWidth(),
)(Resorts);