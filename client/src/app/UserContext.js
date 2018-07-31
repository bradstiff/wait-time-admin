import React from 'react';

const UserContext = React.createContext({
    user: null,
    isAdmin: false,
    onLogin: () => { },
    onLogout: () => { },
});

export class UserProvider extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            isAdmin: false,
            onLogin: this.handleLogin,
            onLogout: this.handleLogout,
        };
    }

    //placeholder
    handleLogin = () => this.setState({
        user: 'admin',
        isAdmin: true,
    });

    handleLogout = user => this.setState({
        user: null,
        isAdmin: false,
    });

    render() {
        return (
            <UserContext.Provider value={this.state}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

export const UserConsumer = UserContext.Consumer;