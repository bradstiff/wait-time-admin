import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { Map, TileLayer, Polyline } from 'react-leaflet'

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import UpliftStatChart from './UpliftStatChart';
import UserErrorMessage from '../common/UserErrorMessage';

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
            upliftGroupings(groupBy: Hour, groupBy2: Season) {
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
    liftCard: {
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
        [theme.breakpoints.up('md')]: {
            flexDirection: 'row-reverse',
        },
    },
    liftContent: {
        display: 'flex',
        flexDirection: 'column',
    },
    liftHeading: {
        flex: 'auto',
    },
    liftActions: {
        flex: 'none',
    },
    liftMap: {
        flex: 'auto',
        height: '50vh',
    },
});

class Lift extends Component {
    render() {
        const { classes, id } = this.props;
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
                    return <UserErrorMessage message={{ text: 'The lift in the address bar does not exist.', severity: 1 }} />;
                }

                const { upliftGroupings } = lift;
                const route = lift.stations.map(station => station.location);
                return (
                    <div>
                        <Grid container spacing={16}>
                            <Grid item xs={12}>
                                <Card className={classes.liftCard}>
                                    <CardMedia className={classes.liftMap}>
                                        <Map bounds={route} style={{ width: '100%', height: '100%' }}>
                                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                            <Polyline positions={route} />
                                        </Map>
                                    </CardMedia>
                                    <div className={classes.liftContent}>
                                        <CardContent className={classes.liftHeading}>
                                            <Typography variant="headline">{`${lift.name} ${!lift.isActive ? ' (Inactive)' : ''}`}</Typography>
                                            <Typography color='textSecondary'>{lift.type.description}</Typography>
                                            <Typography color='textSecondary'>{lift.occupancy ? lift.occupancy + ' passengers' : null}</Typography>
                                            <Typography color='textSecondary'>{upliftGroupings.length === 0 && 'No wait time data available'}</Typography>
                                            <Typography color='textSecondary'>{lift.resort ? lift.resort.name : 'No resort assigned'}</Typography>
                                        </CardContent>
                                        <CardActions className={classes.liftActions}>
                                            <Button component={Link} to={`/admin/lifts/${lift.id}/edit`}>Edit</Button>
                                        </CardActions>
                                    </div>
                                </Card>
                            </Grid>
                            {upliftGroupings.length > 0 && [
                                <Grid item xs={12} md={6} key='uplifts'>
                                    <Card>
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
                                <Grid item xs={12} md={6} key='stats'>
                                    <Card>
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