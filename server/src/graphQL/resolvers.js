import { GraphQLScalarType, GraphQLError } from 'graphql';
import { Kind } from 'graphql/language';
import moment from 'moment';

import Resort from '../db/Resort';
import Lift from '../db/Lift';
import LiftTypes from '../db/LiftTypes';

const validateDate = value => {
    if (isNaN(Date.parse(value))) {
        throw new GraphQLError('Query error: not a valid Date', [value]);
    };
};

const getGroupDescription = (groupBy, key, grouping) => {
    if (groupBy === undefined) {
        return undefined;
    }
    switch (groupBy.toLowerCase()) {
        case 'season':
            return `${key} - ${key + 1}`;
        case 'month':
            return moment().month(key - 1).format('MMMM');
        case 'day':
            return moment().day(key - 1).format('dddd');
        case 'hour':
            return `${moment().hour(key).format('hA')} - ${moment().hour(key + 1).format('hA')}`;
        case 'lift': 
            return grouping.groupDescription; //groupBy2 = lift is not supported
        default:
            throw new Error(`groupBy '${groupBy}' is not supported.`);
    }
}

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
        updateLift: Lift.update,
    },
    Resort: {
        location: resort => ({ lat: resort.latitude, lng: resort.longitude }),
        dates: Resort.getWaitTimeDates,
        lastDate: Resort.getLastWaitTimeDate,
        lifts: Lift.getAllByResort,
        upliftGroupings: Resort.getUpliftGroupings,
        liftEnvelope: resort => {
            if (!resort.liftEnvelopeText) {
                return null;
            }
            const start = resort.liftEnvelopeText.indexOf('STRING (') + 'STRING ('.length;
            const length = resort.liftEnvelopeText.length - start - '))'.length;
            const pointPairs = resort.liftEnvelopeText.substr(start, length);
            return pointPairs
                .split(', ')
                .map(pointPair => {
                    const points = pointPair.split(' ');
                    return {
                        lng: parseFloat(points[0]),
                        lat: parseFloat(points[1]),
                    };
                }
            );
        },
    },
    Lift: {
        resort: Resort.getByLift,
        upliftList: Lift.getUpliftList,
        upliftGroupings: Lift.getUpliftGroupings,
        type: lift => ({
            id: lift.typeID,
        }),
        stations: lift => {
            const makeStation = (number, lat, lng) => lat
                ? {
                    number,
                    location: { lat, lng },
                }
                : null;

            const stations = [
                makeStation(1, lift.station1Lat, lift.station1Lng),
                makeStation(2, lift.station2Lat, lift.station2Lng),
                makeStation(3, lift.station3Lat, lift.station3Lng),
                makeStation(4, lift.station4Lat, lift.station4Lng),
                makeStation(5, lift.station5Lat, lift.station5Lng),
            ].filter(station => station !== null);
            stations[0].name = 'Load station';
            stations[stations.length - 1].name = 'Unload station';
            stations
                .filter(station => station.name === undefined)
                .forEach(station => station.name = 'Mid station');
            return stations;
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
    UpliftGrouping: {
        groupDescription: grouping => getGroupDescription(grouping.groupBy, grouping['groupKey'], grouping),
        group2Description: grouping => getGroupDescription(grouping.groupBy2, grouping['group2Key'], grouping),
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
