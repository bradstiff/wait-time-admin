import React from 'react';
import { withRouter } from 'react-router-dom';
import { Query, graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Polyline } from 'react-leaflet'

import { withStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import ResortLiftsMap from './ResortLiftsMap';
import ResortNotFound from '../../app/ResortNotFound';
import withQuery from '../../common/withQuery';
import Locations from '../../app/Locations';

export const query = gql`
    query ResortAndLifts($id: Int!) {
        resort(id: $id) { 
            id,
            name,
            location { lat, lng },
            liftEnvelope { lat, lng},
            lifts { id },
        }
    }
`;

const intersectingLiftsQuery = gql`
    query IntersectingLifts($topLeft: LocationInput!, $bottomRight: LocationInput!) {
        intersectingLifts(topLeft: $topLeft, bottomRight: $bottomRight) { 
            id,
            name,
            resort { id },
            stations { location { lat, lng } },
        }
    }
`;

const updateAssignedLiftsMutation = gql`
    mutation UpdateResortAssignedLifts($id: Int!, $liftIDs: [Int!]) {
        updateResortAssignedLifts(id: $id, liftIDs: $liftIDs) { 
            id,
            name,
            location { lat, lng },
            liftEnvelope { lat, lng},
            lifts { id },
        }
    }
`;

const styles = theme => ({
    map: {
        height: 'calc(100vh - 160px)',
    },
});

class ResortLifts extends React.Component {
    state = {};

    handleAssignLift = id => {
        this.setState({
            assignedLiftIDs: [
                id,
                ...this.state.assignedLiftIDs
            ]
        });
    }

    handleUnassignLift = id => {
        const assignedLiftIDs = this.state.assignedLiftIDs.slice();
        const index = assignedLiftIDs.indexOf(id);
        if (index > -1) {
            assignedLiftIDs.splice(index, 1);
            this.setState({
                assignedLiftIDs
            });
        }
    }

    handleMapBoundsChange = boundingBox => {
        this.setState({
            topLeft: boundingBox.getNorthWest(),
            bottomRight: boundingBox.getSouthEast(),
        });
    };

    handleSave = () => {
        this.props.saveAssignedLifts(this.props.id, this.state.assignedLiftIDs);
        this.navigateBack();
    }

    handleCancel = () => this.navigateBack();

    navigateBack() {
        const { id, history } = this.props;
        history.push(Locations.Resort.toUrl({ id }));
    }

    render() {
        const { id, resort, classes } = this.props;
        const { assignedLiftIDs, topLeft, bottomRight } = this.state;
        return (
            <Paper>
                <Toolbar>
                    <Typography variant='headline' style={{ flex: 'auto' }}>{`Assign ${resort.name} lifts`}</Typography>
                    <Button color='primary' onClick={this.handleCancel}>Cancel</Button>
                    <Button color='primary' variant='outlined' onClick={this.handleSave}>Save</Button>
                </Toolbar>
                <div className={classes.map}>
                    <ResortLiftsMap
                        resortLocation={resort.location}
                        bounds={resort.liftEnvelope}
                        onBoundsChange={this.handleMapBoundsChange}
                    >
                        {topLeft && <Query
                            query={intersectingLiftsQuery}
                            variables={{ topLeft, bottomRight }}
                        >
                            {({ error, data }) => {
                                if (error) {
                                    console.log(error);
                                    return null;
                                }
                                if (data.intersectingLifts === undefined) {
                                    return null;
                                }

                                return data.intersectingLifts.map(lift => {
                                    const assigned = assignedLiftIDs.includes(lift.id);
                                    return <Polyline
                                        positions={lift.stations.map(station => station.location)}
                                        key={lift.id}
                                        id={lift.id}
                                        onClick={() => assigned ? this.handleUnassignLift(lift.id) : this.handleAssignLift(lift.id)}
                                        color={assigned ? 'blue' : 'grey'}
                                    />;
                                });
                            }}
                        </Query>}
                    </ResortLiftsMap>
                </div>
            </Paper>
        );
    }

    static getDerivedStateFromProps(props, state) {
        const { assignedLiftIDs } = state || {};
        const { resort } = props;
        if (resort && assignedLiftIDs === undefined) {
            return {
                assignedLiftIDs: resort.lifts.map(lift => lift.id),
            }
        } else {
            return null;
        }
    }
}

export default compose(
    withStyles(styles),
    withRouter,
    withQuery(query, 'resort', ResortNotFound),
    graphql(updateAssignedLiftsMutation, {
        name: 'updateAssignedLifts',
        props: ({ updateAssignedLifts }) => ({
            saveAssignedLifts: (id, liftIDs) => 
                updateAssignedLifts({
                    variables: {
                        id,
                        liftIDs,
                    }
                }),
        })
    }),
)(ResortLifts);