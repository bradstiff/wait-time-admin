import React from 'react';
import { withRouter } from 'react-router';
import { Query, graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import ResortForm from './ResortForm';

const resortQuery = gql`
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

const EditResort = ({ match, submit, close }) => {
    const id = parseInt(match.params.id);
    return <Query query={resortQuery} variables={{ id }}>
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
                return <p>Resort not found</p>;
            }
            const resortValues = {
                latitude: resort.location.lat,
                longitude: resort.location.lng,
                ...resort,
            };
            return <ResortForm resort={resortValues} submit={submit} close={close} />
        }}
    </Query>
};

export default compose(
    withRouter,
    graphql(resortMutation, {
        name: 'updateResort',
        props: ({ updateResort, ownProps: { history, match } }) => {
            const id = parseInt(match.params.id);
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