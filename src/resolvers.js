import { GraphQLScalarType, GraphQLError } from 'graphql';
import { Kind } from 'graphql/language';
import slugify from 'slugify';
import moment from 'moment';

import { Resort, Lift } from './connectors';
import LiftTypes from './LiftTypes';

const validateDate = value => {
    if (isNaN(Date.parse(value))) {
        throw new GraphQLError('Query error: not a valid Date', [value]);
    };
};

const getLocation = (lat, lng) => lat
    ? { lat, lng}
    : null;

const resolvers = {
    Query: {
        resort: Resort.getByID,
        resortBySlug: Resort.getBySlug,
        resorts: Resort.getAll,
        waitTimeDate: Resort.getWaitTimeDate,
        lift: Lift.getByID,
        liftList: Lift.getList,
        intersectingLifts: Lift.getAllIntersecting,
    },
    Mutation: {
        createResort: Resort.create,
        updateResort: Resort.update,
        updateResortAssignedLifts: Resort.updateAssignedLifts,
    },
    Resort: {
        location: resort => getLocation(resort.latitude, resort.longitude),
        dates: Resort.getWaitTimeDates,
        lastDate: Resort.getLastWaitTimeDate,
        lifts: Lift.getAllByResort,
    },
    Lift: {
        resort: Resort.getByLift,
        upliftSummaries: Lift.getUpliftSummaries,
        upliftList: Lift.getUpliftList,
        upliftGroupings: async (lift, args, context) => {
            const getGroupDescription = groupBy => {
                if (groupBy === undefined) {
                    return key => undefined;
                }
                switch (groupBy.toLowerCase()) {
                    case 'season':
                        return key => `${key} - ${key + 1}`;
                    case 'month':
                        return key => moment().month(key - 1).format('MMMM');
                    case 'day':
                        return key => moment().day(key - 1).format('dddd');
                    case 'hour':
                        return key => `${moment().hour(key).format('hA')} - ${moment().hour(key + 1).format('hA')}`;
                    default:
                        throw new error('Invalid groupBy');
                }
            }
            const groupDescription = getGroupDescription(args.groupBy);
            const group2Description = getGroupDescription(args.groupBy2);

            const groupings = await Lift.getUpliftGroupings(lift, args, context);
            return groupings.map(grouping => Object.assign(
                {},
                { groupDescription: groupDescription(grouping['groupKey']) },
                { group2Description: group2Description(grouping['group2Key']) },
                grouping
            ));
        },
        type: lift => ({
            id: lift.typeID,
        }),
        route: lift => [
            getLocation(lift.point1Latitude, lift.point1Longitude),
            getLocation(lift.point2Latitude, lift.point2Longitude),
            getLocation(lift.point3Latitude, lift.point3Longitude),
            getLocation(lift.point4Latitude, lift.point4Longitude),
            getLocation(lift.point5Latitude, lift.point5Longitude),
        ].filter(location => location !== null),
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
    LiftType: {
        description: type => LiftTypes.find(t => t.id === type.id).description,
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
