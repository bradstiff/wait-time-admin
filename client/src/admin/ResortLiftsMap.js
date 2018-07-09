import React from 'react';
import PropTypes from 'prop-types';
import { Query, graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Map, TileLayer, Polyline } from 'react-leaflet'

import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const liftsQuery = gql`
    query IntersectingLifts($topLeft: LocationInput!, $bottomRight: LocationInput!) {
        intersectingLifts(topLeft: $topLeft, bottomRight: $bottomRight) { 
            id,
            name,
            resort { id },
            stations { location { lat, lng } },
        }
    }
`;

const FullMap = styled(Map) `
    height: 1000px;
    width: 1500px;
`;

class ResortLiftsMap extends React.Component {
    state = {};

    assignMapRef = node => {
        this.map = node;
    };

    handleMapBoundsChange = leaflet => {
        const boundingBox = leaflet.getBounds();
        this.setState({
            topLeft: boundingBox.getNorthWest(),
            bottomRight: boundingBox.getSouthEast(),
        });
    };

    render() {
        const { topLeft, bottomRight } = this.state;
        const { assignedLiftIDs, onAssignLift, onUnassignLift, resortLocation, initialBounds } = this.props;
        const mapProps = initialBounds
            ? { bounds: initialBounds }
            : {
                center: resortLocation,
                zoom: 13,
            };
        return (
            <Map
                {...mapProps}
                ref={this.assignMapRef}
                whenReady={event => this.handleMapBoundsChange(event.target)}
                //onViewportChanged={() => this.handleMapBoundsChange(this.map.leafletElement)}
                style={{ width: '100%', height: '100%' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {topLeft && <Query
                    query={liftsQuery}
                    variables={{ topLeft, bottomRight }}
                >
                    {({ loading, error, data }) => {
                        if (error) {
                            console.log(error);
                            return null;
                        }
                        if (data.intersectingLifts === undefined) {
                            return null;
                        }

                        const enableEdit = onUnassignLift && onAssignLift;
                        const intersectingLifts = data.intersectingLifts.map(lift => {
                            const assigned = assignedLiftIDs.includes(lift.id);
                            return {
                                id: lift.id,
                                route: lift.stations.map(station => station.location),
                                clickHandler: enableEdit
                                    ? assigned
                                        ? onUnassignLift
                                        : onAssignLift
                                    : undefined,
                                color: assigned
                                    ? 'blue'
                                    : enableEdit
                                        ? 'grey'
                                        : undefined,
                            };
                        });
                        return intersectingLifts.map(lift => <Polyline
                            positions={lift.route}
                            key={lift.id}
                            onClick={lift.clickHandler ? () => lift.clickHandler(lift.id) : undefined}
                            color={lift.color}
                        />);
                    }}
                </Query>}
            </Map>
        );
    }
}

ResortLiftsMap.propTypes = {
    assignedLiftIDs: PropTypes
        .arrayOf(PropTypes.number)
        .isRequired,
    resortLocation: PropTypes
        .shape({
            lat: PropTypes.number.isRequired,
            lng: PropTypes.number.isRequired,
        })
        .isRequired,
    initialBounds: PropTypes
        .arrayOf(PropTypes.shape({
            lat: PropTypes.number.isRequired,
            lng: PropTypes.number.isRequired,
        })),
    onAssignLift: PropTypes.func,
    onUnassignLift: PropTypes.func,
}

export default ResortLiftsMap;