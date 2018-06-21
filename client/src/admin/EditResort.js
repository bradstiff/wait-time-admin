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
            latitude,
            longitude
        }
    }
`;

const resortMutation = gql`
    mutation updateResort($id: Int!, $name: String!, $slug: String!) {
        updateResort(id: $id, name: $name, slug: $slug) {
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

const EditResort = ({ match, submit, close }) => {
    const id = parseInt(match.params.id);
    return <Query query={resortQuery} variables={{ id }}>
        {({ loading, error, data }) => {
            if (error) {
                console.log(error);
                return null;
            }
            if (loading) {
                return null;
            }
            return <ResortForm resort={data.resort} submit={submit} close={close} />
        }}
    </Query>
};

export default compose(
    withRouter,
    graphql(resortMutation, {
        name: 'updateResort',
        props: ({ updateResort, ownProps: { history }} ) => ({
            submit: (values, actions) =>
                updateResort({ variables: values })
                    .then(() => history.push('/admin/resorts')),
            close: () => history.push('/admin/resorts')
        })
    })
)(EditResort);