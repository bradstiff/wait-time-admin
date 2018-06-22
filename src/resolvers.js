import { GraphQLScalarType, GraphQLError } from 'graphql';
import { Kind } from 'graphql/language';
import slugify from 'slugify';
import moment from 'moment';
import { Resort, Lift } from './connectors';

const validateDate = value => {
    if (isNaN(Date.parse(value))) {
        throw new GraphQLError('Query error: not a valid date', [value]);
    };
};

const resolvers = {
    Query: {
        resort: Resort.getByID,
        resortBySlug: Resort.getBySlug,
        resorts: Resort.getAll,
        waitTimeDate: Resort.getWaitTimeDate,
        lift: Lift.getByID,
        //uplifts: Uplifts.get,
    },
    Mutation: {
        createResort: Resort.create,
        updateResort: Resort.update,
    },
    Resort: {
        dates: Resort.getWaitTimeDates,
        lastDate: Resort.getLastWaitTimeDate,
        lifts: Resort.getLifts,
    },
    Lift: {
        resort: (child, args, context) => Resort.getByID(null, { id: child.resortID }, context),
        upliftSummaries: Lift.getUpliftSummaries,
        upliftList: Lift.getUpliftList,
        upliftGroupings: async (lift, args, context) => {
            const groupings = await Lift.getUpliftGroupings(lift, args, context);
            let groupDescription;
            switch (args.groupBy.toLowerCase()) {
                case 'season':
                    groupDescription = key => `${key} - ${key + 1}`;
                    break;
                case 'month':
                    groupDescription = key => moment().month(key - 1).format('MMMM');
                    break;
                case 'day':
                    groupDescription = key => moment().day(key - 1).format('dddd');
                    break;
                case 'hour':
                    groupDescription = key => `${moment().hour(key).format('hA')} - ${moment().hour(key + 1).format('hA')}`;
                    break;
                default:
                    throw new error('Invalid groupBy');
            }
            return groupings.map(grouping => Object.assign(
                {},
                { groupDescription: groupDescription(grouping['groupKey']) },
                grouping
            ));
        },
    },
    WaitTimeDate: {
        id: (waitTimeDate) => `${waitTimeDate.resortID.toString()}:${waitTimeDate.date.toISOString()}`,
        timePeriods: Resort.getWaitTimePeriods,
        resort: (waitTimeDate, args, context) => Resort.getByID(null, { id: waitTimeDate.resortID }, context),
    },
    Uplift: {
        lift: (child, args, context) => Lift.getByID(null, { id: child.liftID }, context),
        season: uplift => ({
            year: uplift.seasonYear
        }),
    },
    UpliftSummary: {
        season: upliftSummary => ({
            year: upliftSummary.seasonYear
        })
    },
    Season: {
        description: season => `${season.year} - ${season.year + 1}`,
    },
    Date: new GraphQLScalarType({
            name: 'Date',
            description: 'Date type',
            parseValue(value) {
                // value comes from the client, in variables
                validateDate(value);
                return new Date(value); // sent to resolvers
            },
            parseLiteral(ast) {
                // value comes from the client, inlined in the query
                if (ast.kind !== Kind.STRING) {
                    throw new GraphQLError(`Query error: Can only parse dates strings, got a: ${ast.kind}`, [ast]);
                }
                validateDate(ast.value);
                return new Date(ast.value); // sent to resolvers
            },
            serialize(value) {
                // value comes from resolvers
                return value.toISOString(); // sent to the client
            },
    }),
};

export default resolvers;
