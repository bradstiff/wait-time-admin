﻿import React, { Component } from 'react';
import Slider from 'rc-slider';
import moment from 'moment';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

import 'rc-slider/assets/index.css';

class TimeSlider extends Component {
    handleSelectedTimePeriodChange = timestamp => {
        this.props.selectTimePeriod(this.props.waitTimeDate, timestamp);
    }

    render() {
        const { timePeriods, selectedTimestamp } = this.props.waitTimeDate || {};
        if (!timePeriods || !timePeriods.length) {
            return null;
        }

        let timeFormat, minutesPerMark;
        const widthPerTimePeriod = window.innerWidth / timePeriods.length;
        switch (true) {
            case widthPerTimePeriod > 50:
                timeFormat = 'LT';
                minutesPerMark = 15;
                break;
            case widthPerTimePeriod > 40:
                timeFormat = 'LT';
                minutesPerMark = 15;
                break;
            case widthPerTimePeriod > 30:
                timeFormat = 'LT';
                minutesPerMark = 30;
                break;
            case widthPerTimePeriod > 20:
                timeFormat = 'LT';
                minutesPerMark = 30;
                break;
            case widthPerTimePeriod > 10:
                timeFormat = 'LT';
                minutesPerMark = 45;
                break;
            default:
                timeFormat = 'LT';
                minutesPerMark = 60;
                break;
        };

        let minutesAtPreviousMark = 0;
        const endTimePeriod = timePeriods[timePeriods.length - 1];
        const minutesAtEndMark = endTimePeriod.timestamp / 60;
        const marks = timePeriods.reduce((result, timePeriod) => {
            const minutes = timePeriod.timestamp / 60;
            const makeMark = minutesAtPreviousMark === 0 || // first timeslot
                timePeriod === endTimePeriod || // end timeslot
                (minutes - minutesAtPreviousMark >= minutesPerMark && // at least minutesPerMark gap to previous mark
                    minutesAtEndMark - minutes >= minutesPerMark / 2); // and this mark would not be too close to end mark

            if (makeMark) {
                result = {
                    [timePeriod.timestamp.toString()]: moment.unix(timePeriod.timestamp).utc().format(timeFormat),
                    ...result,
                };
                minutesAtPreviousMark = minutes;
            }
            return result;
        }, {});

        const handleStyle = {
            borderColor: '#D44126',
        };
        const containerStyle = {
            padding: '5px 25px 20px 25px',
            overflow: 'hidden',
        };

        return (
            <div style={containerStyle}>
                <Slider
                    marks={marks}
                    min={timePeriods[0].timestamp}
                    max={endTimePeriod.timestamp}
                    step={15 * 60}
                    included={false}
                    value={selectedTimestamp}
                    onChange={this.handleSelectedTimePeriodChange}
                    handleStyle={handleStyle}
                />
            </div>
        );
    }
}

const selectTimePeriodMutation = gql`
    mutation SelectTimePeriod($waitTimeDateID: String!, $timestamp: Int!) {
        selectTimePeriod(waitTimeDateID: $waitTimeDateID, timestamp: $timestamp) @client
    }
`;

export default graphql(selectTimePeriodMutation, {
    props: ({ mutate }) => ({
        selectTimePeriod: (waitTimeDate, timestamp) => mutate({ variables: { waitTimeDateID: waitTimeDate.id, timestamp} }),
    }),
})(TimeSlider);
