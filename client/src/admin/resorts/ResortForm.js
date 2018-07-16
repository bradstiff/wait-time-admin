import React from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import bindProps from '../../common/FormikFieldHelper';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import TimezoneData from '../../common/TimezoneData';

const styles = theme => ({
    root: {
        padding: theme.spacing.unit,
    }
})

const ResortForm = ({ resort, submit, close, title, classes }) => {
    const model = {
        name: Yup.string().min(2).max(100).required().label('Name'),
        slug: Yup.string().min(2).max(100).required().label('Slug'),
        logoFilename: Yup.string().min(2).max(50).label('Logo filename'),
        trailMapFilename: Yup.string().min(2).max(50).label('Trail map filename'),
        latitude: Yup.number().min(-90).max(90).required().label('Latitude'),
        longitude: Yup.number().min(-180).max(180).required().label('Longitude'),
    };
    return <Paper className={classes.root}>
        <Formik
            initialValues={resort}
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
                        <div>
                            <TextField {...bindProps('name', textFieldPropKeys, formikProps) } label="Name" required style={{ width: 400 }} inputProps={{ maxLength: 100 }} margin='normal' />
                        </div>
                        <div>
                            <TextField {...bindProps('slug', textFieldPropKeys, formikProps) } label='Slug' required style={{ width: 400 }} inputProps={{ maxLength: 100 }} margin='normal' />
                        </div>
                        <div>
                            <TextField {...bindProps('logoFilename', textFieldPropKeys, formikProps) } label="Logo filename" style={{ width: 200 }} inputProps={{ maxLength: 50 }} margin='normal' />
                        </div>
                        <div>
                            <TextField {...bindProps('trailMapFilename', textFieldPropKeys, formikProps) } label="Trail map filename" style={{ width: 200 }} inputProps={{ maxLength: 50 }} margin='normal' />
                        </div>
                        <div>
                            <TextField {...bindProps('timezone', textFieldPropKeys, formikProps) } label="Time zone" select style={{ width: 400 }} margin='normal' >
                                {TimezoneData.map(timezone => (
                                    <MenuItem key={timezone.id} value={timezone.id}>
                                        {timezone.description}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div>
                            <TextField {...bindProps('latitude', textFieldPropKeys, formikProps) } label="Latitude" style={{ width: 200 }} margin='normal' />
                        </div>
                        <div>
                            <TextField {...bindProps('longitude', textFieldPropKeys, formikProps) } label="Longitude" style={{ width: 200 }} margin='normal' />
                        </div>
                    </form>
                )
            }}
        />
    </Paper>
};

export default withStyles(styles)(ResortForm);