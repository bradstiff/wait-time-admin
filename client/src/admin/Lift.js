import React, { Component } from 'react';
import { Query, graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { Map, TileLayer, Polyline } from 'react-leaflet'
import ChartistGraph from 'react-chartist';
import moment from 'moment';

import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const query = gql`
    query LiftAndStatsByHourAndSeason($liftID: Int!) {
        lift(id: $liftID) { 
            id,
            name,
            route { lat, lon },
            upliftGroupings(groupBy: "hour", groupBy2: "season") {
                groupKey,
                groupDescription,
                group2Key,
                group2Description,
                upliftCount,
                waitTimeAverage
            }
        }
    }
`;

class Lift extends Component {
    render() {
        const { classes, match } = this.props;
        const id = parseInt(match.params.id);
        const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16];
        const seasonYears = [2016, 2017];
        return <Query
            query={query}
            variables={{
                liftID: id,
                groupBy: 'hour',
                groupBy2: 'season',
            }}
        >
            {({ loading, error, data }) => {
                if (error) {
                    console.log(error);
                    return null;
                }
                if (data.lift === undefined) {
                    return null;
                }
                if (data.lift === null) {
                    return <p>Lift not found</p>;
                }

                const { lift, lift: { upliftGroupings } } = data;

                const chartData = dataPoint => ({
                    labels: hours.map(hour => moment().hour(hour).format('hA')),
                    series: seasonYears.map(seasonYear => (
                        hours.map(hour => {
                            const grouping = upliftGroupings.find(g => g.groupKey === hour && g.group2Key === seasonYear);
                            return grouping
                                ? grouping[dataPoint]
                                : null;
                        })
                    )),
                });
                var options = {
                    low: 0,
                    showArea: true
                };
                const someData = chartData('upliftCount');
                return (
                    <Paper>
                        <Typography variant="display3" gutterBottom>
                            {lift.name}
                        </Typography>
                        <Map bounds={lift.route}>
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            <Polyline positions={lift.route} />
                        </Map>
                        {upliftGroupings && (
                            <div>
                                <ChartistGraph data={chartData('upliftCount')} options={options} type={'Line'} />
                                <ChartistGraph data={chartData('waitTimeAverage')} options={options} type={'Line'} />
                            </div>
                        )}
                    </Paper>
                );
            }}
        </Query>;
    }
}

export default Lift;