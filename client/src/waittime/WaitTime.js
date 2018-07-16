import React, { Component } from 'react';
import styled from 'styled-components';
import qs from 'querystringify';
import moment from 'moment';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import UserErrorMessage from '../common/UserErrorMessage';
import WaitTimeNav from './WaitTimeNav';
import WaitTimeView from './WaitTimeView';
import BackgroundImage from '../assets/resort-carousel-bg.jpg';

const Background = styled.div`
    background-image: url(${BackgroundImage});
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat; 
    background-attachment: fixed;
`;

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

class WaitTime extends Component {
    state = {
        showSnackbar: false,
    }
    get resortSlug() {
        return this.props.match.params.resort;
    }

    handleSnackbarClose = () => {
        this.setState({
            showSnackbar: false,
        })
    }

    render() {
        const { date: searchDate } = this.props.location.search ? qs.parse(this.props.location.search) : {};
        const resortQuery = gql`
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

        return (
            <Query query={resortQuery} variables={{ slug: this.resortSlug }}>
                {({ loading, error, data }) => {
                    if (error) {
                    }

                    const { resort } = data;
                    const date = searchDate ||
                        (resort && resort.slug === this.resortSlug && resort.lastDate ?
                            resort.lastDate.date :
                            null);

                    const userErrorMessage = loading
                        ? null
                        : this.resortSlug && resort === null
                            ? { text: 'The resort name in the address bar does not exist.', severity: 1 }
                            : searchDate && !moment.utc(searchDate).isValid()
                                ? { text: 'The date in the address bar is invalid. Date must be entered as YYYY-MM-DD.', severity: 1 }
                                : !resort.dates.length
                                    ? { text: 'No wait time data exists for the selected resort. Please select either Serre Chevalier Vallee, Steamboat or Winter Park.', severity: 2 }
                                    : searchDate && !resort.dates.find(entry => Date.parse(entry.date) === Date.parse(searchDate))
                                        ? { text: 'No wait time data exists for the selected date. Please select a highlighted date from the calendar.', severity: 2 }
                                        : null;

                    return (
                        <Background>
                            <Flex>
                                <WaitTimeNav resortSlug={this.resortSlug} resort={resort} date={date} />
                                {!userErrorMessage
                                    ? <WaitTimeView resortSlug={this.resortSlug} resort={resort} date={date} />
                                    : <UserErrorMessage message={userErrorMessage} />
                                }
                            </Flex>
                        </Background>
                    );
                }}
            </Query>
        );
    }
}

export default WaitTime;
