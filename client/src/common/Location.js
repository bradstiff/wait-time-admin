import React from 'react';
import { Route, matchPath, generatePath } from 'react-router';
import { Link } from 'react-router-dom';
import warning from 'warning';
import * as Yup from 'yup';
import qs from 'querystringify';

const isEmptyObject = obj => Object.keys(obj).length === 0 && obj.constructor === Object;
const isEmptyChildren = children => React.Children.count(children) === 0;

class Location {
    constructor(path, pathTokenDefs, qsTokenDefs) {
        this._path = path;

        //todo: check for collisions
        if (pathTokenDefs && !isEmptyObject(pathTokenDefs)) {
            this._pathKeys = Object.keys(pathTokenDefs);
            this._pathSchema = Yup.object().shape(pathTokenDefs);
        }

        if (qsTokenDefs && !isEmptyObject(qsTokenDefs)) {
            this._qsKeys = Object.keys(qsTokenDefs);
            this._qsSchema = Yup.object().shape(qsTokenDefs);
        }
    }

    get path() {
        return this._path;
    }

    toRoute = (renderOption, exact = false, strict = false, sensitive = false) => {
        const { component, render, children } = renderOption;
        //same warnings as Route
        warning(
            !(component && render),
            "You should not use <Route component> and <Route render> in the same route; <Route render> will be ignored"
        );

        warning(
            !(
                component &&
                children &&
                !isEmptyChildren(children)
            ),
            "You should not use <Route component> and <Route children> in the same route; <Route children> will be ignored"
        );

        warning(
            !(
                render &&
                children &&
                !isEmptyChildren(children)
            ),
            "You should not use <Route render> and <Route children> in the same route; <Route children> will be ignored"
        );

        const withParams = props => {
            const { match, location } = props;
            if (match) {
                return {
                    ...this.parseParams(location),
                    ...props
                };
            }
        };

        const routeProps = {
            path: this._path,
            exact,
            strict,
            sensitive,
        };

        if (component) {
            routeProps.render = props => React.createElement(component, withParams(props));
        } else if (render) {
            routeProps.render = props => render(withParams(props));
        } else if (typeof children === "function") {
            routeProps.children = props => children(withParams(props));
        } else if (children && !isEmptyChildren(children)) {
            routeProps.children = children;
        }

        return <Route {...routeProps} />;
    }

    toUrl = tokens => {
        const path = generatePath(this._path, tokens);

        const qsTokens = this._qsKeys
            ? Object
                .keys(tokens)
                .filter(key => this._qsKeys.includes(key))
                .reduce((acc, key) => ({
                    [key]: tokens[key],
                    ...acc
                }), null)
            : null;

        return qsTokens
            ? `${path}?${qs.stringify(qsTokens)}`
            : path;
    }

    toLink = tokens => props => <Link {...props} to={this.toUrl(tokens)} />;

    parseParams = location => {
        const match = matchPath(location.pathname, { path: this._path });
        if (!match) {
            return null;
        }
        const qsParams = qs.parse(location.search);

        if ((this._pathSchema && !this._pathSchema.isValidSync(match.params))
            || (this._qsSchema && !this._qsSchema.isValidSync(qsParams))) {
            return null;
        }

        const pathValues = this._pathSchema
            ? this._pathSchema.cast(match.params)
            : {};
        const qsValues = this._qsSchema
            ? this._qsSchema.cast(qsParams)
            : {};
        return {
            ...pathValues,
            ...qsValues,
        };
    }
}

export default Location;