import React, { Component } from 'react';
import { compose } from 'react-apollo';
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
import NotFound from '../../app/NotFound';
import withQuery from '../../common/withQuery';

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
    replaceLocation = qsParams => {
        const nextLocation = Locations.Lifts.toUrl({
            ...this.props,
            ...qsParams
        });
        this.props.history.replace(nextLocation);
    }

    handleSearchName = event => {
        const name = event.target.value || undefined;
        this.replaceLocation({ name });
    }

    handleSelectType = typeID => this.replaceLocation({ typeID });
    handleSelectResort = resortID => this.replaceLocation({ resortID });
    handleSelectStatus = isActive => this.replaceLocation({ isActive });
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
        const { classes, liftList, page, rowsPerPage, order, orderBy, showFilter, name, typeID, resortID, isActive } = this.props;
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
    }
}

export default compose(
    withQuery(query, {
        selector: 'liftList',
        variables: props => ({
            ...props,
            offset: props.page * props.rowsPerPage,
            limit: props.rowsPerPage,
        }),
    }, NotFound),
    withStyles(styles)
)(Lifts);