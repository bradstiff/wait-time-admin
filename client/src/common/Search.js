import React from 'react';
import PropTypes from 'prop-types';
import { DebounceInput } from 'react-debounce-input';

import grey from '@material-ui/core/colors/grey';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';

class SearchInput extends React.Component {
    state = {
        focused: false,
    }

    handleFocus = () => {
        this.setState({
            focused: true,
        });
    }

    handleBlur = () => {
        this.setState({
            focused: false,
        });
    }

    render() {
        const { value, onChange, placeholder, classes } = this.props;
        const { focused } = this.state;
        const displayPlaceholder = focused ? placeholder : undefined;
        const style = {
            backgroundColor: grey[800],
            verticalAlign: 'middle',
            width: focused ? 200 : 100,
            transition: 'width 0.3s',
        };

        return (
            <Input
                value={value}
                type='search'
                placeholder={displayPlaceholder}
                disableUnderline
                style={style}
                startAdornment={
                    <InputAdornment position="start">
                        <SearchIcon color={focused ? 'inherit' : 'disabled'} />
                    </InputAdornment>
                }
                onChange={onChange}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
            />
        );
    }
}

export default ({ value, onChange, placeholder, classes }) => (
    <DebounceInput
        debounceTimeout={750}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        element={SearchInput}
        classes={classes}
    />
);
