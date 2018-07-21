import React from 'react';
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';
import ProgressContext from '../app/ProgressContext';

export default () => (
    <ProgressContext.Consumer>
        {({ inProgress }) => (
            <Modal open={inProgress} style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
                <div style={{ flex: 'auto', textAlign: 'center', outline: 'none' }}>
                    <CircularProgress color='secondary' />
                </div>
            </Modal>
        )}
    </ProgressContext.Consumer>
)