USE [LiftLines]
GO

create table Track
(
	TrackID int identity not null,
	Name varchar(100) not null,
	StartDt datetime2 not null,
	Source nvarchar(50) null,
	constraint PK_Track primary key (TrackID)
)

create table TrackPoint
(
	TrackPointID int identity not null,
	Timestamp float not null,
	Latitude float not null,
	Longitude float not null,
	Altitude float not null,
	Bearing float not null,
	Speed float not null,
	Accuracy float not null,
	TrackID int not null,
	constraint PK_TrackPoint primary key (TrackPointID),
	constraint PK_TrackPoint_Track foreign key (TrackID) references Track (TrackID)
)

create index IX_TrackPoint on TrackPoint (TrackID, Timestamp)

create table TrackStep
(
	TrackStepID int identity not null,
	Timestamp float not null,
	StepCount float not null,
	TrackID int not null,
	constraint PK_TrackStep primary key (TrackStepID),
	constraint PK_TrackStep_Track foreign key (TrackID) references Track (TrackID)
)

create index IX_TrackStep on TrackStep (TrackID, Timestamp)

create table TrackActivity
(
	TrackActivityID int identity not null,
	Timestamp float not null,
	TypeID tinyint not null,
	TrackID int not null,
	constraint PK_TrackActivity primary key (TrackActivityID),
	constraint PK_TrackActivity_Track foreign key (TrackID) references Track (TrackID)
)

create index IX_TrackActivity on TrackActivity (TrackID, Timestamp)

create table Resort(
	ResortID int not null identity,
	Name nvarchar(100) not null,
	Latitude float not null,
	Longitude float not null,
	SortOrder int not null constraint DF_Resort_SortOrder default 0,
	LogoFilename varchar(50) not null,
	TrailMapFilename varchar(50) not null,
	constraint PK_Resort primary key (ResortID)
)

create table Lift(
	LiftID int NOT NULL identity,
	Name nvarchar(100) NULL,
	TypeID tinyint NOT NULL,
	Occupancy int null,
	Point1Latitude float NOT NULL,
	Point1Longitude float NOT NULL,
	Point1Altitude float null,
	Point2Latitude float NOT NULL,
	Point2Longitude float NOT NULL,
	Point2Altitude float null,
	Point3Latitude float  NULL,
	Point3Longitude float  NULL,
	Point3Altitude float null,
	Point4Latitude float  NULL,
	Point4Longitude float  NULL,
	Point4Altitude float null,
	Point5Latitude float  NULL,
	Point5Longitude float  NULL,
	Point5Altitude float null,
	EligibleWaitDistance float null,
	EligibleWaitWindow float null,
	AverageUpliftSpeed float null,
	IsActive bit not null,
	OsmID int null,
	OsmLink varchar(500) null,
	GeoRoute geography null,
	GeoLoadStation geography null,
	ResortID int null,
	constraint PK_Lifts primary key (LiftID),
	constraint FK_Lift_Resort foreign key (ResortID) references Resort (ResortID)
)

create spatial index IX_GeoLoadStation ON Lift(GeoLoadStation);  

create table Uplift(
	UpliftID int IDENTITY(1,1) NOT NULL,
	Timestamp float not null,
	LocalDateTime datetime not null,
	Latitude float not null,
	Longitude float not null,
	GeoPoint geography not null,
	WaitSeconds int not null,
	LiftID int not null,
	TrackID int null,
 constraint PK_Uplift primary key (UpliftID),
 constraint FK_Uplift_Lift foreign key(LiftID) references Lift (LiftID),
 constraint FK_Uplift_Track foreign key (TrackID) references Track (TrackID)
 )

create index IX_Lift on Uplift(LiftID, LocalDateTime);
create spatial index IX_GeoPoint ON Uplift(GeoPoint);  


create table Wait(
	WaitID int IDENTITY(1,1) NOT NULL,
	MovingTimestamp float not null,
	MovingLatitude float not null,
	MovingLongitude float not null,
	MovingGeoPoint geography not null,
	Seconds int not null,
	DistanceFromPrevious float null,
	TrackID int null,
 constraint PK_Wait primary key (WaitID),
 constraint FK_LiftWait_Track foreign key (TrackID) references Track (TrackID)
)

create spatial index IX_MovingGeoPoint ON Wait(MovingGeoPoint);  

insert Resort (Name, Latitude, Longitude, SortOrder, LogoFilename, TrailMapFilename) values 
('Squaw Valley Alpine Meadows', 0, 0, 1, 'squaw.png', 'squaw.png'),
('Mammoth', 0, 0, 2, 'mammoth.png', 'mammoth.png'),
('Big Bear', 0, 0, 3, 'big-bear-white.png', 'big-bear.png'),
('June Mountain', 0, 0, 4, 'june.png', 'june.png'),
('Steamboat', 40.457201, -106.804533, 5, 'steamboat.png', 'steamboat.png'), 
('Winter Park', 39.886624, -105.763385, 6, 'winter-park.png', 'winter-park.png'),
('Stratton', 0, 0, 7, 'stratton.png', 'stratton.png'),
('Snowshoe', 0, 0, 8, 'snowshoe.png', 'snowshoe.png'),
('Tremblant', 0, 0, 9, 'tremblant.png', 'tremblant.png'),
('Blue Mountain', 0, 0, 10, 'blue-mountain.png', 'blue-mountain.png'),
('Deer Valley', 0, 0, 11, 'deer-valley.png', 'deer-valley.png')

alter table Resort add Slug nvarchar(100)
go
update Resort set Slug = replace(lower(name), ' ', '-') from Resort
alter table Resort alter column Slug nvarchar(100) not null

alter table Uplift add
	LocalDate as convert(date, LocalDateTime),
	LocalMinutes as datediff(mi, convert(date,LocalDateTime), LocalDateTime)
go

create index IX_Time on Uplift (LocalDate, LocalMinutes, LiftID) include (WaitSeconds)
go

create index IX_Resort on Lift (ResortID) include (LiftID)
go

alter table Resort add 
	Timezone varchar(100) not null constraint DF_Resort_Timezone default ''
go

alter table Track add 
	IsProcessed bit not null constraint DF_Track_Processed default 0
go

alter table Track add
	Season as cast(datepart(yyyy, dateadd(mm, -6, StartDt)) as varchar) + '-' + cast(datepart(yyyy, dateadd(mm, -6, StartDt)) + 1 as varchar)
	
alter table Uplift add
	SeasonYear as datepart(yyyy, dateadd(mm, -6, LocalDateTime)),
	Month as datepart(m, LocalDateTime),
	Day as datepart(dw, LocalDateTime),
	Hour as datepart(hh, LocalDateTime)

create spatial index IX_Route on Lift(GeoRoute);

alter table Resort add 
	LiftEnvelope geography null
go

alter table Lift add
	IsHidden bit not null constraint DF_Lift_IsHidden default (0)

alter table Resort add
	HasWaitTimes bit not null constraint DF_Resort_HasWaitTimes default(0)
