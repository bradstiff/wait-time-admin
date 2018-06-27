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
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import Search from '@material-ui/icons/Search';
import { DebounceInput } from 'react-debounce-input';

import SortEnabledTableHead, { makeCompareFn } from '../app/SortEnabledTableHead';
import SelectMenu from '../app/SelectMenu';
import LiftTypes from '../app/LiftTypes';

const query = gql`
    query LiftList($offset: Int!, $limit: Int!, $orderBy: String!, $order: String!, $name: String, $typeID: Int, $resortID: Int, $isActive: Boolean) {
        liftList(offset: $offset, limit: $limit, orderBy: $orderBy, order: $order, name: $name, typeID: $typeID, resortID: $resortID, isActive: $isActive) {
            count,
            lifts {
                id,
                name,
                type {
                    id,
                    description,
                },
                resort {
                    id,
                    name
                }
                isActive
            }
        }
    }
`;

const columnData = [
    { field: 'name', numeric: false, disablePadding: true, label: 'Name' },
    { field: 'typeID', numeric: false, disablePadding: false, label: 'Type' },
    { field: 'resortID', numeric: false, disablePadding: false, label: 'Resort' },
    { field: 'isActive', numeric: false, disablePadding: false, label: 'Active' },
];

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

class Lifts extends Component {
    rowsPerPage = 100;

    state = {
        page: 0,
        rowsPerPage: 50,
        order: 'asc',
        orderByCol: columnData[0],
        isActive: true,
    };

    handleSelectType = typeID => 
        this.setState({
            typeID,
        });

    handleSearchName = event => {
        const value = event.target.value || undefined;
        this.setState({
            name: value,
        });
    }

    handleSelectResort = resortID => 
        this.setState({
            resortID,
        });

    handleSelectStatus = isActive => 
        this.setState({
            isActive,
        });


    handleChangePage = (event, page) =>
        this.setState({ page });

    handleChangeRowsPerPage = event => 
        this.setState({ rowsPerPage: event.target.value });

    handleRequestSort = (event, column) => {
        let order = 'desc';

        if (this.state.orderByCol === column && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderByCol: column });
    };

    render() {
        const { classes, match } = this.props;
        const { page, rowsPerPage, order, orderByCol, name, typeID, resortID, isActive } = this.state;
        return <Query
            query={query}
            variables={{
                offset: page * rowsPerPage,
                limit: rowsPerPage,
                orderBy: orderByCol.field,
                order,
                name,
                typeID,
                resortID,
                isActive,
            }}
        >
            {({ loading, error, data }) => {
                if (error) {
                    console.log(error);
                    return null;
                }
                if (data.liftList === undefined) {
                    return null;
                }

                const { liftList } = data;
                return (
                    <Paper>
                        <Toolbar>
                            <div className={classes.title}>
                                <Typography variant="subheading" gutterBottom>
                                    Lifts
                                </Typography>
                            </div>
                            <div className={classes.spacer} />
                            <div className={classes.actions}>
                                <DebounceInput
                                    debounceTimeout={750}
                                    value={name}
                                    onChange={this.handleSearchName}
                                    type='search'
                                    placeholder='Name'
                                />
                                <SelectMenu
                                    id='type'
                                    options={[
                                        { text: 'All types' },
                                        ...LiftTypes.map(type => ({ text: type.description, value: type.id, }))
                                    ]}
                                    value={typeID}
                                    onSelect={this.handleSelectType}
                                />
                                <SelectMenu
                                    id='resort'
                                    options={[
                                        { text: 'All resorts' },
                                        { text: 'No resort assigned', value: null },
                                        { text: 'Steamboat', value: 1 },
                                        { text: 'Winter Park', value: 2 },
                                    ]}
                                    value={resortID}
                                    onSelect={this.handleSelectResort}
                                />
                                <SelectMenu
                                    id='status'
                                    options={[
                                        { text: 'All statuses' },
                                        { text: 'Active', value: true },
                                        { text: 'Inactive', value: false },
                                    ]}
                                    value={isActive}
                                    onSelect={this.handleSelectStatus}
                                />
                            </div>
                        </Toolbar>
                        {liftList.count && (
                            <div>
                                <Table>
                                    <SortEnabledTableHead
                                        order={order}
                                        orderByCol={orderByCol}
                                        onRequestSort={this.handleRequestSort}
                                        columns={columnData}
                                    />
                                    <TableBody>
                                        {liftList.lifts
                                            .slice()
                                            .map(lift => (
                                                <TableRow key={lift.id}>
                                                    <TableCell component="th" scope="row">{lift.name}</TableCell>
                                                    <TableCell>{lift.type.description}</TableCell>
                                                    <TableCell>{lift.resort ? lift.resort.name : ''}</TableCell>
                                                    <TableCell>{lift.isActive ? '✓' : ''}</TableCell>
                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    component="div"
                                    count={liftList.count}
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

export default withStyles(toolbarStyles)(Lifts);