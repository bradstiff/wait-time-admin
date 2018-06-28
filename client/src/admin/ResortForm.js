import React from 'react';
import { Formik, Field, Form } from 'formik';
import { Map, TileLayer, Marker } from 'react-leaflet'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const location = [46, -90];
export default ({ resort, submit, close }) => (
    <Formik
        initialValues={resort}
        validate={values => {
            let errors = {};
            if (!values.name) {
                errors.name = 'Required';
            }
            if (!values.slug) {
                errors.slug = 'Required';
            }
            return errors;
        }}
        onSubmit={submit}
        render={({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
        }) => (
                <form onSubmit={handleSubmit}>
                    <TextField
                        type="text"
                        name="name"
                        label="Name"
                        margin='dense'
                        required
                        inputProps={{ size: 100, maxLength: 100}}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                        error={touched.name && errors.name}
                        helperText={touched.name && errors.name}
                    /><br />
                    <TextField
                        type="text"
                        name="slug"
                        label="Slug"
                        margin='dense'
                        required
                        inputProps={{ size: 100, maxLength: 100 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.slug}
                        error={touched.slug && errors.slug}
                        helperText={touched.slug && errors.slug}
                    /><br />
                    <TextField
                        type="text"
                        name="logoFilename"
                        label="Logo Filename"
                        margin='dense'
                        inputProps={{size:50, maxLength:50}}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.logoFilename}
                        helperText={touched.logoFilename && errors.logoFilename}
                    /><br />
                    <TextField
                        type="text"
                        name="trailMapFilename"
                        label="Trail Map Filename"
                        margin='dense'
                        inputProps={{ size: 50, maxLength: 50 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.trailMapFilename}
                        helperText={touched.trailMapFilename && errors.trailMapFilename}
                    /><br />
                    <TextField
                        type="text"
                        name="timezone"
                        label="Timezone"
                        margin='dense'
                        inputProps={{ size: 100, maxLength: 100 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.timezone}
                        helperText={touched.timezone && errors.timezone}
                    /><br />
                    <TextField
                        type="text"
                        name="latitude"
                        label="Latitude"
                        margin='dense'
                        inputProps={{ size: 100, maxLength: 100 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.latitude}
                        helperText={touched.latitude && errors.latitude}
                    /><br />
                    <TextField
                        type="text"
                        name="longitude"
                        label="Longitude"
                        margin='dense'
                        inputProps={{ size: 100, maxLength: 100 }}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.longitude}
                        helperText={touched.longitude && errors.longitude}
                    /><br />
                    <Button color='primary' disabled={isSubmitting} onClick={close}>Cancel</Button>
                    <Button type='submit' variant='contained' color='primary' disabled={isSubmitting}>Save</Button>
                </form>
            )}
    />
);
