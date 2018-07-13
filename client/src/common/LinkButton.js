import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';

const style = {
    textTransform: 'none',
    minWidth: 1, //disable padding which causes alignment problems in lists
};

export default ({ to, children }) => (
    <Button color='primary' component={Link} style={style} to={to}>
        {children}
    </Button>
);