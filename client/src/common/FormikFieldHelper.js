import warning from 'warning';

//Automatically bind requested Mui field props to Formik API props. Reduces boilerplate.

export default (name, fieldPropKeys, formikProps) => {
    const boundProps = {
        name,
    };
    for (const propKey of fieldPropKeys) {
        if (['value', 'checked'].includes(propKey)) {
            warning(formikProps.values, "Formik 'values' prop not provided");
            boundProps[propKey] = formikProps.values[name];
        } else if (['error', 'helperText'].includes(propKey)) {
            warning(formikProps.touched, "Formik 'touched' prop not provided");
            warning(formikProps.errors, "Formik 'errors' prop not provided");
            boundProps[propKey] = formikProps.touched[name] && formikProps.errors[name];
        } else if (propKey === 'onChange') {
            warning(formikProps.handleChange, "Formik 'handleChange' prop not provided");
            boundProps.onChange = formikProps.handleChange;
        } else if (propKey === 'onBlur') {
            if (formikProps.setFieldTouched) {
                boundProps.onBlur = () => formikProps.setFieldTouched(name);
            } else if (formikProps.onBlur) {
                boundProps.onBlur = formikProps.handleBlur;
            } else {
                warning(true, "Neither 'handleBlur' nor 'setFieldTouched' Formik props provided");
            }
        } else {
            warning(true, `'${propKey}' is not a supported fieldPropKey.`);
        }
    }
    return boundProps;
}

