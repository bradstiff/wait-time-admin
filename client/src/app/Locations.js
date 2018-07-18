import * as Yup from 'yup';
import Location from '../common/Location';

const integer = Yup.number().integer();
const intIdentifier = integer.positive().required();
const intIndex = integer.moreThan(-1);
const order = Yup.oneOf(['asc', 'desc']).default('asc');

const Locations = {
    Resorts: new Location('/admin/resorts'),
    Resort: new Location('/admin/resorts/:id', { id: intIdentifier }),
    ResortEdit: new Location('/admin/resorts/:id/edit', { id: intIdentifier }),
    ResortLifts: new Location('/admin/resorts/:id/lifts', { id: intIdentifier }),
    ResortStats: new Location('/admin/resorts/:id/stats', { id: intIdentifier }, { groupBy: Yup.string().default('Season') }),
    Lifts: new Location('/admin/lifts', null, {
        page: intIndex.required(),
        rowsPerPage: Yup.oneOf([25, 50, 75, 100]).required(),
        order: order,
        orderBy: Yup.oneOf(['name', 'typeID', 'resortID', 'isActive']).default('name'),
        showFilter: Yup.boolean().default(false),
        isActive: Yup.boolean().default(true),
        typeID: intIdentifier,
        resortID: intIdentifier,
        name: Yup.string(),
    }),
    Lift: new Location('/admin/lifts/:id', { id: intIdentifier }),
    LiftEdit: new Location('/admin/lifts/:id/edit', { id: intIdentifier }),
    LiftUplifts: new Location('/admin/lifts/:id/uplifts', { id: intIdentifier }),
    LiftStats: new Location('/admin/lifts/:id/stats', { id: intIdentifier }, { groupBy: Yup.string().default('Season') }),
};

console.log('Locations created');

export default Locations;
