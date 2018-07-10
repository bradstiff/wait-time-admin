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
import LinkButton from '../common/LinkButton';
import SortEnabledTableHead, { makeCompareFn } from '../common/SortEnabledTableHead';

const upliftsQuery = gql`
    query UpliftStatsByResort($resortID: Int!, $groupBy: String!) {
        resort(id: $resortID) { 
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

class ResortStats extends Component {
    state = {
        groupBy: 'Season',
        order: 'asc',
        orderBy: 'groupDescription',
    };

    handleSelectGroupBy = groupBy => {
        this.setState({
            groupBy,
        });
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
        const { classes, match } = this.props;
        const { groupBy, seasonYear, month, day, hour, order, orderBy } = this.state;
        const id = parseInt(match.params.id);
        return <Query
            query={upliftsQuery}
            variables={{
                resortID: id,
                groupBy,
            }}
        >
            {({ error, data }) => {
                if (error) {
                    console.log(error);
                    return null;
                }
                const { resort } = data;
                if (resort === undefined) {
                    return null;
                }
                if (resort === null) {
                    return <p>Resort not found</p>;
                }

                const { upliftGroupings } = resort;
                const columnData = [
                    { field: 'groupDescription', label: groupBy, keyField: 'groupKey', compareField: groupBy === 'Lift' ? 'groupDescription' : 'groupKey' },
                    { field: 'upliftCount', label: 'Uplifts', keyField: 'groupKey' },
                    { field: 'waitTimeAverage', label: 'Avg Wait (s)', keyField: 'groupKey' },
                ];
                return (
                    <Paper>
                        <Toolbar className={classes.toolbar}>
                            <div className={classes.title}>
                                <Typography variant="headline" gutterBottom>
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
                            <div>
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
                                                    <TableCell component="th" scope="row">
                                                        {groupBy === 'Lift'
                                                            ? <LinkButton to={`/admin/lifts/${grouping.groupKey}`}>{grouping.groupDescription}</LinkButton>
                                                            : grouping.groupDescription
                                                        }
                                                    </TableCell>
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

export default withStyles(styles)(ResortStats);