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
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import UpliftStatChart from './UpliftStatChart';

const query = gql`
    query LiftAndStatsByHourAndSeason($liftID: Int!) {
        lift(id: $liftID) { 
            id,
            name,
            isActive,
            type { id, description },
            resort { id, name },
            occupancy,
            stations {number, name, location { lat, lng} },
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

const styles = theme => ({
    lift: {
        display: 'flex',
    },
    liftContent: {
        display: 'flex',
        flexDirection: 'column',
    },
    liftHeading: {
        flex: 'auto',
    },
    liftMap: {
        flex: 'auto',
        height: 400,
    },
    liftActions: {
        flex: 'none',
        paddingLeft: theme.spacing.unit,
        paddingBottom: theme.spacing.unit,
    },
});

class Lift extends Component {
    render() {
        const { classes, match } = this.props;
        const id = parseInt(match.params.id);
        return <Query
            query={query}
            variables={{
                liftID: id,
                groupBy: 'hour',
                groupBy2: 'season',
            }}
        >
            {({ error, data }) => {
                if (error) {
                    console.log(error);
                    return null;
                }
                const { lift } = data;
                if (lift === undefined) {
                    return null;
                }
                if (lift === null) {
                    return <p>Lift not found</p>;//todo
                }

                const { upliftGroupings } = lift;
                const route = lift.stations.map(station => station.location);
                return (
                    <div>
                        <Grid container spacing={16}>
                            <Grid item xs={12}>
                                <Card className={classes.lift}>
                                    <div className={classes.liftContent}>
                                        <CardContent className={classes.liftHeading}>
                                            <Typography variant="headline">{`${lift.name} ${!lift.isActive ? ' (Inactive)' : ''}`}</Typography>
                                            <Typography color='textSecondary'>{lift.type.description}</Typography>
                                            <Typography color='textSecondary'>{lift.occupancy ? lift.occupancy + ' passengers' : null}</Typography>
                                            <Typography color='textSecondary'>{lift.resort ? lift.resort.name : 'No resort assigned'}</Typography>
                                        </CardContent>
                                        <div className={classes.liftActions}>
                                            <Button component={Link} to={`/admin/lifts/${lift.id}/edit`}>Edit</Button>
                                        </div>
                                    </div>
                                    <CardMedia className={classes.liftMap}>
                                        <Map bounds={route} style={{ width: '100%', height: '100%' }}>
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                            <Polyline positions={route} />
                                        </Map>
                                    </CardMedia>
                                </Card>
                            </Grid>
                            {upliftGroupings.length && [
                                <Grid item xs={6}>
                                    <Card key='uplifts'>
                                        <CardContent>
                                            <Typography variant='headline'>Uplifts</Typography>
                                            <Typography color='textSecondary'>Current season versus previous</Typography>
                                        </CardContent>
                                        <CardMedia>
                                            <UpliftStatChart upliftGroupings={upliftGroupings} dataPoint='upliftCount' />
                                        </CardMedia>
                                        <CardActions>
                                            <Button component={Link} to={`/admin/lifts/${lift.id}/uplifts`}>Uplifts</Button>
                                        </CardActions>
                                    </Card>
                                </Grid>,
                                <Grid item xs={6}>
                                    <Card key='stats'>
                                        <CardContent>
                                            <Typography variant='headline'>Average Wait Time (seconds)</Typography>
                                            <Typography color='textSecondary'>Current season versus previous</Typography>
                                        </CardContent>
                                        <CardMedia>
                                            <UpliftStatChart upliftGroupings={upliftGroupings} dataPoint='waitTimeAverage' />
                                        </CardMedia>
                                        <CardActions>
                                            <Button component={Link} to={`/admin/lifts/${lift.id}/stats`}>Stats</Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ]}
                        </Grid>
                    </div>
                );
            }}
        </Query>;
    }
}

export default withStyles(styles)(Lift);