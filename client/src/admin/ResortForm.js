import React from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import fieldProps from '../common/FormHelper';

import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

import TimezoneData from '../common/TimezoneData';

const styles = theme => ({
    root: {
        padding: theme.spacing.unit,
    }
})

const ResortForm = ({ resort, submit, close, classes }) => {
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
                const { values, handleSubmit, isSubmitting, } = props;
                return (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <TextField {...fieldProps('name', props) } label="Name" required inputProps={{ size: 100, maxLength: 100 }} />
                        </div>
                        <div>
                            <TextField {...fieldProps('slug', props) } label='Slug' required inputProps={{ size: 100, maxLength: 100 }} />
                        </div>
                        <div>
                            <TextField {...fieldProps('logoFilename', props) } label="Logo filename" inputProps={{ size: 50, maxLength: 50 }} />
                        </div>
                        <div>
                            <TextField {...fieldProps('trailMapFilename', props) } label="Trail map filename" inputProps={{ size: 50, maxLength: 50 }} />
                        </div>
                        <div>
                            <TextField {...fieldProps('timezone', props) } label="Time zone" select>
                                {TimezoneData.map(timezone => (
                                    <MenuItem key={timezone.id} value={timezone.id}>
                                        {timezone.description}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <div>
                            <TextField {...fieldProps('latitude', props) } label="Latitude" inputProps={{ size: 100, maxLength: 100 }} />
                        </div>
                        <div>
                            <TextField {...fieldProps('longitude', props) } label="Longitude" inputProps={{ size: 100, maxLength: 100 }} />
                        </div>
                        <Button color='primary' disabled={isSubmitting} onClick={close}>Cancel</Button>
                        <Button type='submit' variant='contained' color='primary' disabled={isSubmitting}>Save</Button>
                    </form>
                )
            }}
        />
    </Paper>
};

export default withStyles(styles)(ResortForm);