import React from 'react';
import { compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Map, TileLayer, Polyline } from 'react-leaflet'

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import UpliftStatChart from '../UpliftStatChart';
import Locations from '../../app/Locations';
import LiftNotFound from '../../app/LiftNotFound';
import withQuery from '../../common/withQuery';

const query = gql`
    query LiftAndStatsByHourAndSeason($id: Int!) {
        lift(id: $id) { 
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

const Lift = ({ id, lift, classes }) => {
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
                                <Button component={Locations.LiftDetails.toLink({ id })}>Details</Button>
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
                                <Button component={Locations.LiftUplifts.toLink({ id })}>Uplifts</Button>
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
                                <Button component={Locations.LiftStats.toLink({ id })}>Stats</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ]}
            </Grid>
        </div>
    );
}

export default compose(
    withStyles(styles),
    withQuery(query, 'lift', LiftNotFound),
)(Lift);