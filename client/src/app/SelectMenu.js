import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

class SelectMenu extends React.Component {
    state = {
        selected: this.props.options.find(option => option.value === (this.props.initialValue === undefined ? null : this.props.initialValue)),
        anchorEl: null,
    };

    handleOpen = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    handleMenuItemClick = (event, option) => {
        this.setState({
            selected: option,
            anchorEl: null
        });
        this.props.onSelect(option.value);
    };

    render() {
        const { selected, anchorEl } = this.state;
        const { id, options } = this.props;
        return (
            <span>
                <Button
                    aria-owns={anchorEl ? id : null}
                    aria-haspopup="true"
                    onClick={this.handleOpen}
                >
                    {selected.text}
                </Button>
                <Menu
                    id={id}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    {options.map(option => (
                        <MenuItem
                            key={option.value}
                            selected={selected.value === option.value}
                            onClick={event => this.handleMenuItemClick(event, option)}
                        >
                            {option.text}
                        </MenuItem>
                    ))}
                </Menu>
            </span>
        );
    }
}

SelectMenu.propTypes = {
    id: PropTypes.string.isRequired,
    onSelect: PropTypes.func.isRequired,
    options: PropTypes
        .arrayOf(PropTypes.shape({
            value: PropTypes.any,//.isRequired, need a way to tell PropTypes that null is a valid value...
            text: PropTypes.string.isRequired,
        }))
        .isRequired,
    initialValue: PropTypes.any,
};

export default SelectMenu;