# Schema Types

<details>
  <summary><strong>Table of Contents</strong></summary>

  * [Query](#query)
  * [Mutation](#mutation)
  * [Objects](#objects)
    * [Lift](#lift)
    * [LiftList](#liftlist)
    * [LiftStation](#liftstation)
    * [LiftType](#lifttype)
    * [Location](#location)
    * [Resort](#resort)
    * [Season](#season)
    * [Uplift](#uplift)
    * [UpliftGrouping](#upliftgrouping)
    * [UpliftList](#upliftlist)
    * [WaitTime](#waittime)
    * [WaitTimeDate](#waittimedate)
    * [WaitTimePeriod](#waittimeperiod)
  * [Enums](#enums)
    * [LiftOrderBy](#liftorderby)
    * [Order](#order)
    * [UpliftGroupBy](#upliftgroupby)
    * [UpliftOrderBy](#upliftorderby)
  * [Scalars](#scalars)
    * [Boolean](#boolean)
    * [Date](#date)
    * [Float](#float)
    * [Int](#int)
    * [String](#string)

</details>

## Query 
<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>resorts</strong></td>
<td valign="top">[<a href="#resort">Resort</a>!]!</td>
<td>

Retrieve all Resorts

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>resort</strong></td>
<td valign="top"><a href="#resort">Resort</a></td>
<td>

Retrieve a single Resort by ID

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">id</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>resortBySlug</strong></td>
<td valign="top"><a href="#resort">Resort</a></td>
<td>

Retrieve a single Resort by Slug

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">slug</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>waitTimeDate</strong></td>
<td valign="top"><a href="#waittimedate">WaitTimeDate</a></td>
<td>

Retrieve Wait Time data for a Resort and Date

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">resortSlug</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">date</td>
<td valign="top"><a href="#date">Date</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>liftList</strong></td>
<td valign="top"><a href="#liftlist">LiftList</a>!</td>
<td>

Retrieve a set of ordered Lifts, optionally filtering by Lift Type, Resort, Name, and Active status

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

Number of Lifts to skip before retrieving

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

Maximum number of Lifts to retrieve

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">orderBy</td>
<td valign="top"><a href="#liftorderby">LiftOrderBy</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order</td>
<td valign="top"><a href="#order">Order</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">name</td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">typeID</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">resortID</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">isActive</td>
<td valign="top"><a href="#boolean">Boolean</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>intersectingLifts</strong></td>
<td valign="top">[<a href="#lift">Lift</a>!]</td>
<td>

Retrieve all Lifts that intersect a Bounding Box

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">topLeft</td>
<td valign="top"><a href="#locationinput">LocationInput</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">bottomRight</td>
<td valign="top"><a href="#locationinput">LocationInput</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>lift</strong></td>
<td valign="top"><a href="#lift">Lift</a></td>
<td>

Retrieve a single Lift by ID

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">id</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
</tbody>
</table>

## Mutation 
<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>createResort</strong></td>
<td valign="top"><a href="#resort">Resort</a></td>
<td>

Create a Resort

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">name</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">slug</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">logoFilename</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">trailMapFilename</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">latitude</td>
<td valign="top"><a href="#float">Float</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">longitude</td>
<td valign="top"><a href="#float">Float</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">timezone</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>updateResort</strong></td>
<td valign="top"><a href="#resort">Resort</a></td>
<td>

Update a Resort

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">id</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">name</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">slug</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">logoFilename</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">trailMapFilename</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">latitude</td>
<td valign="top"><a href="#float">Float</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">longitude</td>
<td valign="top"><a href="#float">Float</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">timezone</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>updateResortAssignedLifts</strong></td>
<td valign="top"><a href="#resort">Resort</a></td>
<td>

Update the set of Lifts assigned to a Resort

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">id</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

Resort ID

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">liftIDs</td>
<td valign="top">[<a href="#int">Int</a>!]</td>
<td>

The complete set of Lift IDs that should be assigned to the Resort. 

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>updateLift</strong></td>
<td valign="top"><a href="#lift">Lift</a></td>
<td>

Update a Lift

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">id</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">name</td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">typeID</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">resortID</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">occupancy</td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">isActive</td>
<td valign="top"><a href="#boolean">Boolean</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">station1Lat</td>
<td valign="top"><a href="#float">Float</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">station1Lng</td>
<td valign="top"><a href="#float">Float</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">station2Lat</td>
<td valign="top"><a href="#float">Float</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">station2Lng</td>
<td valign="top"><a href="#float">Float</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">station3Lat</td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">station3Lng</td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">station4Lat</td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">station4Lng</td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">station5Lat</td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">station5Lng</td>
<td valign="top"><a href="#float">Float</a></td>
<td></td>
</tr>
</tbody>
</table>

## Objects

### Lift

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>resort</strong></td>
<td valign="top"><a href="#resort">Resort</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>type</strong></td>
<td valign="top"><a href="#lifttype">LiftType</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>occupancy</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>isActive</strong></td>
<td valign="top"><a href="#boolean">Boolean</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>stations</strong></td>
<td valign="top">[<a href="#liftstation">LiftStation</a>!]!</td>
<td>

The Load and Unload stations, and any Mid stations if they exist.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>upliftList</strong></td>
<td valign="top"><a href="#upliftlist">UpliftList</a>!</td>
<td>

A set of ordered Uplifts, optionally filtered by Season, Month, Day and Hour

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">offset</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

Number of Uplifts to skip

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">limit</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

Maximum number of Uplifts to retrieve

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">orderBy</td>
<td valign="top"><a href="#upliftorderby">UpliftOrderBy</a>!</td>
<td>

How the Uplifts should be ordered

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">order</td>
<td valign="top"><a href="#order">Order</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">seasonYear</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

The Season by which to filter, e.g., 2016 = '2016 - 2017'

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">month</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

The Month by which to filter, e.g., 1 = 'January'

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">day</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

The Day by which to filter, e.g., 1 = 'Sunday'

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">hour</td>
<td valign="top"><a href="#int">Int</a></td>
<td>

The Hour by which to filter, e.g., 13 = '1PM - 2PM'

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>upliftGroupings</strong></td>
<td valign="top">[<a href="#upliftgrouping">UpliftGrouping</a>!]</td>
<td>

Aggregate Uplift Statistics, grouped by up to two dimensions

</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">groupBy</td>
<td valign="top"><a href="#upliftgroupby">UpliftGroupBy</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">groupBy2</td>
<td valign="top"><a href="#upliftgroupby">UpliftGroupBy</a></td>
<td></td>
</tr>
</tbody>
</table>

### LiftList

A page of retrieved Lifts

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>count</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

The total number of Lifts meeting the filter conditions. Can be more than the number of Lifts in the page.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>lifts</strong></td>
<td valign="top">[<a href="#lift">Lift</a>!]!</td>
<td></td>
</tr>
</tbody>
</table>

### LiftStation

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>number</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>location</strong></td>
<td valign="top"><a href="#location">Location</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### LiftType

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### Location

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>lat</strong></td>
<td valign="top"><a href="#float">Float</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>lng</strong></td>
<td valign="top"><a href="#float">Float</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### Resort

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>slug</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

A URL-friendly version of the Resort name

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>logoFilename</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>trailMapFilename</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>timezone</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>location</strong></td>
<td valign="top"><a href="#location">Location</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>liftEnvelope</strong></td>
<td valign="top">[<a href="#location">Location</a>!]</td>
<td>

The bounding polygon that encompasses all assigned Lifts

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>hasWaitTimes</strong></td>
<td valign="top"><a href="#boolean">Boolean</a>!</td>
<td>

Does the Resort have Wait Time data

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>sortOrder</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>dates</strong></td>
<td valign="top">[<a href="#waittimedate">WaitTimeDate</a>!]</td>
<td>

The dates for which Wait Time data exists

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>lastDate</strong></td>
<td valign="top"><a href="#waittimedate">WaitTimeDate</a></td>
<td>

The most recent date for which Wait Time data exists

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>lifts</strong></td>
<td valign="top">[<a href="#lift">Lift</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>upliftGroupings</strong></td>
<td valign="top">[<a href="#upliftgrouping">UpliftGrouping</a>!]</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">groupBy</td>
<td valign="top"><a href="#upliftgroupby">UpliftGroupBy</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">groupBy2</td>
<td valign="top"><a href="#upliftgroupby">UpliftGroupBy</a></td>
<td></td>
</tr>
</tbody>
</table>

### Season

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>year</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>description</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>

e.g., 2016 would be formatted as '2016 - 2017'

</td>
</tr>
</tbody>
</table>

### Uplift

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>lift</strong></td>
<td valign="top"><a href="#lift">Lift</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>season</strong></td>
<td valign="top"><a href="#season">Season</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>date</strong></td>
<td valign="top"><a href="#date">Date</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>waitSeconds</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### UpliftGrouping

Number of Uplifts and Average Wait Time cross-tabbed by up to two UpliftGroupBys.

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>groupKey</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>groupDescription</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>group2Key</strong></td>
<td valign="top"><a href="#int">Int</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>group2Description</strong></td>
<td valign="top"><a href="#string">String</a></td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>upliftCount</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>waitTimeAverage</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### UpliftList

A page of retrieved Uplifts

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>count</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>

The total number of Uplifts meeting the filter conditions. Can be more than the number of Uplifts in the page.

</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>uplifts</strong></td>
<td valign="top">[<a href="#uplift">Uplift</a>!]!</td>
<td></td>
</tr>
</tbody>
</table>

### WaitTime

Average Wait Time for a given Resort, Date, 15 minute interval, and Lift

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>liftID</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>seconds</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
</tbody>
</table>

### WaitTimeDate

Wait Time data for a given Resort and Date

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>resort</strong></td>
<td valign="top"><a href="#resort">Resort</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>date</strong></td>
<td valign="top"><a href="#date">Date</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>timePeriods</strong></td>
<td valign="top">[<a href="#waittimeperiod">WaitTimePeriod</a>!]</td>
<td></td>
</tr>
</tbody>
</table>

### WaitTimePeriod

Wait Time data for a given Resort, Date, and 15 minute interval

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>timestamp</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>resortID</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td></td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>waitTimes</strong></td>
<td valign="top">[<a href="#waittime">WaitTime</a>!]!</td>
<td></td>
</tr>
</tbody>
</table>

## Enums

### LiftOrderBy

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>NAME</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>TYPEID</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>RESORTID</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>ISACTIVE</strong></td>
<td></td>
</tr>
</tbody>
</table>

### Order

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>ASC</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>DESC</strong></td>
<td></td>
</tr>
</tbody>
</table>

### UpliftGroupBy

How to group the arregated Uplifts

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>Season</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>Month</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>Day</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>Hour</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>Lift</strong></td>
<td></td>
</tr>
</tbody>
</table>

### UpliftOrderBy

<table>
<thead>
<th align="left">Value</th>
<th align="left">Description</th>
</thead>
<tbody>
<tr>
<td valign="top"><strong>DATE</strong></td>
<td></td>
</tr>
<tr>
<td valign="top"><strong>WAITSECONDS</strong></td>
<td></td>
</tr>
</tbody>
</table>

## Scalars

### Boolean

The `Boolean` scalar type represents `true` or `false`.

### Date

### Float

The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](http://en.wikipedia.org/wiki/IEEE_floating_point). 

### Int

The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. 

### String

The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.

