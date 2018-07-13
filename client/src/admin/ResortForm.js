import React from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import { textFieldProps } from '../common/FormHelper';

import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import TimezoneData from '../common/TimezoneData';

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
            render={props => {
                const { handleSubmit, isSubmitting, } = props;
                return (
                    <form onSubmit={handleSubmit}>
                        <Toolbar>
                            <Typography variant='headline' style={{ flex: 'auto' }}>{title}</Typography>
                            <Button color='primary' disabled={isSubmitting} onClick={close}>Cancel</Button>
                            <Button color='primary' variant='outlined' type='submit' disabled={isSubmitting}>Save</Button>
                        </Toolbar>
                        <div>
                            <TextField {...textFieldProps('name', props, 100) } label="Name" required style={{ width: 400 }} />
                        </div>
                        <div>
                            <TextField {...textFieldProps('slug', props, 100) } label='Slug' required style={{ width: 400 }} />
                        </div>
                        <div>
                            <TextField {...textFieldProps('logoFilename', props, 50) } label="Logo filename" style={{ width: 200 }} />
                        </div>
                        <div>
                            <TextField {...textFieldProps('trailMapFilename', props, 50) } label="Trail map filename" style={{ width: 200 }} />
                        </div>
                        <div>
                            <TextField {...textFieldProps('timezone', props) } label="Time zone" select style={{ width: 400 }}>
                                {TimezoneData.map(timezone => (
                                    <MenuItem key={timezone.id} value={timezone.id}>
                                        {timezone.description}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div>
                            <TextField {...textFieldProps('latitude', props) } label="Latitude" style={{ width: 200 }} />
                        </div>
                        <div>
                            <TextField {...textFieldProps('longitude', props) } label="Longitude" style={{ width: 200 }} />
                        </div>
                    </form>
                )
            }}
        />
    </Paper>
};

export default withStyles(styles)(ResortForm);