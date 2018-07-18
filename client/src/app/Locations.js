import * as Yup from 'yup';
import Location from '../common/Location';

const intIdentifier = Yup.number().integer().positive().required();

export default {
    Resorts: new Location('/admin/resorts'),
    Resort: new Location('/admin/resorts/:id', { id: intIdentifier }),
    ResortEdit: new Location('/admin/resorts/:id/edit', { id: intIdentifier }),
    ResortLifts: new Location('/admin/resorts/:id/lifts', { id: intIdentifier }),
    ResortStats: new Location('/admin/resorts/:id/stats', { id: intIdentifier }, { groupBy: Yup.string().default('Season') }),
}
