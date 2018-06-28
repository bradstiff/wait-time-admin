import React, { Component } from 'react';
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
            route { lat, lng },
        }
    }
`;

const FullMap = styled(Map) `
    height: 1000px;
    width: 1500px;
`;

class ResortLiftsMap extends Component {
    state = {};

    assignMapRef = node => {
        this.map = node;
    };

    handleMapBoundsChange = () => {
        const bounds = this.map.leafletElement.getBounds();
        this.setState({
            bounds: [
                bounds.getNorthWest(),
                bounds.getSouthEast(),
            ],
        });
    };

    render() {
        const { bounds } = this.state;
        const { assignedLiftIDs, onAssignLift, onUnassignLift, resortLocation } = this.props;
        return (
            <div>
                <Map
                    center={resortLocation}
                    zoom={13}
                    ref={this.assignMapRef}
                    onLoad={this.handleMapBoundsChange}
                    onViewportChanged={this.handleMapBoundsChange}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {bounds && <Query
                        query={liftsQuery}
                        variables={{
                            topLeft: bounds[0],
                            bottomRight: bounds[1]
                        }}
                    >
                        {({ loading, error, data }) => {
                            if (error) {
                                console.log(error);
                                return null;
                            }
                            if (data.intersectingLifts === undefined) {
                                return null;
                            }

                            const intersectingLifts = data.intersectingLifts.map(lift => ({
                                id: lift.id,
                                route: lift.route,
                            }));
                            return intersectingLifts.map(lift => assignedLiftIDs.includes(lift.id)
                                ? <Polyline positions={lift.route} key={lift.id} onClick={() => onUnassignLift(lift.id)} color='blue' />
                                : <Polyline positions={lift.route} key={lift.id} onClick={() => onAssignLift(lift.id)} color='grey' />
                            );
                        }}
                    </Query>}
                </Map>
            </div>
        );
    }
}

export default ResortLiftsMap;