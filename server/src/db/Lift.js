import mssql from 'mssql';
import DataLoader from 'dataloader';
import PredicateBuilder from './PredicateBuilder';
import Resort from './Resort';

const liftQuery = `
    select LiftID as id, name, resortID, typeID, isActive, occupancy, Point1Latitude as station1Lat, Point1Longitude as station1Lng, Point2Latitude as station2Lat, Point2Longitude as station2Lng, Point3Latitude as station3Lat, Point3Longitude as station3Lng, Point4Latitude as station4Lat, Point4Longitude as station4Lng, Point5Latitude as station5Lat, Point5Longitude as station5Lng
    from Lift
`;

export default {
    getByID: async (_, args, context) => {
        const id = args.id || args.liftID;
        const result = await context.db.request()
            .input('id', mssql.Int, id)
            .query(`${liftQuery} where IsHidden = 0 and LiftID = @id`);
        return result.recordset[0];
    },
    getResort: async (lift, args, context) => {
        const result = await context.db.request()
            .input('resortID', mssql.Int, lift.resortID)
            .query(`${resortQuery} where ResortID = @resortID`);
        return result.recordset[0];
    },
    getAllByResort: (resort, args, context) => context.dataLoaders.liftsByResortIDs.load(resort.id),
    getAllIntersecting: async (_, { topLeft, bottomRight }, context) => {
        const result = await context.db.request()
            .query(`
                ${liftQuery}
                where IsHidden = 0 and GeoRoute.STIntersects(geography::STGeomFromText('POLYGON ((
                    ${topLeft.lng} ${topLeft.lat}, 
                    ${topLeft.lng} ${bottomRight.lat}, 
                    ${bottomRight.lng} ${bottomRight.lat}, 
                    ${bottomRight.lng} ${topLeft.lat},
                    ${topLeft.lng} ${topLeft.lat}
                ))', 4326)) = 1 
            `);
        return result.recordset;
    },
    getList: async (_, args, context) => {
        const orderBy = args.orderBy.toLowerCase();
        const predicates = new PredicateBuilder()
            .append('IsHidden', 'isHidden', mssql.Bit, 0)
            .append('Name', 'name', mssql.NVarChar, args.name, 'LIKE')
            .append('TypeID', 'typeID', mssql.Int, args.typeID)
            .append('ResortID', 'resortID', mssql.Int, args.resortID)
            .append('IsActive', 'isActive', mssql.Bit, args.isActive);
        const liftsPromise = predicates
            .bindParameters(context.db.request())
            .query(`${liftQuery}
                ${predicates.whereClause}
                order by ${orderBy} ${args.order}
                offset ${args.offset} rows
                fetch next ${args.limit} rows only
            `);
        const liftCountPromise = predicates
            .bindParameters(context.db.request())
            .query(`
                select cast(count(*) as int) count
                from Lift
                ${predicates.whereClause}
            `);
        return Promise.all([liftsPromise, liftCountPromise])
            .then(([lifts, liftCount]) => ({
                count: liftCount.recordset[0]['count'],
                lifts: lifts.recordset
            })
            );
    },
    getUpliftList: async (lift, args, context) => {
        const orderBy = args.orderBy.toLowerCase();
        const aliasedOrderBy = orderBy === 'date'
            ? 'LocalDateTime'
            : orderBy;
        const upliftsPromise = context.db.request()
            .input('liftID', mssql.Int, lift.id)
            .input('seasonYear', mssql.Int, args.seasonYear)
            .input('month', mssql.Int, args.month)
            .input('day', mssql.Int, args.day)
            .input('hour', mssql.Int, args.hour)
            .query(`
                select UpliftID as id, seasonYear, LocalDateTime as date, waitSeconds 
                from Uplift
                where LiftID = @liftID
                and SeasonYear = isnull(@seasonYear, SeasonYear)
                and Month = isnull(@month, Month)
                and Day = isnull(@day, Day)
                and Hour = isnull(@hour, Hour)
                order by ${aliasedOrderBy} ${args.order}
                offset ${args.offset} rows
                fetch next ${args.limit} rows only
            `);
        const upliftCountPromise = context.db.request()
            .input('liftID', mssql.Int, lift.id)
            .input('seasonYear', mssql.Int, args.seasonYear)
            .input('month', mssql.Int, args.month)
            .input('day', mssql.Int, args.day)
            .input('hour', mssql.Int, args.hour)
            .query(`
                select cast(count(*) as int) as count
                from Uplift
                where LiftID = @liftID
                and SeasonYear = isnull(@seasonYear, SeasonYear)
                and Month = isnull(@month, Month)
                and Day = isnull(@day, Day)
                and Hour = isnull(@hour, Hour)
            `);
        return Promise.all([upliftsPromise, upliftCountPromise])
            .then(([uplifts, upliftCount]) => ({
                count: upliftCount.recordset[0]['count'],
                uplifts: uplifts.recordset
            })
            );
    },
    getUpliftGroupings: async (lift, args, context) => {
        //groupBy is validated by schema
        let groupBy = args.groupBy.toLowerCase();
        if (groupBy === 'season') {
            groupBy = 'seasonYear';
        }
        let groupBy2 = args.groupBy2 ? args.groupBy2.toLowerCase() : null;
        if (groupBy2 === 'season') {
            groupBy2 = 'seasonYear';
        }
        const request = context.db.request().input('liftID', mssql.Int, lift.id);
        let result = null;
        //need a query builder
        if (groupBy2 === null) {
            result = await request.query(`
                select	u.LiftID as liftID, ${groupBy} as groupKey, count(*) as upliftCount, avg(waitSeconds) as waitTimeAverage
                from Uplift u
                where LiftID = @liftID
                group by liftID, ${groupBy}
                order by ${groupBy} asc
            `);
        } else {
            result = await request.query(`
                select	u.LiftID as liftID, ${groupBy} as groupKey, ${groupBy2} as group2Key, count(*) as upliftCount, avg(waitSeconds) as waitTimeAverage
                from Uplift u
                where LiftID = @liftID
                group by liftID, ${groupBy}, ${groupBy2}
                order by ${groupBy}, ${groupBy2} asc
            `);
        }
        return result.recordset.map(record => Object.assign(
            record, {
                groupBy: args.groupBy,
                groupBy2: args.groupBy2,
            }
        ));
    },
    getUpliftSummaries: (lift, args, context) => context.dataLoaders.upliftSummariesByLiftIDs.load(lift.id),
    update: async (_, args, context) => {
        const result = await context.db.request()
            .input('id', mssql.Int, args.id)
            .input('name', mssql.NVarChar, args.name)
            .input('typeID', mssql.Int, args.typeID)
            .input('occupancy', mssql.Int, args.occupancy)
            .input('resortID', mssql.Int, args.resortID)
            .input('isActive', mssql.Bit, args.isActive)
            .input('station1Lat', mssql.Float, args.station1Lat)
            .input('station1Lng', mssql.Float, args.station1Lng)
            .input('station2Lat', mssql.Float, args.station2Lat)
            .input('station2Lng', mssql.Float, args.station2Lng)
            .input('station3Lat', mssql.Float, args.station3Lat)
            .input('station3Lng', mssql.Float, args.station3Lng)
            .input('station4Lat', mssql.Float, args.station4Lat)
            .input('station4Lng', mssql.Float, args.station4Lng)
            .input('station5Lat', mssql.Float, args.station5Lat)
            .input('station5Lng', mssql.Float, args.station5Lng)
            .query(`
                update Lift set 
                    Name = @name, 
                    TypeID = @typeID,
                    Occupancy = @occupancy,
                    ResortID = @resortID,
                    IsActive = @isActive,
                    Point1Latitude = @station1Lat,
                    Point1Longitude = @station1Lng,
                    Point2Latitude = @station2Lat,
                    Point2Longitude = @station2Lng,
                    Point3Latitude = @station3Lat,
                    Point3Longitude = @station3Lng,
                    Point4Latitude = @station4Lat,
                    Point4Longitude = @station4Lng,
                    Point5Latitude = @station5Lat,
                    Point5Longitude = @station5Lng
                where LiftID = @id
            `);
        return Resort.getByID(null, args, context);
    },
};

export const makeDataLoaders = db => ({
    liftsByResortIDs: new DataLoader(async (resortIDs) => {
        const result = await db.request().query(`${liftQuery} where ResortID in (${resortIDs.join()})`);
        return resortIDs.map(resortID => result.recordset.filter(lift => lift.resortID === resortID));
    }),
    upliftSummariesByLiftIDs: new DataLoader(async liftIDs => {
        const result = await db.request().query(`
            select	u.LiftID as liftID, seasonYear, count(*) as upliftCount, avg(waitSeconds) as waitTimeAverage
            from	Uplift u 
            join    Lift l on u.LiftID = l.LiftID
            where	u.LiftID in (${liftIDs.join()})
            group by SeasonYear, u.LiftID, l.Name
            order by SeasonYear, l.Name
        `);
        return liftIDs.map(liftID => result.recordset.filter(summary => summary.liftID === liftID));
    }),
});
