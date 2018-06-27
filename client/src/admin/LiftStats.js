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

import SelectMenu from '../app/SelectMenu';

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

const toolbarStyles = theme => ({
    root: {
        paddingRight: theme.spacing.unit,
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
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
        const { classes, match } = this.props;
        const { groupBy, seasonYear, month, day, hour } = this.state;
        const id = parseInt(match.params.id);
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
            {({ loading, error, data }) => {
                if (error) {
                    console.log(error);
                    return null;
                }
                if (data.lift === undefined) {
                    return null;
                }
                if (data.lift === null) {
                    return <p>Lift not found</p>;
                }

                const { lift, lift: { upliftGroupings } } = data;
                return (
                    <Paper>
                        <Toolbar>
                            <div className={classes.title}>
                                <Typography variant="subheading" gutterBottom>
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
                                    initialValue={groupBy}
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

export default withStyles(toolbarStyles)(LiftStats);