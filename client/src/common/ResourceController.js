import React from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import qs from 'querystringify';
import { withRouter } from 'react-router-dom';
import { Query } from 'react-apollo';

/**
 * Used as the component prop of a <Route>.
 * Validates and casts the route params (including the query string) to a params object.
 * Executes the indicated query using the params as variables (aliasing not currently supported, but could be added).
 * Returns the requested component with the params and query results injected as props.
 * If the route params are invalid, or if the query returns no results, returns <NotFound>.
 * Eliminates a ton of boilerplate.
 * Kinda like a client-side controller...
 */

const ResourceController = ({ component: T, routeParams, match, location, queryDef, notFound: NotFound }) => {
    const paramSchema = Yup.object().shape(routeParams);
    const paramValues = {
        ...match.params,
        ...qs.parse(location.search),
    };

    if (!paramSchema.isValidSync(paramValues)) {
        return <NotFound />;
    }
    const params = paramSchema.cast(paramValues);
    return <Query query={queryDef.query} variables={params}>
        {({ data, loading, error }) => {
            if (error) {
                return null;
            }
            const { [queryDef.root]: root } = data;
            if (root === undefined) {
                return null;
            }
            if (root === null) {
                return <NotFound />;
            }
            const props = {
                ...params,
                [queryDef.root]: root,
            };

            return <T {...props} />;
        }}
    </Query>;
}

export default withRouter(ResourceController);