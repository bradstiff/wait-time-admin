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
import ProgressContext from '../app/ProgressContext';

const withQuery = (query, options, notFound) => component => {
    class WrappedComponent extends React.Component {
        state = {
            loading: false,
        };

        render() {
            const { data, loading, error } = this.props;
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
                ...this.props,
                [options.selector]: root,
            });
        }

        static getDerivedStateFromProps = (props, state) => {
            if (props.loading && !state.loading) {
                props.onStartLoading();
                return { loading: true };
            } else if (!props.loading && state.loading) {
                props.onEndLoading();
                return { loading: false };
            }
            return null;
        }
    }

    return props => {
        if (typeof options === 'string') {
            options = { selector: options };
        }
        const variables = typeof options.variables === 'function'
            ? options.variables(props)
            : options.variables || props;
        return <Query query={query} variables={variables}>
            {({ data, loading, error }) => (
                <ProgressContext.Consumer>
                    {({ startProgress, endProgress }) => (
                        <WrappedComponent
                            {...props}
                            data={data}
                            loading={loading}
                            error={error}
                            onStartLoading={startProgress}
                            onEndLoading={endProgress}
                        />
                    )}
                </ProgressContext.Consumer>
            )}
        </Query>;
    };
}

export default withQuery;