import React from 'react';
import PropTypes from 'prop-types';

import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';

const ToggleIconButton = ({ isOn, onToggle, onTip, offTip, children }) => {
    const tip = isOn
        ? onTip
        : offTip;
    const color = isOn
        ? 'secondary'
        : 'default';
    return (<Tooltip title={tip}>
        <IconButton aria-label={tip} color={color}>
            {React.cloneElement(children, { onClick: onToggle })}
        </IconButton>
    </Tooltip>);
}

ToggleIconButton.propTypes = {
    isOn: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
    onTip: PropTypes.string.isRequired,
    offTip: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
}
export default ToggleIconButton;