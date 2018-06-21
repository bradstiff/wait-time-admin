import React from 'react';
import { withRouter } from 'react-router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import ResortForm from './ResortForm';
import { resortsQuery } from './Resorts';

const resortMutation = gql`
    mutation createResort($name: String!, $slug: String!) {
        createResort(name: $name, slug: $slug) {
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