import warning from 'warning';

//automatically bind requested Mui field props to Formik API props
//reduces boilerplate

export default (name, fieldPropKeys, formikProps) => {
    const props = {
        name,
    };
    for (const propKey of fieldPropKeys) {
        if (['value', 'checked'].includes(propKey)) {
            warning(formikProps.values, "Formik 'values' prop not provided");
            props[propKey] = formikProps.values[name];
        } else if (['error', 'helperText'].includes(propKey)) {
            warning(formikProps.touched, "Formik 'touched' prop not provided");
            warning(formikProps.errors, "Formik 'errors' prop not provided");
            props[propKey] = formikProps.touched[name] && formikProps.errors[name];
        } else if (propKey === 'onChange') {
            warning(formikProps.handleChange, "Formik 'handleChange' prop not provided");
            props.onChange = formikProps.handleChange;
        } else if (propKey === 'onBlur') {
            if (formikProps.setFieldTouched) {
                props.onBlur = () => formikProps.setFieldTouched(name);
            } else if (formikProps.onBlur) {
                props.onBlur = formikProps.handleBlur;
            } else {
                warning(true, "Neither 'handleBlur' nor 'setFieldTouched' Formik props provided");
            }
        } else {
            warning(true, `'${propKey}' is not a supported fieldPropKey.`);
        }
    }
    return props;
}

