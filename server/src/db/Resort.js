import mssql from 'mssql';
import DataLoader from 'dataloader';

const resortQuery = 'select ResortID as id, name, slug, logoFilename, trailMapFilename, timezone, latitude, longitude, hasWaitTimes, LiftEnvelope.ToString() as liftEnvelopeText from Resort';

export default {
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
    //getWaitTimePeriods: async (waitTimeDate, args, context) => {  //recursive CTE too slow (~450ms)
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
        const result = await context.db.request()
            .input('resortID', mssql.Int, waitTimeDate.resortID)
            .input('date', mssql.Date, waitTimeDate.date)
            .query(`
	            select  LocalMinutes / 15 as timeperiod, u.liftID, AVG(WaitSeconds) as seconds
	            from	Uplift u 
	            join	Lift l on l.LiftID = u.LiftID
                where   l.ResortID = @resortID
                and     u.LocalDate = @date
                group by LocalMinutes / 15, u.LiftID
                order by LocalMinutes / 15
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
    getByLift: (lift, args, context) => lift.resortID ? context.dataLoaders.resortsByIDs.load(lift.resortID) : null,
    getWaitTimeDates: (resort, args, context) => context.dataLoaders.waitTimeDatesByResortIDs.load(resort.id),
    getUpliftGroupings: async (resort, args, context) => {
        //groupBy is validated by schema
        let groupBy = args.groupBy.toLowerCase();
        if (groupBy === 'season') {
            groupBy = 'seasonYear';
        }
        let groupBy2 = args.groupBy2 ? args.groupBy2.toLowerCase() : null;
        if (groupBy2 === 'season') {
            groupBy2 = 'seasonYear';
        }
        const request = context.db.request().input('resortID', mssql.Int, resort.id);
        let result = null;
        //need a query builder
        if (groupBy === 'lift') { 
            result = await request.query(`
                select	l.ResortID as resortID, l.LiftID as groupKey, l.Name as groupDescription, count(*) as upliftCount, avg(waitSeconds) as waitTimeAverage
                from Uplift u
                join Lift l on l.LiftID = u.LiftID
                where ResortID = @resortID
                group by resortID, l.LiftID, l.Name
                order by l.Name asc
            `);
        } else if (groupBy2 === null) {
            result = await request.query(`
                select	l.ResortID as resortID, ${groupBy} as groupKey, count(*) as upliftCount, avg(waitSeconds) as waitTimeAverage
                from Uplift u
                join Lift l on l.LiftID = u.LiftID
                where ResortID = @resortID
                group by resortID, ${groupBy}
                order by ${groupBy} asc
            `);
        } else {
            result = await request.query(`
                select	l.ResortID as resortID, ${groupBy} as groupKey, ${groupBy2} as group2Key, count(*) as upliftCount, avg(waitSeconds) as waitTimeAverage
                from Uplift u
                join Lift l on l.LiftID = u.LiftID
                where ResortID = @resortID
                group by resortID, ${groupBy}, ${groupBy2}
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
    create: async (_, args, context) => {
        const request = context.db.request()
            .input('name', mssql.NVarChar, args.name)
            .input('slug', mssql.NVarChar, args.slug)
            .input('timezone', mssql.VarChar, args.timezone)
            .input('logoFilename', mssql.VarChar, args.logoFilename)
            .input('trailMapFilename', mssql.VarChar, args.trailMapFilename)
            .input('latitude', mssql.Float, args.latitude)
            .input('longitude', mssql.Float, args.longitude)
        const result = await request.query(`
            insert Resort (Name, Slug, Timezone, LogoFilename, TrailMapFilename, Latitude, Longitude) 
                values (@name, @slug, @timezone, @logoFilename, @trailMapFilename, @latitude, @longitude); 
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
            .input('timezone', mssql.VarChar, args.timezone)
            .input('logoFilename', mssql.VarChar, args.logoFilename)
            .input('trailMapFilename', mssql.VarChar, args.trailMapFilename)
            .input('latitude', mssql.Float, args.latitude)
            .input('longitude', mssql.Float, args.longitude)
            .query(`
                update Resort set 
                    Name = @name, 
                    Slug = @slug,
                    LogoFilename = @logoFilename,
                    TrailMapFilename = @trailMapFilename,
                    Timezone = @timezone,
                    Latitude = @latitude,
                    Longitude = @longitude
                where ResortID = @id
            `);
        return Resort.getByID(null, args, context);
    },
    updateAssignedLifts: async (_, { id, liftIDs }, context) => {
        const result = await context.db.request()
            .input('id', mssql.Int, id)
            .query(`
                update Lift set 
                    ResortID = @id
                where LiftID in (${liftIDs.join()});

                update Lift set
                    ResortID = null
                where LiftID not in (${liftIDs.join()})
                and ResortID = @id;

                update r set		
                    LiftEnvelope = (select geography::EnvelopeAggregate(GeoRoute) from Lift where ResortID = r.ResortID)
                from Resort r
                where r.ResortID = @id;
            `);
        return Resort.getByID(null, { id }, context);
    },
};

export const makeDataLoaders = db => ({
    waitTimeDatesByResortIDs: new DataLoader(async (resortIDs) => {
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
    resortsByIDs: new DataLoader(async ids => {
        const result = await db.request().query(`
            ${resortQuery}
            where ResortID in (${ids.join()})
        `);
        return result.recordset;
    }),
});

