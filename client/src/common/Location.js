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
            this._pathTokenKeys = Object.keys(pathTokenDefs);
            this._pathTokens = pathTokenDefs;
            this._pathSchema = Yup.object().shape(pathTokenDefs);
        }

        if (qsTokenDefs && !isEmptyObject(qsTokenDefs)) {
            this._qsTokenKeys = Object.keys(qsTokenDefs);
            this._qsTokens = qsTokenDefs;
            this._qsSchema = Yup.object().shape(qsTokenDefs);
        }
    }

    get path() {
        return this._path;
    }

    toRoute = (renderOption, exact = false, strict = false, sensitive = false) => {
        const { component, render, children, notFound } = renderOption;
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
            const validParams = !!match && this.parseParams(location);
            return validParams
                ? {
                    ...props,
                    ...validParams
                }
                : null;
        };

        const routeProps = {
            path: this._path,
            exact,
            strict,
            sensitive,
        };

            if (component) {
                routeProps.render = props => {
                    const propsWithParams = withParams(props);
                    return propsWithParams
                        ? React.createElement(component, propsWithParams)
                        : React.createElement(notFound);
                }
            } else if (render) {
                routeProps.render = props => {
                    const propsWithParams = withParams(props);
                    return propsWithParams
                        ? render(propsWithParams)
                        : React.createElement(notFound);
                }
            } else if (typeof children === "function") {
                routeProps.children = props => {
                    const propsWithParams = withParams(props);
                    return propsWithParams
                        ? children(propsWithParams)
                        : React.createElement(notFound);
                }
            } else if (children && !isEmptyChildren(children)) {
                routeProps.children = children;
            }

        return <Route {...routeProps} />;
    }

    toUrl = tokens => {
        const path = generatePath(this._path, tokens);

        const qsTokens = this._qsTokenKeys
            ? Object
                .keys(tokens)
                .filter(key => this._qsTokenKeys.includes(key))
                .reduce((acc, key) => {
                    const value = tokens[key];
                    const tokenDef = this._qsTokens[key];
                    return tokenDef.default() === value
                        ? acc //avoid query string clutter: don't serialize values that are the same as the default
                        : {
                            [key]: tokens[key],
                            ...acc
                        }
                }, null)
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
        for (const key in qsParams) {
            if (qsParams[key] === 'null') {
                qsParams[key] = null;
            }
        }
        let pathValues, qsValues;
        try {
            pathValues = this._pathSchema
                ? this._pathSchema.validateSync(match.params)
                : {};
            qsValues = this._qsSchema
                ? this._qsSchema.validateSync(qsParams)
                : {};
        } catch (err) {
            console.log(err);
            return null;
        }

        return {
            ...pathValues,
            ...qsValues,
        };
    }
}

export default Location;