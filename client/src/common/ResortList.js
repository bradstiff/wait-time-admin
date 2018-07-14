import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Query, compose } from 'react-apollo';
import gql from 'graphql-tag';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { withStyles } from '@material-ui/core/styles';

export const resortsQuery = gql`
    query Resorts {
        resorts { 
            id,
            name,
            slug,
            logoFilename,
            hasWaitTimes,
            lifts { id },
        }
    }
`;

const styles = theme => ({
    logoContainer: {
        textAlign: 'center',
        width: 180,
    },
    logo: {
        height: 60,
        width: 'auto',
        maxWidth: 200,
        padding: 5,
        paddingRight: 20,
        opacity: 0.75,
        cursor: 'pointer',
        '&:hover': {
            opacity: 1
        },
    },
});

const ResortList = ({ classes, linkTo, onClick, showChevron }) => {
    return <Query query={resortsQuery}>
        {({ loading, error, data }) => {
            if (error) {
                console.log(error);
                return null;
            }
            if (loading) {
                return null;
            }
            const { resorts } = data;
            return (
                <List>
                    {resorts.map(resort => {
                        let secondaryText = `${resort.lifts.length} lifts`;
                        if (resort.hasWaitTimes) {
                            secondaryText += ', Wait time data';
                        }
                        return (
                            <ListItem key={resort.id} dense button component={Link} to={linkTo(resort)} onClick={onClick}>
                                <div className={classes.logoContainer}>
                                    <img alt={resort.name} src={`${process.env.PUBLIC_URL}/logos/${resort.logoFilename}`} className={classes.logo} />
                                </div>
                                <ListItemText primary={resort.name} secondary={secondaryText} />
                                {showChevron &&
                                    <ListItemIcon>
                                        <ChevronRightIcon />
                                    </ListItemIcon>
                                }
                            </ListItem>
                        );
                    })}
                </List>
            );
        }}
    </Query>
};

ResortList.propTypes = {
    linkTo: PropTypes.func.isRequired,
    onClick: PropTypes.func,
    showChevron: PropTypes.bool,
};

ResortList.defaultProps = {
    showChevron: false,
};

export default withStyles(styles)(ResortList);