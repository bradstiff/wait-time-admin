/**************************************************************************************************
 * An HOC that requests a query, selects a value from the resulting data, and passes it as a prop.
 * It expects the query variables to be in props. Currently no support for aliasing.
 * If the query runs and the selected value is null, renders the indicated NotFound component.
 * 
 * Eliminates a ton of boilerplate.
 * ***********************************************************************************************/

import React from 'react';
import { Query } from 'react-apollo';

export default (query, selector, notFound) => component => props => (
    <Query query={query} variables={props}>
        {({ data, loading, error }) => {
            if (error) {
                return null; //todo
            }
            const root = data[selector];
            if (root === undefined) {
                return null; //todo
            }
            if (!loading && root === null) {
                return React.createElement(notFound);
            }

            return React.createElement(component, {
                ...props,
                [selector]: root,
                loading,
            });
        }}
    </Query>
);

