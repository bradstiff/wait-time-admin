import React from 'react';
import { compose } from 'react-apollo';

import { Formik } from 'formik';
import * as Yup from 'yup';
import bindProps from '../../common/FormikFieldHelper';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import withWidth from '@material-ui/core/withWidth';
import { withStyles } from '@material-ui/core/styles';

import TimezoneData from '../../common/TimezoneData';

const styles = theme => ({
    root: {
        padding: theme.spacing.unit,
    }
})

const ResortForm = ({ resort, title, canEdit, submit, close, classes, width }) => {
    const model = {
        name: Yup.string().min(2).max(100).required().label('Name'),
        slug: Yup.string().min(2).max(100).required().label('Slug'),
        logoFilename: Yup.string().min(2).max(50).label('Logo filename'),
        trailMapFilename: Yup.string().min(2).max(50).label('Trail map filename'),
        latitude: Yup.number().min(-90).max(90).required().label('Latitude'),
        longitude: Yup.number().min(-180).max(180).required().label('Longitude'),
    };
    const fieldStyle = {
        width: Math.min(200, window.innerWidth - 16)
    };
    const wideFieldStyle = {
        width: Math.min(400, window.innerWidth - 16)
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
                        <div style={wideFieldStyle}>
                            <TextField {...bindProps('name', textFieldPropKeys, formProps, otherProps) } label="Name" required inputProps={{ maxLength: 100 }} />
                        </div>
                        <div style={wideFieldStyle}>
                            <TextField {...bindProps('slug', textFieldPropKeys, formProps, otherProps) } label='Slug' required inputProps={{ maxLength: 100 }} />
                        </div>
                        <div style={fieldStyle}>
                            <TextField {...bindProps('logoFilename', textFieldPropKeys, formProps, otherProps) } label="Logo filename" inputProps={{ maxLength: 50 }} />
                        </div>
                        <div style={fieldStyle}>
                            <TextField {...bindProps('trailMapFilename', textFieldPropKeys, formProps, otherProps) } label="Trail map filename" inputProps={{ maxLength: 50 }} />
                        </div>
                        <div style={wideFieldStyle}>
                            <TextField {...bindProps('timezone', textFieldPropKeys, formProps, otherProps) } label="Time zone" select >
                                {TimezoneData.map(timezone => (
                                    <MenuItem key={timezone.id} value={timezone.id}>
                                        {timezone.description}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div style={fieldStyle}>
                            <TextField {...bindProps('latitude', textFieldPropKeys, formProps, otherProps) } label="Latitude" />
                        </div>
                        <div style={fieldStyle}>
                            <TextField {...bindProps('longitude', textFieldPropKeys, formProps, otherProps) } label="Longitude" />
                        </div>
                    </form>
                )
            }}
        />
    </Paper>
};

export default compose(
    withStyles(styles),
    withWidth()
)(ResortForm);