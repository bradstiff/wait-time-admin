//generates the name-driven and generic props for a Formik field
const textFieldProps = (name, formProps) => ({
    name,
    value: formProps.values[name],
    error: formProps.touched[name] && formProps.errors[name],
    helperText: formProps.touched[name] && formProps.errors[name],
    onChange: formProps.handleChange,
    onBlur: () => formProps.setFieldTouched(name),
    margin: 'normal',
});

const checkboxProps = (name, formProps) => ({
    name,
    onChange: formProps.handleChange,
    onBlur: () => formProps.setFieldTouched(name),
    margin: 'normal',
});

export { textFieldProps, checkboxProps };