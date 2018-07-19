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

const query = gql`
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

class LiftStats extends React.Component {
    handleSelectGroupBy = groupBy => {
        const { history, id } = this.props;
        history.push(Locations.LiftStats.toUrl({ id, groupBy }));
    }

    render() {
        const { id, lift, classes, groupBy } = this.props;
        const { upliftGroupings } = lift;
        return (
            <Paper>
                <Toolbar className={classes.toolbar}>
                    <div className={classes.title}>
                        <Typography variant="headline" gutterBottom>
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
                    <div>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{groupBy}</TableCell>
                                    <TableCell>Uplifts</TableCell>
                                    <TableCell>Avg Wait (s)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {upliftGroupings.map(grouping => (
                                    <TableRow key={grouping.groupKey}>
                                        <TableCell component="th" scope="row">{grouping.groupDescription}</TableCell>
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
    };
}

export default compose(
    withStyles(styles),
    withQuery(query, 'lift', LiftNotFound),
)(LiftStats);