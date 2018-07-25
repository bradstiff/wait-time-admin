import React from 'react';
import { compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Polyline } from 'react-leaflet'

import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Locations from '../../app/Locations';
import UserContext from '../../app/UserContext';
import ResortNotFound from '../../app/ResortNotFound';
import withQuery from '../../common/withQuery';
import ResortLiftsMap from './ResortLiftsMap';
import UpliftStatChart from '../UpliftStatChart';

const query = gql`
    query ResortAndStatsByHourAndSeason($id: Int!) {
        resort(id: $id) { 
            id,
            name,
            logoFilename,
            location { lat, lng },
            hasWaitTimes,
            liftEnvelope { lat, lng },
            lifts { 
                id, 
                stations { location { lat, lng } },
            },
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
    resortCard: {
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
        },
        [theme.breakpoints.up('md')]: {
            flexDirection: 'row-reverse',
        },
    },
    resortContent: {
        display: 'flex',
        flexDirection: 'column',
    },
    resortHeading: {
        flex: 'auto',
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'row-reverse',
        },
        [theme.breakpoints.up('md')]: {
            flexDirection: 'column',
        },
    },
    resortTitle: {
        flex: 'auto',
    },
    resortLogo: {
        //flex: 'none',
        opacity: 1,
        [theme.breakpoints.down('sm')]: {
            maxHeight: 30,
            width: 'auto',
        },
        [theme.breakpoints.up('md')]: {
            maxWidth: 150,
            height: 'auto',
            paddingBottom: 5,
        },
    },
    resortActions: {
        flex: 'none',
    },
    resortMap: {
        flex: 'auto',
        height: '50vh',
    },
});

const Resort = ({ id, resort, classes, width }) => {
    const { upliftGroupings } = resort;
    const resortNameProps = isWidthUp('md', width)
        ? {
            color: 'textSecondary',
        } : {
            variant: 'headline',
        };

    return (
        <UserContext.Consumer>
            {({ isAdmin }) => (
                <Grid container spacing={16}>
                    <Grid item xs={12}>
                        <Card className={classes.resortCard}>
                            <CardMedia className={classes.resortMap}>
                                <ResortLiftsMap
                                    resortLocation={resort.location}
                                    bounds={resort.liftEnvelope}
                                >
                                    {resort.lifts.map(lift => <Polyline
                                        key={lift.id}
                                        positions={lift.stations.map(station => station.location)}
                                    />)}
                                </ResortLiftsMap>
                            </CardMedia>
                            <div className={classes.resortContent}>
                                <CardContent className={classes.resortHeading}>
                                    <div><img alt={resort.name} src={`${process.env.PUBLIC_URL}/logos/${resort.logoFilename}`} className={classes.resortLogo} /></div>
                                    <div className={classes.resortTitle}>
                                        <Typography {...resortNameProps}>{resort.name}</Typography>
                                        <Typography color='textSecondary'>{resort.lifts.length} lifts</Typography>
                                        <Typography color='textSecondary'>{!resort.hasWaitTimes && 'No wait time data available'}</Typography>
                                    </div>
                                </CardContent>
                                <CardActions className={classes.resortActions}>
                                    <Button component={Locations.ResortDetails.toLink({ id })}>Details</Button>
                                    {isAdmin && <Button component={Locations.ResortLifts.toLink({ id })}>Assign Lifts</Button>}
                                </CardActions>
                            </div>
                        </Card>
                    </Grid>
                    {resort.hasWaitTimes && [
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
                                    <Button component={Locations.ResortStats.toLink({ id })}>More</Button>
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
                                    <Button component={Locations.ResortStats.toLink({ id })}>More</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ]}
                </Grid>
            )}
        </UserContext.Consumer>
    );
};

export default compose(
    withStyles(styles),
    withWidth(),
    withQuery(query, 'resort', ResortNotFound),
)(Resort);
