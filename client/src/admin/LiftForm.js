import React from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import fieldProps from '../common/FormHelper';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';

import LiftTypeData from '../common/LiftTypeData';
import ResortData from '../common/ResortData';

export default ({ lift, submit, close }) => {
    const model = {
        name: Yup.string().required().label('Name'),
        typeID: Yup.number().integer().required().label('Type'),
        occupancy: Yup.number().integer().positive().label('Occupancy'),
        resortID: Yup.number().integer().label('Resort'),
    };
    const stationMeta = lift.stations
        .map(station => ({
            latField: `station${station.number}Lat`,
            latLabel: station.name + ' latitude',
            lngField: `station${station.number}Lng`,
            lngLabel: station.name + ' longitude',
        }));
    stationMeta.forEach(station => {
        //a lift has between two and five stations, each with lat and lng
        //flatten them into individual field names
        model[station.latField] = Yup.number().min(-90).max(90).required().label(station.latLabel);
        model[station.lngField] = Yup.number().min(-180).max(180).required().label(station.lngLabel);
    });

    return <Formik
        initialValues={lift}
        validationSchema={Yup.object().shape(model)}
        onSubmit={submit}
        render={props => {
            const { values, handleSubmit, isSubmitting, } = props;
            return (
                <form onSubmit={handleSubmit}>
                    <div><TextField {...fieldProps('name', props) } label='Name' required width={100} maxLength={100} /></div>
                    <div>
                        <TextField {...fieldProps('typeID', props) } label='Type' select required > 
                            {LiftTypeData.map(type => (
                                <MenuItem key={type.id} value={type.id}>
                                    {type.description}
                                </MenuItem>
                            ))}
                        </TextField>
                    </div>
                    <div><TextField {...fieldProps('occupancy', props) } label='Occupancy' /></div>
                    <div>
                        <ResortData>
                            {({ options }) => (
                                <TextField {...fieldProps('resortID', props) } label='Resort' select required >
                                    {options && options.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.text}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        </ResortData>
                    </div>
                    {stationMeta.map(station => (
                        <div>
                            <TextField {...fieldProps(station.latField, props) } label={station.latLabel} required />
                            <TextField {...fieldProps(station.lngField, props) } label={station.lngLabel} required />
                        </div>
                    ))}
                    <div><FormControlLabel control={<Checkbox {...fieldProps('isActive', props) } checked={values.isActive} />} label='Active' /></div>
                    <Button color='primary' disabled={isSubmitting} onClick={close}>Cancel</Button>
                    <Button type='submit' variant='contained' color='primary' disabled={isSubmitting}>Save</Button>
                </form>
            );
        }}
    />
};
