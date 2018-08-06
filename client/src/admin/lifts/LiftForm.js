import React from 'react';
import { compose } from 'react-apollo';

import { Formik } from 'formik';
import * as Yup from 'yup';
import bindProps from '../../common/FormikFieldHelper';

import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import MenuItem from '@material-ui/core/MenuItem';
import withWidth from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';

import LiftTypeData from '../../common/LiftTypeData';
import ResortData from '../../common/ResortData';

const styles = theme => ({
    root: {
        padding: theme.spacing.unit,
    },
})

const LiftForm = ({ lift, title, canEdit, submit, close, classes, width }) => {
    const model = {
        name: Yup.string().min(2).max(100).required().label('Name'),
        typeID: Yup.number().integer().required().label('Type'),
        occupancy: Yup.number().integer().positive().nullable().label('Occupancy'),
        resortID: Yup.number().integer().nullable().label('Resort'),
    };
    const stationMeta = lift.stations
        .map(station => ({
            number: station.number,
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
    const fieldStyle = {
        width: Math.min(200, window.innerWidth - 16)
    };
    const wideFieldStyle = {
        width: Math.min(400, window.innerWidth - 16)
    };
    return <Paper className={classes.root}>
        <Formik
            initialValues={lift}
            validationSchema={Yup.object().shape(model)}
            onSubmit={submit}
            render={formikProps => {
                const { handleSubmit, isSubmitting, } = formikProps;
                const textFieldPropKeys = ['value', 'error', 'helperText', 'onChange', 'onBlur', 'disabled'];
                const formProps = {
                    ...formikProps,
                    disabled: !canEdit,
                };
                const otherProps = {
                    margin: 'normal',
                    fullWidth: true,
                };
                return (
                    <form onSubmit={handleSubmit}>
                        <Toolbar>
                            <Typography variant='headline' style={{ flex: 'auto' }}>{title}</Typography>
                            <Button color='primary' disabled={isSubmitting} onClick={close}>{canEdit ? 'Cancel' : 'Close'}</Button>
                            {canEdit && <Button color='primary' variant='outlined' type='submit' disabled={isSubmitting}>Save</Button>}
                        </Toolbar>
                        <div style={wideFieldStyle}><TextField {...bindProps('name', textFieldPropKeys, formProps, otherProps) } label='Name' required inputProps={{ maxLength: 100 }} /></div>
                        <div style={fieldStyle}>
                            <TextField {...bindProps('typeID', textFieldPropKeys, formProps, otherProps) } label='Type' select required > 
                                {LiftTypeData.map(type => (
                                    <MenuItem key={type.id} value={type.id}>
                                        {type.description}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div style={fieldStyle}><TextField {...bindProps('occupancy', textFieldPropKeys, formProps, otherProps) } label='Occupancy' /></div>
                        <div style={wideFieldStyle}>
                            <ResortData>
                                {({ options }) => (
                                    <TextField {...bindProps('resortID', textFieldPropKeys, formProps, otherProps) } label='Resort' select >
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
                            <div key={station.number} style={{ ...wideFieldStyle, display: 'flex' }}>
                                <div style={{ flex: 'auto' }}>
                                    <TextField {...bindProps(station.latField, textFieldPropKeys, formProps, otherProps) } label={station.latLabel} required />
                                </div>
                                <div style={{flex: 'none', width: 8}}></div>
                                <div style={{ flex: 'auto' }}>
                                    <TextField {...bindProps(station.lngField, textFieldPropKeys, formProps, otherProps) } label={station.lngLabel} required />
                                </div>
                            </div>
                        ))}
                        <div style={fieldStyle}><FormControlLabel control={<Checkbox {...bindProps('isActive', ['checked', 'onChange', 'disabled'], formProps, otherProps) } />} label='Active' /></div>
                    </form>
                );
            }}
        />
    </Paper>
};

export default compose(
    withStyles(styles),
    withWidth()
)(LiftForm);