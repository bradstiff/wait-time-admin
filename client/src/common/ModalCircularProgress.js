import React from 'react';
import PropTypes from 'prop-types';
import Modal from '@material-ui/core/Modal';
import CircularProgress from '@material-ui/core/CircularProgress';

const ModalCircularProgress = ({ open }) => (
    <Modal open={open} style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', }}>
        <div style={{ flex: 'auto', textAlign: 'center', outline: 'none' }}>
            <CircularProgress color='secondary' />
        </div>
    </Modal>
);

ModalCircularProgress.propTypes = {
    open: PropTypes.bool.isRequired,
}

export default ModalCircularProgress;