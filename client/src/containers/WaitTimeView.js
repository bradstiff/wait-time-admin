import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import WaitTimeMap from './WaitTimeMap';
import TimePicker from '../components/TimePicker';

const waitTimeDateQuery = gql`
    query WaitTimeDate($resortSlug: String!, $date: Date!) {
        waitTimeDate(resortSlug: $resortSlug, date: $date) { 
            id,
            date, 
            timePeriods { 
                timestamp, 
                waitTimes { 
                    liftID, 
                    seconds 
                } 
            },
            selectedTimestamp @client
        }
    }
`;

export default ({ resortSlug, resort, date }) => {
    if (!resort || !date) {
        // No search date entered and resort.lastDate not available because Resort query still loading at parent
        return null;
    }

    // This will either request the WaitTimeDate for the search date, or retrieve last WaitTimeDate from the cache.
    return (
        <Query query={waitTimeDateQuery} variables={{ resortSlug: resortSlug, date }}>
            {({ loading, error, data }) => {
                if (error) {
                    console.log(error);
                    return null;
                }
                const { waitTimeDate } = data;
                return (
                    <main>
                        <div style={{ minHeight: '40px' }}>
                            <TimePicker waitTimeDate={waitTimeDate} />
                        </div>
                        <WaitTimeMap resort={resort} waitTimeDate={waitTimeDate} />
                    </main>
                );
            }}
        </Query>
    );
};
