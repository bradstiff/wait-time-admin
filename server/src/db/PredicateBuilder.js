//Simplify process of applying filters to queries:
//- filter values of undefined are not included in the where clause
//- filter values of null are applied using the IS NULL operator
//- otherwise filter values are applied using the specified operator

//'BETWEEN' is not supported; instead use two predicates of >= and <=

//todo: add validation, check Elastisearch
export default class PredicateBuilder {
    constructor() {
        this.predicates = [];
    }

    append(queryFieldName, parameterName, parameterType, value, operator = '=') {
        this.predicates.push({
            queryFieldName,
            parameterName,
            parameterType,
            value: operator.toUpperCase() === 'LIKE' && value
                ? `%${value}%`
                : value,
            operator,
        });
        return this;
    }

    get predicatesWithValues() {
        return this.predicates.filter(predicate => predicate.value !== undefined);
    }

    bindParameters(request) {
        return this.predicatesWithValues.reduce(
            (acc, predicate) => acc.input(predicate.parameterName, predicate.parameterType, predicate.value),
            request);
    }

    get whereClause() {
        if (this.predicatesWithValues.length === 0) {
            return '';
        }
        return 'WHERE ' + this.predicatesWithValues
            .map(predicate => {
                return predicate.value === null ? `${predicate.queryFieldName} is null`
                    : predicate.operator.toUpperCase() === 'LIKE' ? `${predicate.queryFieldName} COLLATE Latin1_general_CI_AI LIKE @${predicate.parameterName} COLLATE Latin1_general_CI_AI`
                    : `${predicate.queryFieldName} ${predicate.operator} @${predicate.parameterName}`;
            })
            .join(' AND ');
    }
}