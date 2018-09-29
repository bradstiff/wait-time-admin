--This works, but it takes 250ms on average. Probably going to refactor to accumulate wait times in javascript

if exists (select 1 from sysobjects where id = object_id('WaitTimeDateUplift'))
begin
	drop view WaitTimeDateUplift
end
go

create view WaitTimeDateUplift as 
--Uplifts are allocated to 15 minute time periods
WITH TimePeriodRange AS (
	--establish start and end time period
	select  ResortID, LocalDate as WaitTimeDate, min(LocalMinutes / 15) as StartTimePeriod, max(LocalMinutes / 15) as EndTimePeriod
	from	Uplift u 
	join	Lift l on l.LiftID = u.LiftID
	group by ResortID, LocalDate
),
TimePeriod AS (
	--fill the gaps between the start and end, since there may be time periods where a lift wasn't taken
    select  ResortID, WaitTimeDate, StartTimePeriod as TimePeriod
	from	TimePeriodRange

    UNION ALL
    
	SELECT	ResortID, WaitTimeDate, TimePeriod + 1 
	FROM	TimePeriod tp
	WHERE	TimePeriod + 1 <= (select EndTimePeriod from TimePeriodRange tpr where tpr.ResortID = tp.ResortID and tpr.WaitTimeDate = tp.WaitTimeDate)
),
WaitTimePeriod as (
	select	p.ResortID, WaitTimeDate, TimePeriod, u.LiftID, avg(u.WaitSeconds) as Seconds
	from	TimePeriod p 
	join	Lift l on l.ResortID = p.ResortID
	join	Uplift u on u.LiftID = l.LiftID and u.LocalDate = p.WaitTimeDate and u.LocalMinutes / 15 = p.TimePeriod
	group by p.ResortID, WaitTimeDate, TimePeriod, u.LiftID
),
CumulativeWaitTimePeriod as (
	--accumulate uplifts by time period, keeping the latest one for each lift
	select	ResortID, WaitTimeDate, TimePeriod, LiftID, Seconds
	from	WaitTimePeriod

	union all

	select	ResortID, WaitTimeDate, TimePeriod + 1, LiftID, Seconds
	from	CumulativeWaitTimePeriod c
	where	c.TimePeriod + 1 <= (select EndTimePeriod from TimePeriodRange tpr where tpr.ResortID = c.ResortID and tpr.WaitTimeDate = c.WaitTimeDate)
	and		not exists (
		select 1 from WaitTimePeriod p1 where p1.ResortID = c.ResortID and p1.WaitTimeDate = c.WaitTimeDate and p1.LiftID = c.LiftID and p1.TimePeriod = c.TimePeriod + 1
	)
)
SELECT	ResortID, WaitTimeDate, TimePeriod, TimePeriod * 15 * 60 as Timestamp, LiftID, Seconds
FROM	CumulativeWaitTimePeriod
