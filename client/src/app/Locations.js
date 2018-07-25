import * as Yup from 'yup';
import Location from '../common/Location';

const isNullableDate = Yup.string().test('is-date', '${path}:${value} is not a valid date', date => !date || !isNaN(Date.parse(date))); 
const string = Yup.string();
const integer = Yup.number().integer();
const naturalNbr = integer.moreThan(-1);
const wholeNbr = integer.positive();
const identity = wholeNbr.required();
const order = Yup.string().oneOf(['asc', 'desc']).default('asc');

const Locations = {
    Home: new Location('/'),
    WaitTime: new Location('/resorts/:slug?', { slug: string.required() }, { date: isNullableDate }), //validate the date but don't parse it; we will parse it later as utc
    Resorts: new Location('/admin/resorts'),
    Resort: new Location('/admin/resorts/:id', { id: identity }),
    ResortDetails: new Location('/admin/resorts/:id/details', { id: identity }),
    ResortLifts: new Location('/admin/resorts/:id/lifts', { id: identity }),
    ResortStats: new Location('/admin/resorts/:id/stats', { id: identity }, {
        groupBy: Yup.string().oneOf(['Season', 'Month', 'Day', 'Hour', 'Lift']).default('Season')
    }),
    Lifts: new Location('/admin/lifts', null, {
        page: naturalNbr.default(0),
        rowsPerPage: Yup.number().oneOf([25, 50, 75, 100]).default(25),
        order: order,
        orderBy: Yup.string().oneOf(['name', 'typeID', 'resortID', 'isActive']).default('name'),
        showFilter: Yup.boolean().default(false),
        isActive: Yup.boolean().default(true),
        typeID: wholeNbr,
        resortID: wholeNbr.nullable(), //'No resort assigned' is equivalent to ResortID=null
        name: Yup.string(),
    }),
    Lift: new Location('/admin/lifts/:id', { id: identity }),
    LiftDetails: new Location('/admin/lifts/:id/details', { id: identity }),
    LiftUplifts: new Location('/admin/lifts/:id/uplifts', { id: identity }, {
        page: naturalNbr.default(0),
        rowsPerPage: Yup.number().oneOf([25, 50, 75, 100]).default(25),
        order: order,
        orderBy: Yup.string().oneOf(['date', 'waitSeconds',]).default('date'),
        showFilter: Yup.boolean().default(false),
        seasonYear: wholeNbr,
        month: wholeNbr,
        day: wholeNbr,
        hour: wholeNbr,
    }),
    LiftStats: new Location('/admin/lifts/:id/stats', { id: identity }, {
        groupBy: Yup.string().oneOf(['Season', 'Month', 'Day', 'Hour']).default('Season')
    }),
};

export default Locations;
