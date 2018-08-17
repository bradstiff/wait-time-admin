import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'react-apollo';
import gql from 'graphql-tag';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Toolbar from '@material-ui/core/Toolbar';

import SelectMenu from '../../common/SelectMenu';
import LinkButton from '../../common/LinkButton';
import SortEnabledTableHead, { makeCompareFn } from '../../common/SortEnabledTableHead';
import ResortNotFound from '../../app/ResortNotFound';
import withQuery from '../../common/withQuery';
import Locations from '../../app/Locations';

const query = gql`
    query UpliftStatsByResort($id: Int!, $groupBy: UpliftGroupBy!) {
        resort(id: $id) { 
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

class ResortStats extends Component {
    state = {
        order: 'asc',
        orderBy: 'groupDescription',
    };

    handleSelectGroupBy = groupBy => {
        const { history, id } = this.props;
        history.replace(Locations.ResortStats.toUrl({ id, groupBy }));
    }

    handleRequestSort = (event, fieldName) => {
        const order = this.state.orderBy === fieldName && this.state.order === 'asc'
            ? 'desc'
            : 'asc';
        this.setState({
            order,
            orderBy: fieldName
        });
    };

    render() {
        const { id, groupBy, resort, loading, classes } = this.props;
        const { order, orderBy } = this.state;
        const { upliftGroupings } = resort;
        const columnData = [
            { field: 'groupDescription', label: groupBy, keyField: 'groupKey', compareField: groupBy === 'Lift' ? 'groupDescription' : 'groupKey', padding: 'dense' },
            { field: 'upliftCount', label: 'Uplifts', keyField: 'groupKey', numeric: true , padding: 'dense' },
            { field: 'waitTimeAverage', label: 'Avg Wait (s)', keyField: 'groupKey', numeric: true , padding: 'dense' },
        ];
        return (
            <Paper>
                <Toolbar>
                    <div className={classes.title}>
                        <Typography variant="subheading">
                            {resort.name} Stats
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
                                { text: 'By lift', value: 'Lift' },
                            ]}
                            onSelect={this.handleSelectGroupBy}
                            value={groupBy}
                        />
                    </div>
                </Toolbar>
                {upliftGroupings && (
                    <div className={classes.tableContainer}>
                        <Table>
                            <SortEnabledTableHead
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={this.handleRequestSort}
                                columns={columnData}
                            />
                            <TableBody>
                                {upliftGroupings
                                    .slice()
                                    .sort(makeCompareFn(order, orderBy, columnData, 'groupKey'))
                                    .map(grouping => (
                                        <TableRow key={grouping.groupKey}>
                                            <TableCell component="th" scope="row" padding='dense'>
                                                {groupBy === 'Lift' && !loading
                                                    ? <LinkButton to={Locations.Lift.toUrl({ id: grouping.groupKey })}>{grouping.groupDescription}</LinkButton>
                                                    : grouping.groupDescription
                                                }
                                            </TableCell>
                                            <TableCell numeric padding='dense'>{grouping.upliftCount}</TableCell>
                                            <TableCell numeric padding='dense'>{grouping.waitTimeAverage}</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </Paper>
        );
    }
}

export default compose(
    withRouter,
    withStyles(styles),
    withQuery(query, 'resort', ResortNotFound),
)(ResortStats);