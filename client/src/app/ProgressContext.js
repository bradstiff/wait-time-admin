import React from 'react';
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';

const QueryProgressContext = React.createContext({
    inProgress: false,
    startProgress: () => { },
    endProgress: () => { },
});

export class QueryProgressProvider extends React.Component {
    constructor(props) {
        super(props);

        //use state for context values instead of literal object to avoid remounting
        this.state = {
            inProgress: false,
            startProgress: this.handleStartProgress,
            endProgress: this.handleEndProgress,
        };
    }

    handleStartProgress = () => {
        if (!this.state.inProgress) {
            this.setState({ inProgress: true })
        }
    }

    handleEndProgress = () => this.setState({ inProgress: false })

    render() {
        return (
            <QueryProgressContext.Provider value={this.state}>
                {this.props.children}
                <QueryProgressContext.Consumer>
                    {({ inProgress }) => (
                        <Modal open={inProgress} style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                            <div style={{ flex: 'auto', textAlign: 'center', outline: 'none' }}>
                                <CircularProgress color='secondary' />
                            </div>
                        </Modal>
                    )}
                </QueryProgressContext.Consumer>
            </QueryProgressContext.Provider>
        );
    }
}

export const QueryProgressConsumer = QueryProgressContext.Consumer;