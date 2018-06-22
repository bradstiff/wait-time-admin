import mssql from 'mssql';
import DataLoader from 'dataloader';
import { error } from 'util';

const resortQuery = 'select ResortID as id, name, slug, logoFilename, trailMapFilename, timezone, latitude, longitude from Resort';
const liftQuery = 'select LiftID as id, name, resortID from Lift';

const Resort = {
    getBySlug: async(_, { slug }, context) => {
        const result = await context.db.request()
            .input('slug', mssql.NVarChar, slug)
            .query(`${resortQuery} where Slug = @slug`);
        return result.recordset[0];
    },
    getByID: async(_, args, context) => {
        const id = args.id || args.resortID;
        const result = await context.db.request()
            .input('id', mssql.Int, id)
            .query(`${resortQuery} where ResortID = @id`);
        return result.recordset[0];
    },
    getAll: async(_, args, context) => {
        const result = await context.db.request()
            .query(`${resortQuery} order by SortOrder`);
        return result.recordset;
    },
    getIDBySlug: async(_, { slug }, context) => {
        const result = await context.db.request()
            .input('slug', mssql.NVarChar, slug)
            .query('select ResortID from Resort where Slug = @slug');
        return result.recordset[0].ResortID;
    },
    getWaitTimeDate: async(_, { resortSlug, date }, context) => {
        const resortID = await Resort.getIDBySlug(_, { slug: resortSlug }, context);
        return {
            date,
            resortID,
        };
    },
    getLastWaitTimeDate: async(resort, _, context) => {
        const result = await context.db.request()
            .input('resortID', mssql.Int, resort.id)
            .query(`
                select top 1 resortID, convert(date, LocalDateTime) as date
                from Uplift u join Lift l on u.LiftID = l.LiftID
                where ResortID = @resortID
                order by convert(date, LocalDateTime) desc
            `);
        return result.recordset[0];
    },
    //getWaitTimePeriods: async (waitTimeDate, args, context) => {
    //    const result = await context.db.request()
    //        .input('resortID', mssql.Int, waitTimeDate.resortID)
    //        .input('date', mssql.Date, waitTimeDate.date)
    //        .query(`
    //            select  timestamp, liftID, seconds
    //            from	WaitTimeDateUplift
    //            where	ResortID = @resortID 
    //            and     WaitTimeDate = @date
    //            order by timestamp
    //            OPTION (RECOMPILE)
    //        `);
    //    let timePeriod = null;
    //    const data = result.recordset.reduce((waitTimePeriods, waitTime) => {
    //        if (!timePeriod || timePeriod.timestamp != waitTime.timestamp) {
    //            //depends on a pre-ordered list of waitTimes
    //            timePeriod = {
    //                timestamp: waitTime.timestamp,
    //                waitTimes: [],
    //            };
    //            waitTimePeriods.push(timePeriod);
    //        }
    //        timePeriod.waitTimes.push({
    //            liftID: waitTime.liftID,
    //            seconds: waitTime.seconds,
    //        });
    //        return waitTimePeriods;
    //    }, []);
    //    return data;
    //},
    getWaitTimePeriods: async (waitTimeDate, args, context) => {
        //recursive CTE used in above view too slow (~450ms)
        const result = await context.db.request()
            .input('resortID', mssql.Int, waitTimeDate.resortID)
            .input('date', mssql.Date, waitTimeDate.date)
            .query(`
	            select  LocalMinutes / 15 as timeperiod, u.liftID, WaitSeconds as seconds
	            from	Uplift u 
	            join	Lift l on l.LiftID = u.LiftID
                where   l.ResortID = @resortID
                and     u.LocalDate = @date
                order by LocalMinutes
            `);
        const waitTimes = result.recordset;
        const periods = waitTimes.map(uplift => uplift.timeperiod);
        const startPeriod = Math.min(...periods);
        const endPeriod = Math.max(...periods);
        const waitTimePeriods = [];
        let cumulativeWaitTimes = [];
        for (let period = startPeriod; period <= endPeriod; period++) {
            //load the wait times for the period
            const specificWaitTimes = waitTimes
                .filter(waitTime => waitTime.timeperiod === period)
                .map(waitTime => ({
                    liftID: waitTime.liftID,
                    seconds: waitTime.seconds,
                }));
            //wait time for a lift is carried forward to the next period if the period has no wait time for the lift
            cumulativeWaitTimes = specificWaitTimes
                .concat(cumulativeWaitTimes.filter(cumulativeWaitTime =>
                    !specificWaitTimes.find(specificWaitTime => specificWaitTime.liftID === cumulativeWaitTime.liftID)));
            waitTimePeriods.push({
                timestamp: period * 15 * 60,
                waitTimes: cumulativeWaitTimes,                
            });
        }
        return waitTimePeriods;
    },
    getWaitTimeDates: (resort, args, context) => context.dataLoaders.waitTimeDatesByResortIDs.load(resort.id),
    getLifts: (resort, args, context) => context.dataLoaders.liftsByResortIDs.load(resort.id),
    create: async (_, args, context) => {
        const request = context.db.request()
            .input('name', mssql.NVarChar, args.name)
            .input('slug', mssql.NVarChar, args.slug)
            .input('logoFilename', mssql.NVarChar, args.slug)
            .input('trailMapFilename', mssql.NVarChar, args.slug)
        const result = await request.query(`
            insert Resort (Name, Slug, LogoFilename, TrailMapFilename, Latitude, Longitude) 
                values (@name, @slug, '', '', 0, 0); 
            select scope_identity() as id;
        `);

        const id = result.recordset[0]['id'];
        return Resort.getByID(null, { id }, context);
    },
    update: async (_, args, context) => {
        const result = await context.db.request()
            .input('id', mssql.Int, args.id)
            .input('name', mssql.NVarChar, args.name)
            .input('slug', mssql.NVarChar, args.slug)
            .query(`
                update Resort set 
                    Name = @name, 
                    Slug = @slug 
                where ResortID = @id
            `);
        return Resort.getByID(null, args, context);
    }
};

const Lift = {
    getByID: async (_, args, context) => {
        const id = args.id || args.liftID;
        const result = await context.db.request()
            .input('id', mssql.Int, id)
            .query(`${liftQuery} where LiftID = @id`);
        return result.recordset[0];
    },
    getResort: async(lift, args, context) => {
        const result = await context.db.request()
            .input('resortID', mssql.Int, lift.resortID)
            .query(`${resortQuery} where ResortID = @resortID`);
        return result.recordset[0];
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
        let groupBy = args.groupBy.toLowerCase();
        if (groupBy === 'season') {
            groupBy = 'seasonYear'
        };
        const result = await context.db.request()
            .input('liftID', mssql.Int, lift.id)
            .input('seasonYear', mssql.Int, args.seasonYear)
            .input('month', mssql.Int, args.month)
            .input('day', mssql.Int, args.day)
            .input('hour', mssql.Int, args.hour)
            .query(`
                select	u.LiftID as liftID, ${groupBy} as groupKey, count(*) as upliftCount, avg(waitSeconds) as waitTimeAverage
                from Uplift u
                where LiftID = @liftID
                and SeasonYear = isnull(@seasonYear, SeasonYear)
                and Month = isnull(@month, Month)
                and Day = isnull(@day, Day)
                and Hour = isnull(@hour, Hour)
                group by liftID, ${groupBy}
                order by ${groupBy} asc
            `);
        return result.recordset;
    },
    getUpliftSummaries: (lift, args, context) => context.dataLoaders.upliftSummariesByLiftIDs.load(lift.id),
};

export { Resort, Lift };

export const makeDataLoaders = (db) => ({
    waitTimeDatesByResortIDs: new DataLoader(async(resortIDs) => {
        const result = await db.request().query(`
                select distinct resortID, convert(date, LocalDateTime) as date
                from Uplift u join Lift l on u.LiftID = l.LiftID
                where ResortID in (${resortIDs.join()})
                order by convert(date, LocalDateTime)`);
        return resortIDs.map(resortID => {
            const resortDates = result.recordset.filter(resortDate => resortDate.resortID === resortID);
            return resortDates ? resortDates.map(resortDate => ({
                resortID: resortDate.resortID,
                date: resortDate.date,
            })) : null;
        });
    }),
    liftsByResortIDs: new DataLoader(async(resortIDs) => {
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
