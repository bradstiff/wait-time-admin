import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { Polyline } from 'react-leaflet'

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

const query = gql`
    query ResortAndStatsByHourAndSeason($resortID: Int!) {
        resort(id: $resortID) { 
            id,
            name,
            logoFilename,
            location { lat, lng },
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
            flexDirection: 'row',
        },
    },
    resortContent: {
        display: 'flex',
        [theme.breakpoints.down('sm')]: {
            flexDirection: 'row',
            alignItems: 'flex-end',
        },
        [theme.breakpoints.up('md')]: {
            flexDirection: 'column',
            alignItems: 'flex-start',
        },
        paddingTop: theme.spacing.unit * 2,
        paddingRight: theme.spacing.unit * 3,
        paddingBottom: theme.spacing.unit,
        paddingLeft: theme.spacing.unit * 3,
    },
    resortLogo: {
        flex: 'none',
    },
    resortLogoImage: {
        [theme.breakpoints.down('sm')]: {
            maxHeight: 40,
            width: 'auto',
        },
        [theme.breakpoints.up('md')]: {
            height: 'auto',
            maxWidth: 175,
        },
        opacity: 1,
    },
    resortInfo: {
        flex: 'auto',
        [theme.breakpoints.down('sm')]: {
            paddingLeft: theme.spacing.unit * 3,
        },
    },
    resortMap: {
        flex: 'auto',
        height: 400,
    },
    resortActions: {
        flex: 'none',
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
                    return <p>Resort not found</p>; //todo
                }

                const { upliftGroupings } = resort;

                return (
                    <div>
                        <Grid container spacing={16}>
                            <Grid item xs={12}>
                                <Card className={classes.resortCard}>
                                    <div className={classes.resortContent}>
                                        <div className={classes.resortLogo}>
                                            <img alt={resort.name} src={`${process.env.PUBLIC_URL}/logos/${resort.logoFilename}`} className={classes.resortLogoImage} />
                                        </div>
                                        <div className={classes.resortInfo}>
                                            <Typography color='textSecondary'>{resort.name}</Typography>
                                            <Typography color='textSecondary'>{`${resort.lifts.length} lifts`}</Typography>
                                        </div>
                                        <div className={classes.resortActions}>
                                            <Button component={Link} to={`/admin/resorts/${resort.id}/edit`}>Edit</Button>
                                            <Button component={Link} to={`/admin/resorts/${resort.id}/lifts`}>Assign Lifts</Button>
                                        </div>
                                    </div>
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
                                </Card>
                            </Grid>
                            {upliftGroupings.length && [
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

export default withStyles(styles)(Resort);
