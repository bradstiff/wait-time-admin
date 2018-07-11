import React, { Component } from 'react';
import { Query, graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import { withStyles } from '@material-ui/core/styles';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';
import TableHead from '@material-ui/core/TableHead';

import SelectMenu from '../common/SelectMenu';

const upliftsQuery = gql`
    query UpliftStatsByLift($liftID: Int!, $groupBy: String!) {
        lift(id: $liftID) { 
            id,
            name,
            upliftGroupings(groupBy: $groupBy) {
                groupKey,
                groupDescription,
                upliftCount,
                waitTimeAverage
            }
        }
    }
`;

const styles = theme => ({
    toolbar: {
//        paddingRight: theme.spacing.unit,
    },
    spacer: {
        flex: 'auto',
    },
    actions: {
        flex: 'none',
        color: theme.palette.text.secondary,
    },
    title: {
        flex: 'none',
    },
});

class LiftStats extends Component {
    state = {
        groupBy: 'Season',
    };

    handleSelectGroupBy = groupBy => {
        this.setState({
            groupBy,
        });
    }

    render() {
        const { classes, id } = this.props;
        const { groupBy, seasonYear, month, day, hour } = this.state;
        return <Query
            query={upliftsQuery}
            variables={{
                liftID: id,
                groupBy,
                seasonYear,
                month,
                day,
                hour,
            }}
        >
            {({ error, data }) => {
                if (error) {
                    console.log(error);
                    return null;
                }
                const { lift } = data;
                if (lift === undefined) {
                    return null;
                }
                if (lift === null) {
                    return <p>Lift not found</p>;
                }

                const { upliftGroupings } = lift;
                return (
                    <Paper>
                        <Toolbar className={classes.toolbar}>
                            <div className={classes.title}>
                                <Typography variant="headline" gutterBottom>
                                    {lift.name} Stats
                                </Typography>
                            </div>
                            <div className={classes.spacer} />
                            <div className={classes.actions}>
                                <SelectMenu
                                    id='groupBy'
                                    options={[
                                        { text: 'By season', value: 'Season' },
                                        { text: 'By month', value: 'Month' },
                                        { text: 'By day', value: 'Day' },
                                        { text: 'By hour', value: 'Hour' },
                                    ]}
                                    onSelect={this.handleSelectGroupBy}
                                    value={groupBy}
                                />
                            </div>
                        </Toolbar>
                        {upliftGroupings && (
                            <div>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>{groupBy}</TableCell>
                                            <TableCell>Uplifts</TableCell>
                                            <TableCell>Avg Wait (s)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {upliftGroupings.map(grouping => (
                                            <TableRow key={grouping.groupKey}>
                                                <TableCell component="th" scope="row">{grouping.groupDescription}</TableCell>
                                                <TableCell>{grouping.upliftCount}</TableCell>
                                                <TableCell>{grouping.waitTimeAverage}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </Paper>
                );
            }}
        </Query>
    };
}

export default withStyles(styles)(LiftStats);