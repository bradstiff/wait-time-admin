import React, { Component } from 'react';
import { Query, graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import Typography from '@material-ui/core/Typography';

import SortEnabledTableHead, { makeCompareFn } from '../app/SortEnabledTableHead';

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
    { field: 'date', numeric: false, disablePadding: true, label: 'Date' },
    { field: 'waitSeconds', numeric: true, disablePadding: false, label: 'Wait Time (s)' },
];

class LiftUplifts extends Component {
    rowsPerPage = 100;

    state = {
        page: 0,
        rowsPerPage: 50,
        order: 'asc',
        orderByCol: columnData[0],
    };

    handleSelectSeason = selectedYear => (event, expanded) => {
        if (expanded) {
            //select the uplift summaries for the selected season
            const upliftSummaries = this.props.data.resort.lifts
                .map(lift => {
                    const upliftSummary = lift.upliftSummaries.find(summary => summary.season.year === selectedYear) || {};
                    return {
                        liftID: lift.id,
                        lift: lift.name,
                        upliftCount: upliftSummary.upliftCount,
                        waitTimeAverage: upliftSummary.waitTimeAverage,
                    };
                });
            this.setState({
                selectedYear,
                upliftSummaries,
            });
        } else {
            this.setState({
                selectedYear: null,
                upliftSummaries: null,
            });
        }
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
        const { page, rowsPerPage, order, orderByCol } = this.state;
        const id = parseInt(match.params.id);
        return <Query
            query={upliftsQuery}
            variables={{
                liftID: id,
                offset: page * rowsPerPage,
                limit: rowsPerPage,
                orderBy: orderByCol.field,
                order,
            }}
        >
            {({ loading, error, data }) => {
                if (error) {
                    console.log(error);
                    return null;
                }
                if (loading) {
                    return null;
                }

                const { lift, lift: { upliftList } } = data;
                return (
                    <Paper>
                        <Typography variant="display3" gutterBottom>
                            {lift.name} Uplifts
                        </Typography>
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

export default LiftUplifts;