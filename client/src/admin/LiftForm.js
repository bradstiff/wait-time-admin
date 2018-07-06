import React from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import LiftTypeData from '../common/LiftTypeData';
import ResortData from '../common/ResortData';

export default ({ lift, submit, close }) => {
    const fields = {
        name: { name: 'name', label: 'Name', required: true, width: 100, maxLength: 100 },
        typeID: { name: 'typeID', label: 'Type', type: 'select', required: true, width: 100, options: LiftTypeData.map(type => ({ value: type.id, text: type.description })) },
        occupancy: { name: 'occupancy', label: 'Occupancy', type: 'number', width: 45 },
        resortID: { name: 'resortID', label: 'Resort', type: 'select', width: 100, optionsComponent: ResortData },
        isActive: { name: 'isActive', label: 'Active', type: 'checkbox' },
    };
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
        //add lat and lng fields for each station
        fields[station.latField] = { name: station.latField, label: station.latLabel, required: true, size: 45, type: 'number' };
        model[station.latField] = Yup.number().min(-90).max(90).required().label(station.latLabel);

        fields[station.lngField] = { name: station.lngField, label: station.lngLabel, required: true, size: 45, type: 'number' };
        model[station.lngField] = Yup.number().min(-180).max(180).required().label(station.lngLabel);
    });

    return <Formik
        initialValues={lift}
        validationSchema={Yup.object().shape(model)}
        onSubmit={submit}
        render={({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldTouched,
            handleSubmit,
            isSubmitting,
        }) => {
            const makeFormField = field => {
                let fieldProps = {
                    key: field.name,
                    name: field.name,
                    margin: 'normal',
                    onChange: handleChange,
                    onBlur: () => setFieldTouched(field.name), //the event target for a mui Select is the Menu, not the Input to which the name prop is assigned
                };

                if (field.type === 'checkbox') {
                    return <FormControlLabel
                        control={
                            <Checkbox {...fieldProps} checked={values[field.name]} />
                        }
                        label={field.label}
                    />
                } 

                fieldProps = {
                    label: field.label,
                    value: values[field.name],
                    required: field.required,
                    onBlur: () => setFieldTouched(field.name), //the event target for a mui Select is the Menu, not the Input to which the name prop is assigned
                    ...fieldProps,
                };

                if (field.type === 'select') {
                    let elementProps = {};
                    if (field.width) {
                        elementProps.width = field.width + 'px';
                    }
                    if (field.options) {
                        return <TextField
                            select
                            SelectProps={{ SelectDisplayProps: elementProps }}
                            {...fieldProps}
                        >
                            {field.options.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.text}
                                </MenuItem>))
                            }
                        </TextField>
                    } else if (field.optionsComponent) {
                        const Options = field.optionsComponent;
                        return <Options>
                            {({ options }) => (
                                options && <TextField
                                    select
                                    SelectProps={{ SelectDisplayProps: elementProps }}
                                    {...fieldProps}
                                >
                                    {options.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.text}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        </Options>
                    } else {
                        //error
                    }
                } else {
                    let elementProps = {};
                    if (field.width) {
                        elementProps.size = field.width;
                    }
                    if (field.maxLength) {
                        elementProps.maxLength = field.maxLength;
                    }
                    return (
                        <TextField
                            inputProps={elementProps}
                            {...fieldProps}
                        />
                    );
                }
            };
            return (
                <form onSubmit={handleSubmit}>
                    <div>{makeFormField(fields.name)}</div>
                    <div>{makeFormField(fields.typeID)}</div>
                    <div>{makeFormField(fields.occupancy)}</div>
                    <div>{makeFormField(fields.resortID)}</div>
                    {stationMeta.map(station => (
                        <div>{makeFormField(fields[station.latField])} {makeFormField(fields[station.lngField])}</div>
                    ))}
                    <div>{makeFormField(fields.isActive)}</div>
                    <Button color='primary' disabled={isSubmitting} onClick={close}>Cancel</Button>
                    <Button type='submit' variant='contained' color='primary' disabled={isSubmitting}>Save</Button>
                </form>
            );
        }}
    />
};
