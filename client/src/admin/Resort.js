import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';

import styled from 'styled-components';
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
import Typography from '@material-ui/core/Typography';

import SortEnabledTableHead, { makeCompareFn } from '../common/SortEnabledTableHead';

const resortQuery = gql`
    query Resort($id: Int!) {
        resort(id: $id) { 
            id,
            name,
            logoFilename,
            lifts {
                id,
                name,
                upliftSummaries {
                    upliftCount,
                    waitTimeAverage,
                    season {
                        year,
                        description
                    }
                }
            }
        }
    }
`;

const ResortLogo = styled.img`
    height: 60px;
    width: auto;
    max-width: 140px;
    padding: 10px;
    opacity: 0.75;
`;

const styles = theme => ({
    rowHeading: {
        fontSize: theme.typography.pxToRem(15),
    },
    value: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    rowHeadingColumn: {
        flexBasis: '50%'
    },
    valueColumn: {
        flexBasis: '25%',
    },
});

const columnData = [
    { field: 'lift', numeric: false, disablePadding: true, label: 'Lift' },
    { field: 'upliftCount', numeric: true, disablePadding: false, label: 'Uplifts' },
    { field: 'waitTimeAverage', numeric: true, disablePadding: false, label: 'Avg Wait (s)' },
];

class Resort extends Component {
    state = {
        selectedYear: null,
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

    handleRequestSort = (event, column) => {
        let order = 'desc';

        if (this.state.orderByCol === column && this.state.order === 'desc') {
            order = 'asc';
        }

        this.setState({ order, orderByCol: column});
    };

    render() {
        const { classes, data: { loading, error, resort } } = this.props;
        if (error) {
            console.log(error);
            return null;
        }
        if (loading) {
            return null;
        }

        const { selectedYear, upliftSummaries, order, orderByCol } = this.state;

        //flatten summaries
        const allUpliftSummaries = resort.lifts.reduce((acc, lift) => acc.concat(lift.upliftSummaries), []);
        //extract seasons, e.g., ['2014-2015', '2015-2016']
        const seasons = allUpliftSummaries.reduce((acc, summary) => {
            if (!acc.some(season => season.year === summary.season.year)) {
                acc.push({
                    year: summary.season.year,
                    description: summary.season.description
                });
            }
            return acc;
        }, []);
        //calculate stats by season
        seasons.forEach(season => {
            const seasonUpliftSummaries = allUpliftSummaries.filter(summary => summary.season.year === season.year);
            season.upliftCount = seasonUpliftSummaries.reduce((acc, summary) => acc + summary.upliftCount, 0);
            season.waitTimeAverage = Math.round(seasonUpliftSummaries.reduce((acc, summary) => acc + summary.waitTimeAverage * summary.upliftCount, 0) / season.upliftCount);
        });

        return (
            <Paper>
                <ResortLogo alt={resort.name} src={`${process.env.PUBLIC_URL}/logos/${resort.logoFilename}`} />
                <Typography variant="display3" gutterBottom>
                    {resort.name}
                </Typography>
                <div style={{ display: 'flex' }}>
                    <div className={classes.rowHeadingColumn}>
                        <Typography className={classes.rowHeading}>Season</Typography>
                    </div>
                    <div className={classes.valueColumn}>
                        <Typography className={classes.value}>Uplifts</Typography>
                    </div>
                    <div className={classes.valueColumn}>
                        <Typography className={classes.value}>Avg Wait (s)</Typography>
                    </div>
                </div>
                {seasons.map(season => (
                    <ExpansionPanel key={season.year} expanded={selectedYear === season.year} onChange={this.handleSelectSeason(season.year)}>
                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                            <div className={classes.rowHeadingColumn}>
                                <Typography className={classes.rowHeading}>{season.description}</Typography>
                            </div>
                            <div className={classes.valueColumn}>
                                <Typography className={classes.value}>{season.upliftCount}</Typography>
                            </div>
                            <div className={classes.valueColumn}>
                                <Typography className={classes.value}>{season.waitTimeAverage}</Typography>
                            </div>
                        </ExpansionPanelSummary>
                        {selectedYear === season.year && (
                            <ExpansionPanelDetails>
                                <Table>
                                    <SortEnabledTableHead
                                        order={order}
                                        orderByCol={orderByCol}
                                        onRequestSort={this.handleRequestSort}
                                        columns={columnData}
                                    />
                                    <TableBody>
                                        {upliftSummaries
                                            .sort(makeCompareFn(order, orderByCol, 'liftID'))
                                            .map(summary => (
                                                <TableRow key={summary.liftID}>
                                                    <TableCell component="th" scope="row">
                                                        <Link to={`/admin/lifts/${summary.liftID}/uplifts`}>{summary.lift}</Link>
                                                    </TableCell>
                                                    <TableCell numeric>{summary.upliftCount}</TableCell>
                                                    <TableCell numeric>{summary.waitTimeAverage}</TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            </ExpansionPanelDetails>
                        )}
                    </ExpansionPanel>
                ))}
            </Paper>
        );
    };
}

export default compose(
    withStyles(styles),
    graphql(resortQuery, {
        options: ({ match }) => ({ variables: { id: parseInt(match.params.id) } })
    })
)(Resort);