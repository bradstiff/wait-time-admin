import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import bindProps from '../common/FormikFieldHelper';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    root: {
        padding: theme.spacing.unit,
    },
})

class Login extends React.Component {
    handleSubmit = (username, password) => {
        const options = {
            method: 'POST'
        };
        fetch('/login', options)
            .then(res => {
                this.props.onLogin();
            })
            .catch(error => { });
    }

    render() {
        const { onCancel, classes, open } = this.props;
        return <LoginDialog open={open} onSubmit={this.handleSubmit} onCancel={onCancel} classes={classes} />;
    }

    static propTypes = {
        open: PropTypes.bool.isRequired,
        onLogin: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
    }
}

const LoginDialog = ({ open, onSubmit, onCancel, classes }) => {
    const model = {
        username: Yup.string().min(2).max(100).required().label('Username'),
        password: Yup.string().min(2).max(100).required().label('Password'),
    };

    return <Dialog open={open}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
        <Formik
            initialValues={{
                username: '',
                password: '',
            }}
            validationSchema={Yup.object().shape(model)}
            onSubmit={onSubmit}
            render={formikProps => {
                const { handleSubmit, isSubmitting, } = formikProps;
                const textFieldPropKeys = ['value', 'error', 'helperText', 'onChange', 'onBlur', 'disabled'];
                const formProps = {
                    ...formikProps,
                };
                return (
                    <form onSubmit={handleSubmit}>
                        <div><TextField {...bindProps('username', textFieldPropKeys, formProps) } label='Username' style={{ width: 400 }} inputProps={{ maxLength: 100, autocomplete: 'off' }} margin='normal' /></div>
                        <div><TextField {...bindProps('password', textFieldPropKeys, formProps) } label='Password' style={{ width: 400 }} inputProps={{ maxLength: 100, autocomplete: 'off' }} margin='normal' /></div>
                        <div>
                            <Button color='primary' onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
                            <Button color='primary' variant='outlined' type='submit' disabled={isSubmitting}>Login</Button>
                        </div>
                    </form>
                );
            }}
            />
        </DialogContent>
    </Dialog>
};

export default withStyles(styles)(Login);