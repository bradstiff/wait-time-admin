import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import ResortList from '../common/ResortList';

const styles = theme => ({
    container: {
        maxWidth: 700,
        backgroundColor: theme.palette.background.default,
    },
});

const Resorts = ({ classes }) => (
    <div className={classes.container}>
        <ResortList linkTo={resort => `/admin/resorts/${resort.id}`} showChevron />
    </div>
);

export default withStyles(styles)(Resorts);