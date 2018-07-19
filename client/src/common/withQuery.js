/**************************************************************************************************
 * An HOC that requests a query, selects a value from the resulting data, and passes it as a prop.
 * options.variables can be a function of props, a literal object, or undefined.
 * If variables is undefined, props will be passed as variables. Apollo ignores variable values that are not used by the query.
 * If the query runs and the selected value is null, renders the indicated NotFound component.
 * 
 * Eliminates a ton of boilerplate.
 * ***********************************************************************************************/

import React from 'react';
import { Query } from 'react-apollo';

export default (query, options, notFound) => component => props => {
    if (typeof options === 'string') {
        options = { selector: options };
    }
    const variables = typeof options.variables === 'function'
        ? options.variables(props)
        : options.variables || props;
    return <Query query={query} variables={variables}>
        {({ data, loading, error }) => {
            if (error) {
                return null; //todo
            }
            const root = data[options.selector];
            if (root === undefined) {
                return null; //todo
            }
            if (!loading && root === null) {
                return React.createElement(notFound);
            }

            return React.createElement(component, {
                ...props,
                [options.selector]: root,
                loading,
            });
        }}
    </Query>;
}
