//generates the name-driven and generic props for a Formik field
const textFieldProps = (name, formProps, maxLength) => {
    const props = {
        name,
        value: formProps.values[name],
        error: formProps.touched[name] && formProps.errors[name],
        helperText: formProps.touched[name] && formProps.errors[name],
        onChange: formProps.handleChange,
        onBlur: () => formProps.setFieldTouched(name),
        margin: 'normal',
    };
    if (maxLength) {
        props.inputProps = { maxLength };
    }
    return props;
};

const checkboxProps = (name, formProps) => ({
    name,
    onChange: formProps.handleChange,
    onBlur: () => formProps.setFieldTouched(name),
    margin: 'normal',
});

export { textFieldProps, checkboxProps };