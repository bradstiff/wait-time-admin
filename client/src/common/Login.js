import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Rollbar from 'rollbar';

import bindProps from './FormikFieldHelper';
import UserErrorMessage from './UserErrorMessage';

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
    state = {
        message: null,
    };

    handleSubmit = async (values, actions) => {
        const options = {
            method: 'POST',
            body: JSON.stringify(values),
            headers: { "Content-Type": "application/json; charset=utf-8" },
        };
        try {
            const res = await fetch('/authenticate', options);
            if (res.ok) {
                const result = await res.text();
                if (result === 'OK') {
                    this.setState({ message: null });
                    this.props.onLogin();
                } else {
                    this.setState({
                        message: {
                            text: 'The username and password combination does not match our records.',
                            severity: 1
                        },
                    });
                }
            } else {
                throw new Error(`${options.method} ${res.url} ${res.status} (${res.statusText})`);
            }
            actions.setSubmitting(false);
        } catch (error) {
            this.setState((s, p) => { throw error }); //throw to error boundary
        }        
    }

    render() {
        const { onCancel, classes, open } = this.props;
        const { message } = this.state;
        return <LoginDialog open={open} message={message} onSubmit={this.handleSubmit} onCancel={onCancel} classes={classes} />;
    }

    static propTypes = {
        open: PropTypes.bool.isRequired,
        onLogin: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
    }
}

const LoginDialog = ({ open, message, onSubmit, onCancel, classes }) => {
    const model = {
        username: Yup.string().min(2).max(100).required().label('Username'),
        password: Yup.string().min(2).max(100).required().label('Password'),
    };

    return <Dialog open={open} message={message}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
        <Formik
            initialValues={{
                username: '',
                password: '',
            }}
            validationSchema={Yup.object().shape(model)}
            onSubmit={(values, actions) => onSubmit(values, actions)}
            render={formikProps => {
                const { handleSubmit, isSubmitting, } = formikProps;
                const textFieldPropKeys = ['value', 'error', 'helperText', 'onChange', 'onBlur',];
                const formProps = {
                    ...formikProps,
                };
                return (
                    <form onSubmit={handleSubmit}>
                        <div><TextField {...bindProps('username', textFieldPropKeys, formProps) } label='Username' style={{ width: 400 }} inputProps={{ maxLength: 100, autoComplete: 'off' }} margin='normal' /></div>
                        <div><TextField {...bindProps('password', textFieldPropKeys, formProps) } label='Password' style={{ width: 400 }} inputProps={{ maxLength: 100, autoComplete: 'off' }} margin='normal' /></div>
                        <div>
                            <Button color='primary' onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
                            <Button color='primary' variant='outlined' type='submit' disabled={isSubmitting}>Login</Button>
                        </div>
                        <UserErrorMessage message={message} />
                    </form>
                );
            }}/>
        </DialogContent>
    </Dialog>
};

export default withStyles(styles)(Login);