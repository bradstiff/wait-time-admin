import React from 'react';
import { NavItem } from 'react-bootstrap';
import gql from 'graphql-tag';
import { Query } from "react-apollo";

const resortsQuery = gql`
    query Resorts {
        resorts { id, name, slug }
    }
`;

export default () => (
    <Query query={resortsQuery}>
        {({ loading, error, data }) => {
            if (loading) {
                return null;
            } else if (error) {
                console.log(error);
                return null;
            }
            return data.resorts.map(({ id, name, slug }) => (
                <NavItem href={`/resorts/${slug}`} eventKey={id} key={id}>
                    {name}
                </NavItem>
            ));
        }}
    </Query>
);
