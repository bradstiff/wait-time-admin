//A component that passes a list of all resorts to a child function.  
//Children can access the resorts property or the options property.
import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

const resortsQuery = gql`
    query Resorts {
        resorts {
            id,
            name,
            slug,
            logoFilename
        }
    }
`;
const ResortData = ({ children }) => (
    <Query query={resortsQuery}>
        {({ data, error }) => {
            //todo: error handling
            //transform resorts into value/text pairs as an alternate form
            const resorts = data.resorts || [];
            const options = resorts.map(resort => ({
                value: resort.id,
                text: resort.name,
            }));
            return children({
                resorts: resorts,
                options,
            });
        }}
    </Query>
)

ResortData.propTypes = {
    children: PropTypes.func.isRequired,
};

export default ResortData;