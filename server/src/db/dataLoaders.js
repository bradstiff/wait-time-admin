import { makeDataLoaders as makeLiftDataLoaders } from './Lift';
import { makeDataLoaders as makeResortDataLoaders } from './Resort';

export default (db) => Object.assign({}, 
    makeLiftDataLoaders(db),
    makeResortDataLoaders(db),
);
