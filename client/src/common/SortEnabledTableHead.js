import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Tooltip from '@material-ui/core/Tooltip';

class SortEnabledTableHead extends Component {
    createSortHandler = column => event => {
        this.props.onRequestSort(event, column);
    };

    render() {
        const { columns, order, orderByCol } = this.props;

        return (
            <TableHead>
                <TableRow>
                    {columns.map(column => {
                        return (
                            <TableCell
                                key={column.field}
                                numeric={column.numeric}
                                padding={column.disablePadding ? 'none' : 'default'}
                                sortDirection={orderByCol === column ? order : false}
                            >
                                <Tooltip
                                    title="Sort"
                                    placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                                    enterDelay={300}
                                >
                                    <TableSortLabel
                                        active={orderByCol === column}
                                        direction={order}
                                        onClick={this.createSortHandler(column)}
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                </Tooltip>
                            </TableCell>
                        );
                    }, this)}
                </TableRow>
            </TableHead>
        );
    }
}

SortEnabledTableHead.propTypes = {
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.string.isRequired,
    orderByCol: PropTypes.object.isRequired,
    columns: PropTypes.array.isRequired,
};

export default SortEnabledTableHead;

const valueCompare = (val1, val2, numeric) => {
    const isUncomparable = val => numeric
        ? isNaN(val)
        : val === undefined || val === null;

    if (isUncomparable(val1) && isUncomparable(val2)) {
        return 0;
    } else if (isUncomparable(val1)) {
        return -1;
    } else if (isUncomparable(val2)) {
        return 1;
    } else {
        return numeric
            ? val1 - val2
            : val1.localeCompare(val2);
    }
}

const objectCompare = (obj1, obj2, valueCol, keyField) => {
    const compare = valueCompare(obj1[valueCol.field], obj2[valueCol.field], valueCol.numeric);
    if (compare === 0) {
        //for sort stability, if the values are equal, use the key as a tie-breaker
        return valueCompare(obj1[keyField].toString(), obj2[keyField].toString(), false);
    }
    return compare;
}

export const makeCompareFn = (order, orderByCol, keyField) => (a, b) => {
    return order === 'asc'
        ? objectCompare(a, b, orderByCol, keyField)
        : objectCompare(b, a, orderByCol, keyField);
};