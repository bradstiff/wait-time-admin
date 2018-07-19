import React from 'react';
import styled from 'styled-components';
import qs from 'querystringify';
import moment from 'moment';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import UserErrorMessage from '../common/UserErrorMessage';
import WaitTimeNav from './WaitTimeNav';
import WaitTimeView from './WaitTimeView';
import ResortNotFound from '../app/ResortNotFound';
import NotFound from '../app/NotFound';
import withQuery from '../common/withQuery';

const Flex = styled.div`
    height: 100vh;
    display: flex;
    flex-flow: column;
    max-width: 1550px;
    margin: auto;
    background-color: #222;

    > header {
        flex: none;
    }

    > main {
        padding-top: 10px;
        flex: auto;
        overflow: hidden;
    }
`;

const query = gql`
    query ResortBySlug($slug: String!) {
        resort: resortBySlug(slug: $slug) { 
            id, 
            name, 
            slug, 
            trailMapFilename, 
            dates { 
                date 
            }, 
            lastDate { 
                id,
                date, 
                timePeriods { 
                    timestamp, 
                    waitTimes { 
                        liftID, 
                        seconds 
                    } 
                }
            }
        }
    }
`;

const WaitTime = ({ slug, date: searchDate, resort, loading }) => {
    const date = searchDate || (resort && resort.slug === slug && resort.lastDate
        ? resort.lastDate.date
        : null);

    if (slug && resort === null) {
        return <ResortNotFound />;
    } else if (searchDate && !moment.utc(searchDate).isValid()) {
        return <NotFound />;
    }
    const userErrorMessage = loading
        ? null
            : !resort.dates.length
                ? { text: 'No wait time data exists for the selected resort. Please select either Serre Chevalier Vallee, Steamboat or Winter Park.', severity: 2 }
                : searchDate && !resort.dates.find(entry => Date.parse(entry.date) === Date.parse(searchDate))
                    ? { text: 'No wait time data exists for the selected date. Please select a highlighted date from the calendar.', severity: 2 }
                    : null;

    return (
        <Flex>
            <WaitTimeNav resortSlug={slug} resort={resort} date={date} />
            {!userErrorMessage
                ? <WaitTimeView resortSlug={slug} resort={resort} date={date} />
                : <UserErrorMessage message={userErrorMessage} />
            }
        </Flex>
    );
}

export default withQuery(query, 'resort', ResortNotFound)(WaitTime);
