import React from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import bindProps from '../common/FormikFieldHelper';

import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';

import LiftTypeData from '../common/LiftTypeData';
import ResortData from '../common/ResortData';

const styles = theme => ({
    root: {
        padding: theme.spacing.unit,
    },
})

const LiftForm = ({ lift, submit, close, title, classes }) => {
    const model = {
        name: Yup.string().min(2).max(100).required().label('Name'),
        typeID: Yup.number().integer().required().label('Type'),
        occupancy: Yup.number().integer().positive().nullable().label('Occupancy'),
        resortID: Yup.number().integer().nullable().label('Resort'),
    };
    const stationMeta = lift.stations
        .map(station => ({
            name: station.name,
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

    return <Paper className={classes.root}>
        <Formik
            initialValues={lift}
            validationSchema={Yup.object().shape(model)}
            onSubmit={submit}
            render={formikProps => {
                const { handleSubmit, isSubmitting, } = formikProps;
                const textFieldPropKeys = ['value', 'error', 'helperText', 'onChange', 'onBlur'];

                return (
                    <form onSubmit={handleSubmit}>
                        <Toolbar>
                            <Typography variant='headline' style={{ flex: 'auto' }}>{title}</Typography>
                            <Button color='primary' disabled={isSubmitting} onClick={close}>Cancel</Button>
                            <Button color='primary' variant='outlined' type='submit' disabled={isSubmitting}>Save</Button>
                        </Toolbar>
                        <div><TextField {...bindProps('name', textFieldPropKeys, formikProps) } label='Name' required style={{ width: 400 }} inputProps={{ maxLength: 100 }} margin='normal' /></div>
                        <div>
                            <TextField {...bindProps('typeID', textFieldPropKeys, formikProps) } label='Type' select required style={{ width: 200 }} margin='normal' > 
                                {LiftTypeData.map(type => (
                                    <MenuItem key={type.id} value={type.id}>
                                        {type.description}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div><TextField {...bindProps('occupancy', textFieldPropKeys, formikProps) } label='Occupancy' style={{ width: 200 }} margin='normal' /></div>
                        <div>
                            <ResortData>
                                {({ options }) => (
                                    <TextField {...bindProps('resortID', textFieldPropKeys, formikProps) } label='Resort' select style={{ width: 400 }} margin='normal' >
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
                            <div key={station.name}>
                                <TextField {...bindProps(station.latField, textFieldPropKeys, formikProps) } label={station.latLabel} required style={{ width: 195 }} margin='normal' />
                                <TextField {...bindProps(station.lngField, textFieldPropKeys, formikProps) } label={station.lngLabel} required style={{ width: 195, marginLeft: 10 }} margin='normal' />
                            </div>
                        ))}
                        <div><FormControlLabel control={<Checkbox {...bindProps('isActive', ['checked', 'onChange'], formikProps) } />} label='Active' margin='normal'/></div>
                    </form>
                );
            }}
        />
    </Paper>
};

export default withStyles(styles)(LiftForm);