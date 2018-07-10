import React from 'react';

import { Formik } from 'formik';
import * as Yup from 'yup';
import fieldProps from '../common/FormHelper';

import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

export default ({ resort, submit, close }) => {
    const model = {
        name: Yup.string().max(100).required().label('Name'),
        slug: Yup.string().max(100).required().label('Slug'),
        logoFilename: Yup.string().max(50).label('Logo filename'),
        trailMapFilename: Yup.string().max(50).label('Trail map filename'),
        latitude: Yup.number().min(-90).max(90).required().label('Latitude'),
        longitude: Yup.number().min(-180).max(180).required().label('Longitude'),
    };
    return <Formik
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
                        <TextField {...fieldProps('timezone', props) } label="Timezone" inputProps={{ size: 100, maxLength: 100 }} />
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
};
