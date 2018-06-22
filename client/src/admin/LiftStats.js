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
    query UpliftStatsByLift($liftID: Int!, $groupBy: String!, $seasonYear: Int, $month: Int, $day: Int, $hour: Int) {
        lift(id: $liftID) { 
            id,
            name,
            upliftGroupings(groupBy: $groupBy, seasonYear: $seasonYear, month: $month, day: $day, hour: $hour) {
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
        seasonYear: null,
        month: null,
        day: null,
        hour: null,
    };

    handleSelectGroupBy = groupBy => {
        this.setState({
            groupBy,
        });
    }

    handleSelectSeason = seasonYear => {
        this.setState({
            seasonYear,
        });
    };

    handleSelectMonth = month => {
        this.setState({
            month,
        });
    };

    handleSelectDay = day => {
        this.setState({
            day,
        });
    };

    handleSelectHour = hour => {
        this.setState({
            hour,
        });
    };

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
                                        { text: 'Cross-tab by season', value: 'Season' },
                                        { text: 'Cross-tab by month', value: 'Month' },
                                        { text: 'Cross-tab by day', value: 'Day' },
                                        { text: 'Cross-tab by hour', value: 'Hour' },
                                    ]}
                                    onSelect={this.handleSelectGroupBy}
                                    initialValue={groupBy}
                                />
                                <SelectMenu
                                    id='season'
                                    options={[
                                        { text: 'All seasons', value: null },
                                        { text: '2014 - 2015', value: 2014 },
                                        { text: '2015 - 2016', value: 2015 },
                                        { text: '2016 - 2017', value: 2016 },
                                        { text: '2017 - 2018', value: 2017 },
                                    ]}
                                    onSelect={this.handleSelectSeason}
                                />
                                <SelectMenu
                                    id='month'
                                    options={[
                                        { text: 'All months', value: null },
                                        { text: 'January', value: 1 },
                                        { text: 'February', value: 2 },
                                        { text: 'March', value: 3 },
                                        { text: 'April', value: 4 },
                                        { text: 'May', value: 5 },
                                        { text: 'June', value: 6 },
                                        { text: 'July', value: 7 },
                                        { text: 'August', value: 8 },
                                        { text: 'September', value: 9 },
                                        { text: 'October', value: 10 },
                                        { text: 'November', value: 11 },
                                        { text: 'December', value: 12 },
                                    ]}
                                    onSelect={this.handleSelectMonth}
                                />
                                <SelectMenu
                                    id='day'
                                    options={[
                                        { text: 'All days', value: null },
                                        { text: 'Sunday', value: 1 },
                                        { text: 'Monday', value: 2 },
                                        { text: 'Tuesday', value: 3 },
                                        { text: 'Wednesday', value: 4 },
                                        { text: 'Thursday', value: 5 },
                                        { text: 'Friday', value: 6 },
                                        { text: 'Saturday', value: 7 },
                                    ]}
                                    onSelect={this.handleSelectDay}
                                />
                                <SelectMenu
                                    id='hour'
                                    options={[
                                        { text: 'All hours', value: null },
                                        { text: '8AM - 9AM', value: 8 },
                                        { text: '9AM - 10AM', value: 9 },
                                        { text: '10AM - 11AM', value: 10 },
                                        { text: '11AM - 12PM', value: 11 },
                                        { text: '12PM - 1PM', value: 12 },
                                        { text: '1PM - 2PM', value: 13 },
                                        { text: '2PM - 3PM', value: 14 },
                                        { text: '3PM - 4PM', value: 15 },
                                        { text: '4PM - 5PM', value: 16 },
                                    ]}
                                    onSelect={this.handleSelectHour}
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
                                                <TableCell numeric>{grouping.upliftCount}</TableCell>
                                                <TableCell numeric>{grouping.waitTimeAverage}</TableCell>
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