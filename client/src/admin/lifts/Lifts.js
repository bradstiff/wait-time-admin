import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { withStyles } from '@material-ui/core/styles';
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

import Search from '../../common/Search';
import ToggleIconButton from '../../common/ToggleIconButton';
import SortEnabledTableHead from '../../common/SortEnabledTableHead';
import LinkButton from '../../common/LinkButton';
import SelectMenu from '../../common/SelectMenu';
import LiftTypeData from '../../common/LiftTypeData';
import ResortData from '../../common/ResortData';
import Locations from '../../app/Locations';

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
    { field: 'name', label: 'Name' },
    { field: 'typeID', label: 'Type' },
    { field: 'resortID', label: 'Resort' },
    { field: 'isActive', label: 'Active' },
];

const styles = theme => ({
    paper: {
        //backgroundColor: '#2F2F2F',
    },
    toolbar: {
        //paddingRight: theme.spacing.unit,
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
    table: {
    },
    row: {
    },
});


class Lifts extends Component {
    handleSelectType = typeID => {
        this.props.history.push(Locations.Lifts.toUrl({
            ...this.props,
            typeID
        }));
    }

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

    handleRequestSort = (event, fieldName) => {
        const order = this.state.orderBy === fieldName && this.state.order === 'asc'
            ? 'desc'
            : 'asc';
        this.setState({
            order,
            orderBy: fieldName
        });
    };

    handleToggleFilter = () => {
        this.setState({
            showFilter: !this.state.showFilter,
        });
    }

    render() {
        const { classes, page, rowsPerPage, order, orderBy, showFilter, name, typeID, resortID, isActive } = this.props;
        return <Query
            query={query}
            variables={{
                offset: page * rowsPerPage,
                limit: rowsPerPage,
                orderBy,
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

                //filter controls are persistently displayed for smUp, and toggled down for xs
                const filterControls = [
                    <SelectMenu
                        id='type'
                        key='type'
                        options={[
                            { text: 'All types' },
                            ...LiftTypeData.map(type => ({ text: type.description, value: type.id, }))
                        ]}
                        value={typeID}
                        onSelect={this.handleSelectType}
                    />,
                    <ResortData key='resort'>
                        {({ options }) => {
                            return options && <SelectMenu
                                id='resort'
                                options={[
                                    { text: 'All resorts' },
                                    { text: 'No resort assigned', value: null },
                                    ...options,
                                ]}
                                value={resortID}
                                onSelect={this.handleSelectResort}
                            />
                        }}
                    </ResortData>,
                    <SelectMenu
                        id='status'
                        key='status'
                        options={[
                            { text: 'All statuses' },
                            { text: 'Active', value: true },
                            { text: 'Inactive', value: false },
                        ]}
                        value={isActive}
                        onSelect={this.handleSelectStatus}
                    />,
                ];

                const { liftList } = data;
                return (
                    <Paper className={classes.paper}>
                        <Toolbar className={classes.toolbar}>
                            <div className={classes.title}>
                                <Typography variant="headline">
                                    Lifts
                                </Typography>
                            </div>
                            <div className={classes.spacer} />
                            <div className={classes.actions}>
                                <Search
                                    value={name}
                                    onChange={this.handleSearchName}
                                    placeholder='Name'
                                />
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
                        {liftList.count && (
                            <div>
                                <Table className={classes.table}>
                                    <SortEnabledTableHead
                                        order={order}
                                        orderBy={orderBy}
                                        onRequestSort={this.handleRequestSort}
                                        columns={columnData}
                                    />
                                    <TableBody>
                                        {liftList.lifts
                                            .slice()
                                            .map(lift => (
                                                <TableRow key={lift.id} className={classes.row}>
                                                    <TableCell component="th" scope="row"><LinkButton to={Locations.Lift.toUrl({ id: lift.id })}>{lift.name}</LinkButton></TableCell>
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

export default withStyles(styles)(Lifts);