import React from 'react';
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
import TableHead from '@material-ui/core/TableHead';

import SelectMenu from '../../common/SelectMenu';
import LiftNotFound from '../../app/LiftNotFound';
import Locations from '../../app/Locations';
import withQuery from '../../common/withQuery';

export const UPLIFT_STATS_BY_LIFT_QUERY = gql`
    query UpliftStatsByLift($id: Int!, $groupBy: UpliftGroupBy!) {
        lift(id: $id) { 
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

class LiftStats extends React.Component {
    handleSelectGroupBy = groupBy => {
        const { history, id } = this.props;
        history.replace(Locations.LiftStats.toUrl({ id, groupBy }));
    }

    render() {
        const { id, lift, classes, groupBy } = this.props;
        const { upliftGroupings } = lift;
        return (
            <Paper>
                <Toolbar>
                    <div className={classes.title}>
                        <Typography variant="subheading">
                            {lift.name} Stats
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
                            ]}
                            onSelect={this.handleSelectGroupBy}
                            value={groupBy}
                        />
                    </div>
                </Toolbar>
                {upliftGroupings && (
                    <div className={classes.tableContainer}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell padding='dense'>{groupBy}</TableCell>
                                    <TableCell numeric padding='dense'>Uplifts</TableCell>
                                    <TableCell numeric padding='dense'>Avg Wait (s)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {upliftGroupings.map(grouping => (
                                    <TableRow key={grouping.groupKey}>
                                        <TableCell component="th" scope="row" padding='dense'>{grouping.groupDescription}</TableCell>
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
    };
}

const mapPropsToVariables = props => ({
    id: props.id,
    groupBy: props.groupBy
});

export default compose(
    withStyles(styles),
    withQuery(UPLIFT_STATS_BY_LIFT_QUERY, {
        selector: 'lift',
        variables: mapPropsToVariables
    }, LiftNotFound),
)(LiftStats);