import React from 'react';
import { Link } from 'react-router-dom';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';

export default () => (
    <div style={{minHeight: '100vh'}}>
        <Paper style={{ padding: 10, maxWidth: 1250 }}>
            <Typography paragraph variant='display1'>Page Not Found</Typography>
            <Typography paragraph>Looks like you've followed a broken link or entered a URL that doesn't exist on this site.</Typography>
            <Button color='primary' component={Link} to="/">
                <ChevronLeftIcon />
                Back to Home
            </Button>
        </Paper>
    </div>
);
