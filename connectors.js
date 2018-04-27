import mssql from 'mssql';
import DataLoader from 'dataloader';

const resortQuery = 'select ResortID as id, name, logoFilename, trailMapFilename from Resort';
const liftQuery = 'select LiftID as id, name, resortID from Lift';

const resolveSlug = slug => {
    return slug == 'steamboat' ? 1 :
        slug == 'winter-park' ? 2 :
        4;
};

const Resort = {
    getBySlug: (_, { slug }, context) => {
        const id = resolveSlug(slug);
        return Resort.getByID(_, { id }, context);
    },
    getByID: async (_, args, context) => {
        const id = args.id || args.resortID;
        const result = await context.db.request()
            .input('id', mssql.Int, id)
            .query(`${resortQuery} where ResortID = @id`);
        return result.recordset[0];
    },
    getAll: async (_, args, context) => {
        const result = await context.db.request()
            .query(`${resortQuery} order by SortOrder`);
        return result.recordset;
    },
    getWaitTimeDate: (_, { resortSlug, date }, context) => {
        return {
            date: date,
            resortID: resolveSlug(resortSlug)
        };
    },
    getLastWaitTimeDate: async (resort, _, context) => {
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
    getWaitTimePeriods: async (waitTimeDate, args, context) => {
        const result = await context.db.request()
            .input('resortID', mssql.Int, waitTimeDate.resortID)
            .input('date', mssql.Date, waitTimeDate.date)
            .query(`
                select  resortID, convert(date, LocalDateTime) as date, (datepart(hh, convert(time, LocalDateTime)) * 60 + datepart(mi, convert(time, LocalDateTime))) / 15 * 15 * 60 as timestamp, u.LiftID as liftID, avg(WaitSeconds) as seconds
                from	Uplift u
                join	Lift l on l.LiftID = u.LiftID
                where	ResortID = @resortID 
                and     convert(date, LocalDateTime) = @date
                group by 
		                ResortID, 
		                convert(date, LocalDateTime), (datepart(hh, convert(time, LocalDateTime)) * 60 + datepart(mi, convert(time, LocalDateTime))) / 15, 
		                u.LiftID
                order by 
	                convert(date, LocalDateTime), (datepart(hh, convert(time, LocalDateTime)) * 60 + datepart(mi, convert(time, LocalDateTime))) / 15
            `);
        return result.recordset.reduce((waitTimePeriods, waitTime) => {
            let timePeriod = waitTimePeriods.find(waitTimePeriod => waitTimePeriod.timestamp === waitTime.timestamp);
            if (!timePeriod) {
                timePeriod =  {
                    timestamp: waitTime.timestamp,
                    waitTimes: []
                }
                waitTimePeriods.push(timePeriod);
            }
            timePeriod.waitTimes.push({
                liftID: waitTime.liftID,
                seconds: waitTime.seconds
            });
            return waitTimePeriods;
        }, []);
    },
    getWaitTimeDates: (resort, args, context) => context.dataLoaders.waitTimeDatesByResortIDs.load(resort.id),
    getLifts: (resort, args, context) => context.dataLoaders.liftsByResortIDs.load(resort.id)
}

const Lift = {
    getByResortID: async (lift, args, context) => {
        const result = await context.db.request()
            .input('resortID', mssql.Int, lift.resortID)
            .query(`${resortQuery} where ResortID = @resortID`);
        return result.recordset[0];
    }
};

export { Resort, Lift };

export const makeDataLoaders = (db) => ({
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
                date: resortDate.date
            })) : null;
        });
    }),
    liftsByResortIDs: new DataLoader(async (resortIDs) => {
        const result = await db.request().query(`${liftQuery} where ResortID in (${resortIDs.join()})`);
        return resortIDs.map(resortID => result.recordset.filter(lift => lift.resortID === resortID));
    })
});
