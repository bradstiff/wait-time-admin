import React from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core/styles';

export const resortsQuery = gql`
    query Resorts {
        resorts { 
            id,
            name,
            slug,
            logoFilename,
            lifts { id },
        }
    }
`;

const styles = theme => ({
    container: {
        width: 400,
        backgroundColor: theme.palette.background.default,
    },
    avatar: {
        width: 140,
        textAlign: 'center',
    },
    logo: {
        height: 60,
        width: 'auto',
        maxWidth: 140,
        padding: 10,
        opacity: 0.75,
        cursor: 'pointer',
        ['&:hover']: {
            opacity: 1
        },
    },
});

const Resorts = ({ classes }) => {
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
                <div className={classes.container}>
                    <List>
                        {resorts.map(resort => (
                            <ListItem key={resort.id} dense button component={Link} to={`/admin/resorts/${resort.id}`}>
                                <div className={classes.avatar}>
                                    <img alt={resort.name} src={`${process.env.PUBLIC_URL}/logos/${resort.logoFilename}`} className={classes.logo} />
                                </div>
                                <ListItemText primary={resort.name} secondary={`${resort.lifts.length} lifts`} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            );
        }}
    </Query>
};

export default withStyles(styles)(Resorts);