import React from 'react';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import styled from 'styled-components';

import 'react-datepicker/dist/react-datepicker.css';

const FlexContainer = styled.div`
    ${props => props.style}
    display: flex;
    align-items: baseline;
    padding: 2px;
`;

const GlyphiconButton = styled(props => (
    <div
        className={`glyphicon glyphicon-${props.glyphicon} ${props.className}`}
        onClick={props.onClick}
    >
    </div>
))`
    flex: none;
    padding: 2px;
    color: #FFF;
    font-size: 18px;
    &:hover {
        color: #D44126;
        cursor: pointer;
    }
`;

const SelectedDate = styled.div`
    flex: auto;
    text-align: center;
    font-weight: 700;
    font-size: 22px;
    color: #D44126;
    text-transform: uppercase;
    border: none;
    font-family: "Gotham A", "Century Gothic", sans-serif;
`;

export default ({ dates, date, displayFormat, style, selectDate }) => {
    if (!dates) {
        return null;
    }

    const selectedDate = moment.utc(date);
    const selectedDateDisplay = dates.length ?
        selectedDate.format(displayFormat) :
        'NO DATES AVAILABLE';

    const availableDates = dates.map(waitTimeDate => moment.utc(waitTimeDate.date));
    const selectedDateIndex = availableDates.findIndex(date => date.isSame(selectedDate));

    const nextDateIndex = selectedDateIndex + 1;
    const nextDate = nextDateIndex > 0 && nextDateIndex < availableDates.length ?
        availableDates[nextDateIndex] :
        null;

    const previousDateIndex = selectedDateIndex - 1;
    const previousDate = previousDateIndex >= 0 ?
        availableDates[previousDateIndex] :
        null;

    const makeScrollDateHandler = (date) => {
        return date ?
            () => selectDate(date) :
            null;
    };

    return (
        <FlexContainer style={style}>
            <GlyphiconButton glyphicon='chevron-left' onClick={makeScrollDateHandler(previousDate)} />
            <SelectedDate>{selectedDateDisplay}</SelectedDate>
            <DatePicker
                includeDates={availableDates}
                selected={selectedDate && selectedDate.isValid() ? selectedDate : null}
                onChange={selectDate}
                customInput={<GlyphiconButton glyphicon='calendar' />}
                popperPlacement='auto-left'
            />
            <GlyphiconButton glyphicon='chevron-right' onClick={makeScrollDateHandler(nextDate)} />
        </FlexContainer>
    )
}
