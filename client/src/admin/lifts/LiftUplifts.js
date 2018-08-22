import React, { Component } from 'react';
import { compose } from 'react-apollo';
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
import Collapse from '@material-ui/core/Collapse';
import FilterListIcon from '@material-ui/icons/FilterList';
import Hidden from '@material-ui/core/Hidden';

import SortEnabledTableHead from '../../common/SortEnabledTableHead';
import SelectMenu from '../../common/SelectMenu';
import Locations from '../../app/Locations';
import LiftNotFound from '../../app/LiftNotFound';
import withQuery from '../../common/withQuery';
import ToggleIconButton from '../../common/ToggleIconButton';

export const UPLIFTS_BY_LIFT_QUERY = gql`
    query UpliftsByLift($id: Int!, $offset: Int!, $limit: Int!, $orderBy: String!, $order: String!, $seasonYear: Int, $month: Int, $day: Int, $hour: Int) {
        lift(id: $id) { 
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
    { field: 'date', label: 'Date' },
    { field: 'waitSeconds', label: 'Wait Time (seconds)', numeric: true },
];

const styles = theme => ({
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
    tableContainer: {
        overflowX: 'auto',
    },
});

class LiftUplifts extends Component {
    replaceLocation = qsParams => {
        const nextLocation = Locations.LiftUplifts.toUrl({
            ...this.props,
            ...qsParams
        });
        this.props.history.replace(nextLocation);
    }

    handleSelectSeason = seasonYear => this.replaceLocation({ seasonYear });
    handleSelectMonth = month => this.replaceLocation({ month });
    handleSelectDay = day => this.replaceLocation({ day });
    handleSelectHour = hour => this.replaceLocation({ hour });
    handleToggleFilter = () => this.replaceLocation({ showFilter: !this.props.showFilter });
    handleChangePage = (event, page) => this.replaceLocation({ page });
    handleChangeRowsPerPage = event => this.replaceLocation({ rowsPerPage: event.target.value });

    handleRequestSort = (event, fieldName) => {
        const order = this.props.orderBy === fieldName && this.props.order === 'asc'
            ? 'desc'
            : 'asc';
        this.replaceLocation({ order, orderBy: fieldName, });
    };

    render() {
        const { id, classes, lift, page, rowsPerPage, order, orderBy, showFilter, seasonYear, month, day, hour } = this.props;
        const { upliftList } = lift;
        const filterControls = [
            <SelectMenu
                id='season'
                options={[
                    { text: 'All seasons' },
                    { text: '2014 - 2015', value: 2014 },
                    { text: '2015 - 2016', value: 2015 },
                    { text: '2016 - 2017', value: 2016 },
                    { text: '2017 - 2018', value: 2017 },
                ]}
                value={seasonYear}
                onSelect={this.handleSelectSeason}
            />,
            <SelectMenu
                id='month'
                options={[
                    { text: 'All months' },
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
            />,
            <SelectMenu
                id='day'
                options={[
                    { text: 'All days' },
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
            />,
            <SelectMenu
                id='hour'
                options={[
                    { text: 'All hours' },
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
            />,
        ];

        return (
            <Paper>
                <Toolbar>
                    <div className={classes.title}>
                        <Typography variant="subheading">
                            {lift.name} Uplifts
                        </Typography>
                    </div>
                    <div className={classes.spacer} />
                    <div className={classes.actions}>
                        <Hidden xsDown>
                            {filterControls}
                        </Hidden>
                        <Hidden smUp>
                            <ToggleIconButton isOn={showFilter} onTip='Show filters' offTip='Hide filters' onToggle={this.handleToggleFilter}>
                                <FilterListIcon />
                            </ToggleIconButton>
                        </Hidden>
                    </div>
                </Toolbar>
                <Hidden smUp>
                    <Collapse in={showFilter}>
                        {filterControls}
                    </Collapse>
                </Hidden>
                {upliftList.count > 0 && (
                    <div className={classes.tableContainer}>
                        <Table>
                            <SortEnabledTableHead
                                order={order}
                                orderBy={orderBy}
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
                {upliftList.count === 0 && <Typography>No uplifts found.</Typography>}
            </Paper>
        );
    };
}

const mapPropsToVariables = props => ({
    id: props.id,
    offset: props.page * props.rowsPerPage,
    limit: props.rowsPerPage,
    orderBy: props.orderBy,
    order: props.order,
    seasonYear: props.seasonYear,
    month: props.month,
    day: props.day,
    hour: props.hour,
});

export default compose(
    withStyles(styles),
    withQuery(UPLIFTS_BY_LIFT_QUERY, {
        selector: 'lift',
        variables: mapPropsToVariables,
    }, LiftNotFound),
)(LiftUplifts);