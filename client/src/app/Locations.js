import * as Yup from 'yup';
import Location from '../common/Location';

const integer = Yup.number().integer();
const naturalNbr = integer.moreThan(-1);
const wholeNbr = integer.positive();
const identity = wholeNbr.required();
const order = Yup.string().oneOf(['asc', 'desc']).default('asc');

const Locations = {
    Resorts: new Location('/admin/resorts'),
    Resort: new Location('/admin/resorts/:id', { id: identity }),
    ResortEdit: new Location('/admin/resorts/:id/edit', { id: identity }),
    ResortLifts: new Location('/admin/resorts/:id/lifts', { id: identity }),
    ResortStats: new Location('/admin/resorts/:id/stats', { id: identity }, { groupBy: Yup.string().default('Season') }),
    Lifts: new Location('/admin/lifts', null, {
        page: naturalNbr.default(0),
        rowsPerPage: Yup.number().oneOf([25, 50, 75, 100]).default(25),
        order: order,
        orderBy: Yup.string().oneOf(['name', 'typeID', 'resortID', 'isActive']).default('name'),
        showFilter: Yup.boolean().default(false),
        isActive: Yup.boolean().default(true),
        typeID: wholeNbr,
        resortID: wholeNbr,
        name: Yup.string(),
    }),
    Lift: new Location('/admin/lifts/:id', { id: identity }),
    LiftEdit: new Location('/admin/lifts/:id/edit', { id: identity }),
    LiftUplifts: new Location('/admin/lifts/:id/uplifts', { id: identity }),
    LiftStats: new Location('/admin/lifts/:id/stats', { id: identity }, { groupBy: Yup.string().default('Season') }),
};

console.log('Locations created');

export default Locations;
