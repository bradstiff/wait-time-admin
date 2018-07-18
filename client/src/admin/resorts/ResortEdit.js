import React from 'react';
import { withRouter } from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import ResortForm from './ResortForm';
import ResortNotFound from '../../app/ResortNotFound';
import withQuery from '../../common/withQuery';

const query = gql`
    query Resort($id: Int!) {
        resort(id: $id) { 
            id,
            name,
            slug,
            logoFilename,
            trailMapFilename,
            timezone,
            location { lat, lng} ,
        }
    }
`;

const resortMutation = gql`
    mutation updateResort($id: Int!, $name: String!, $slug: String!, $logoFilename: String!, $trailMapFilename: String!, $latitude: Float!, $longitude: Float!, $timezone: String!) {
        updateResort(id: $id, name: $name, slug: $slug, logoFilename: $logoFilename, trailMapFilename: $trailMapFilename, latitude: $latitude, longitude: $longitude, timezone: $timezone) {
            id,
            name,
            slug,
            logoFilename,
            trailMapFilename,
            timezone,
            location { lat, lng} ,
        }
    }
`;

const EditResort = ({ id, resort, submit, close, match }) => {
    const resortValues = {
        latitude: resort.location.lat,
        longitude: resort.location.lng,
        ...resort,
    };
    return <ResortForm resort={resortValues} title='Edit resort' submit={submit} close={close} />
};

export default compose(
    withRouter,
    withQuery(query, 'resort', ResortNotFound),
    graphql(resortMutation, {
        name: 'updateResort',
        props: ({ updateResort, ownProps: { history, id } }) => {
            const nextLocation = `/admin/resorts/${id}`;
            return {
                submit: (values, actions) =>
                    updateResort({ variables: values })
                        .then(() => history.push(nextLocation)),
                close: () => history.push(nextLocation)
            };
        }
    })
)(EditResort);