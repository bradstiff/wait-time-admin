import mssql from 'mssql';
import DataLoader from 'dataloader';

const resortQuery = 'select ResortID as id, name, logoFilename, trailMapFilename from Resort';
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
            //accumulate wait times, favoring the most recent one for a lift: reload cumulative wait times 
            //with the most recent lift times, plus any previous lift times not found in the specific period
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
};

const Lift = {
    getByResortID: async(lift, args, context) => {
        const result = await context.db.request()
            .input('resortID', mssql.Int, lift.resortID)
            .query(`${resortQuery} where ResortID = @resortID`);
        return result.recordset[0];
    },
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
});
