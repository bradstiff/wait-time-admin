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

const ResortForm = ({ resort, title, canEdit, submit, close, classes }) => {
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
                const formProps = {
                    ...formikProps,
                    disabled: !canEdit,
                };
                const textFieldPropKeys = ['value', 'error', 'helperText', 'onChange', 'onBlur', 'disabled',];
                return (
                    <form onSubmit={handleSubmit}>
                        <Toolbar>
                            <Typography variant='headline' style={{ flex: 'auto' }}>{title}</Typography>
                            <Button color='primary' disabled={isSubmitting} onClick={close}>{canEdit ? 'Cancel' : 'Close'}</Button>
                            {canEdit && <Button color='primary' variant='outlined' type='submit' disabled={isSubmitting}>Save</Button>}
                        </Toolbar>
                        <div>
                            <TextField {...bindProps('name', textFieldPropKeys, formProps) } label="Name" required style={{ width: 400 }} inputProps={{ maxLength: 100 }} margin='normal' />
                        </div>
                        <div>
                            <TextField {...bindProps('slug', textFieldPropKeys, formProps) } label='Slug' required style={{ width: 400 }} inputProps={{ maxLength: 100 }} margin='normal' />
                        </div>
                        <div>
                            <TextField {...bindProps('logoFilename', textFieldPropKeys, formProps) } label="Logo filename" style={{ width: 200 }} inputProps={{ maxLength: 50 }} margin='normal' />
                        </div>
                        <div>
                            <TextField {...bindProps('trailMapFilename', textFieldPropKeys, formProps) } label="Trail map filename" style={{ width: 200 }} inputProps={{ maxLength: 50 }} margin='normal' />
                        </div>
                        <div>
                            <TextField {...bindProps('timezone', textFieldPropKeys, formProps) } label="Time zone" select style={{ width: 400 }} margin='normal' >
                                {TimezoneData.map(timezone => (
                                    <MenuItem key={timezone.id} value={timezone.id}>
                                        {timezone.description}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div>
                            <TextField {...bindProps('latitude', textFieldPropKeys, formProps) } label="Latitude" style={{ width: 200 }} margin='normal' />
                        </div>
                        <div>
                            <TextField {...bindProps('longitude', textFieldPropKeys, formProps) } label="Longitude" style={{ width: 200 }} margin='normal' />
                        </div>
                    </form>
                )
            }}
        />
    </Paper>
};

export default withStyles(styles)(ResortForm);