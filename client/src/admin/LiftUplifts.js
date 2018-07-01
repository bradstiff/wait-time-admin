import React, { Component } from 'react';
import { Query, graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

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

import SortEnabledTableHead, { makeCompareFn } from '../app/SortEnabledTableHead';
import SelectMenu from '../app/SelectMenu';

const upliftsQuery = gql`
    query UpliftsByLift($liftID: Int!, $offset: Int!, $limit: Int!, $orderBy: String!, $order: String!, $seasonYear: Int, $month: Int, $day: Int, $hour: Int) {
        lift(id: $liftID) { 
            id,
            name,
            upliftList(offset: $offset, limit: $limit, orderBy: $orderBy, order: $order, seasonYear: $seasonYear, month: $month, day: $day, hour: $hour) {
                count,
                uplifts {
                    id,
                    date,
                    waitSeconds
                }
            }
        }
    }
`;

const columnData = [
    { field: 'date', numeric: false, disablePadding: false, label: 'Date' },
    { field: 'waitSeconds', numeric: true, disablePadding: false, label: 'Wait Time (s)' },
];

const styles = theme => ({
    toolbar: {
//        paddingRight: theme.spacing.unit,
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

class LiftUplifts extends Component {
    state = {
        page: 0,
        rowsPerPage: 25,
        order: 'asc',
        orderByCol: columnData[0],
        seasonYear: null,
        month: null,
        day: null,
        hour: null,
    };

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

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = event => {
        this.setState({ rowsPerPage: event.target.value });
    };

    handleRequestSort = (event, column) => {
        let order = 'desc';

        if (this.state.orderByCol === column && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderByCol: column });
    };

    render() {
        const { classes, match } = this.props;
        const { page, rowsPerPage, order, orderByCol, seasonYear, month, day, hour } = this.state;
        const id = parseInt(match.params.id);
        return <Query
            query={upliftsQuery}
            variables={{
                liftID: id,
                offset: page * rowsPerPage,
                limit: rowsPerPage,
                orderBy: orderByCol.field,
                order,
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

                const { lift, lift: { upliftList } } = data;
                return (
                    <Paper>
                        <Toolbar className={classes.toolbar}>
                            <div className={classes.title}>
                                <Typography variant="headline" gutterBottom>
                                    {lift.name} Uplifts
                                </Typography>
                            </div>
                            <div className={classes.spacer} />
                            <div className={classes.actions}>
                                <SelectMenu
                                    id='season'
                                    options={[
                                        { text: 'All seasons', value: null },
                                        { text: '2014 - 2015', value: 2014 },
                                        { text: '2015 - 2016', value: 2015 },
                                        { text: '2016 - 2017', value: 2016 },
                                        { text: '2017 - 2018', value: 2017 },
                                    ]}
                                    value={seasonYear}
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
                                    value={month}
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
                                    value={day}
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
                                    value={hour}
                                    onSelect={this.handleSelectHour}
                                />
                            </div>
                        </Toolbar>
                        {upliftList.count && (
                            <div>
                                <Table>
                                    <SortEnabledTableHead
                                        order={order}
                                        orderByCol={orderByCol}
                                        onRequestSort={this.handleRequestSort}
                                        columns={columnData}
                                    />
                                    <TableBody>
                                        {upliftList.uplifts
                                            .slice()
                                            .map(uplift => (
                                                <TableRow key={uplift.id}>
                                                    <TableCell component="th" scope="row">{moment.utc(uplift.date).format('llll')}</TableCell>
                                                    <TableCell numeric>{uplift.waitSeconds}</TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    component="div"
                                    count={upliftList.count}
                                    rowsPerPage={rowsPerPage}
                                    rowsPerPageOptions={[25, 50, 100, 200]}
                                    page={page}
                                    backIconButtonProps={{
                                        'aria-label': 'Previous Page',
                                    }}
                                    nextIconButtonProps={{
                                        'aria-label': 'Next Page',
                                    }}
                                    onChangePage={this.handleChangePage}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                />
                            </div>
                        )}
                    </Paper>
                );
            }}
        </Query>
    };
}

export default withStyles(styles)(LiftUplifts);