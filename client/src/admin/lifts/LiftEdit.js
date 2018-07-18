import React from 'react';
import { withRouter } from 'react-router';
import { Query, graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import LiftForm from './LiftForm';
import Locations from '../../app/Locations';
import LiftNotFound from '../../app/LiftNotFound';
import withQuery from '../../common/withQuery';

const query = gql`
    query Lift($id: Int!) {
        lift(id: $id) { 
            id,
            name,
            type { id },
            resort { id },
            occupancy,
            isActive,
            stations {number, name, location { lat, lng} },
        }
    }
`;

const mutation = gql`
    mutation updateLift($id: Int!, $name: String!, $typeID: Int!, $resortID: Int, $occupancy: Int, $isActive: Boolean!, $station1Lat: Float!, $station1Lng: Float!, $station2Lat: Float!, $station2Lng: Float!, $station3Lat: Float, $station3Lng: Float, $station4Lat: Float, $station4Lng: Float, $station5Lat: Float, $station5Lng: Float ) {
        updateLift(id: $id, name: $name, typeID: $typeID, resortID: $resortID, occupancy: $occupancy, isActive: $isActive, station1Lat: $station1Lat, station1Lng: $station1Lng, station2Lat: $station2Lat, station2Lng: $station2Lng, station3Lat: $station3Lat, station3Lng: $station3Lng, station4Lat: $station4Lat, station4Lng: $station4Lng, station5Lat: $station5Lat, station5Lng: $station5Lng) {
            id,
            name,
            type { id },
            resort { id },
            occupancy,
            isActive,
            stations {number, name, location { lat, lng} },
        }
    }
`;

const LiftEdit = ({ id, lift, submit, close }) => {
    const stationCoordinates = lift.stations.reduce((acc, station) => {
        //flatten stations' locations into unique properties for editing, e.g., { station1Lat, station1Lng, station2Lat, station2Lng, } etc.
        acc[`station${station.number}Lat`] = station.location.lat;
        acc[`station${station.number}Lng`] = station.location.lng;
        return acc;
    }, {});
    const liftValues = {
        typeID: lift.type.id,
        resortID: lift.resort && lift.resort.id,
        ...stationCoordinates,
        ...lift,
    };
    return <LiftForm lift={liftValues} title='Edit lift' submit={submit} close={close} />
};

export default compose(
    withRouter,
    withQuery(query, 'lift', LiftNotFound),
    graphql(mutation, {
        name: 'updateLift',
        props: ({ updateLift, ownProps: { history, id } }) => {
            return {
                id,
                submit: (values, actions) => {
                    updateLift({ variables: values })
                        .then(() => history.push(Locations.Lift.toUrl({ id })));
                },
                close: () => history.push(Locations.Lift.toUrl({ id })),
            };
        }
    })
)(LiftEdit);