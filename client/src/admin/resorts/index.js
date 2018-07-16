import React from 'react';
import * as Yup from 'yup';

import ResourceController from '../../common/ResourceController';
import ResortNotFound from '../../app/ResortNotFound';

import Resort, { query as ResortQuery } from './Resort';
import ResortEdit, { query as ResortEditQuery } from './ResortEdit';
import ResortLifts, { query as ResortLiftsQuery } from './ResortLifts';
import ResortStats, { query as ResortStatsQuery } from './ResortStats';

const intIdentifier = Yup.number().integer().positive().required();

const ResortController = () => <ResourceController
    component={Resort}
    routeParams={{ id: intIdentifier }}
    queryDef={{ query: ResortQuery, root: 'resort' }}
    notFound={ResortNotFound}
/>;

const ResortEditController = () => <ResourceController
    component={ResortEdit}
    routeParams={{ id: intIdentifier }}
    queryDef={{ query: ResortEditQuery, root: 'resort' }}
    notFound={ResortNotFound}
/>;

const ResortLiftsController = () => <ResourceController
    component={ResortLifts}
    routeParams={{ id: intIdentifier }}
    queryDef={{ query: ResortLiftsQuery, root: 'resort' }}
    notFound={ResortNotFound}
/>;

const ResortStatsController = () => <ResourceController
    component={ResortStats}
    routeParams={{
        id: intIdentifier,
        groupBy: Yup.string().oneOf(['Season', 'Month', 'Day', 'Hour', 'Lift']).default('Season'),
    }}
    queryDef={{ query: ResortStatsQuery, root: 'resort' }}
    notFound={ResortNotFound}
/>;

export {
    ResortController,
    ResortEditController,
    ResortLiftsController,
    ResortStatsController,
};