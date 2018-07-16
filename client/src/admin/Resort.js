import React, { Component } from 'react';
import { Query, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
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

import ResortLiftsMap from './ResortLiftsMap';
import UpliftStatChart from './UpliftStatChart';
import UserErrorMessage from '../common/UserErrorMessage';

const query = gql`
    query ResortAndStatsByHourAndSeason($resortID: Int!) {
        resort(id: $resortID) { 
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

class Resort extends Component {
    render() {
        const { classes, id } = this.props;
        return <Query
            query={query}
            variables={{
                resortID: id,
                groupBy: 'hour',
                groupBy2: 'season',
            }}
        >
            {({ error, data }) => {
                if (error) {
                    console.log(error);
                    return null;
                }
                const { resort } = data;
                if (resort === undefined) {
                    return null;
                }
                if (resort === null) {
                    return <UserErrorMessage message={{ text: 'The resort in the address bar does not exist.', severity: 1 }} />;
                }

                const { upliftGroupings } = resort;
                const resortNameProps = isWidthUp('md', this.props.width)
                    ? {
                        color: 'textSecondary',
                    } : {
                        variant: 'headline',
                    };

                return (
                    <div>
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
                                            <Button component={Link} to={`/admin/resorts/${resort.id}/edit`}>Edit</Button>
                                            <Button component={Link} to={`/admin/resorts/${resort.id}/lifts`}>Assign Lifts</Button>
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
                                            <Button component={Link} to={`/admin/resorts/${resort.id}/stats`}>More</Button>
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
                                            <Button component={Link} to={`/admin/resorts/${resort.id}/stats`}>More</Button>
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

export default compose(
    withStyles(styles),
    withWidth(),
)(Resort);
