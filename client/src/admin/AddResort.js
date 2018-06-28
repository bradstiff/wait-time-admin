import React from 'react';
import { withRouter } from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import ResortForm from './ResortForm';
import { resortsQuery } from './Resorts';

const resortMutation = gql`
    mutation createResort($name: String!, $slug: String!, $logoFilename: String!, $trailMapFilename: String!, $latitude: Float!, $longitude: Float!, $timezone: String!) {
        createResort(name: $name, slug: $slug, logoFilename: $logoFilename, trailMapFilename: $trailMapFilename, latitude: $latitude, longitude: $longitude, timezone: $timezone) {
            id,
            name,
            slug,
            logoFilename,
            trailMapFilename,
            timezone,
            latitude,
            longitude
        }
    }
`;

const AddResort = ({ submit, close }) => (
    <ResortForm submit={submit} close={close} />
);

export default compose(
    withRouter,
    graphql(resortMutation, {
        name: 'createResort',
        props: ({ createResort, ownProps: { history } }) => ({
            submit: (values, actions) =>
                createResort({
                    variables: values,
                    update: (cache, { data: { createResort } }) => {
                        const { resorts } = cache.readQuery({ query: resortsQuery });
                        cache.writeQuery({
                            query: resortsQuery,
                            data: { resorts: resorts.concat([createResort]) }
                        });
                    }
                }).then(() => history.push('/admin/resorts')),
            close: () => history.push('/admin/resorts')
        })
    })
)(AddResort);