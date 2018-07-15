import React, { Component } from 'react';
import styled from 'styled-components';
import qs from 'querystringify';
import moment from 'moment';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import Typography from '@material-ui/core/Typography';

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

                    const validationError = loading
                        ? null
                        : this.resortSlug && resort === null
                            ? 'The resort name in the address bar does not exist.'
                            : searchDate && !moment.utc(searchDate).isValid()
                                ? 'The date in the address bar is invalid. Date must be entered as YYYY-MM-DD.'
                                : !resort.dates.length
                                    ? 'No wait time data exists for the selected resort. Please select either Serre Chevalier Vallee, Steamboat or Winter Park.'
                                    : searchDate && !resort.dates.find(entry => Date.parse(entry.date) === Date.parse(searchDate))
                                        ? 'No wait time data exists for the selected date.'
                                        : null;

                    return (
                        <Background>
                            <Flex>
                                <WaitTimeNav resortSlug={this.resortSlug} resort={resort} date={date} />
                                {validationError === null
                                    ? <WaitTimeView resortSlug={this.resortSlug} resort={resort} date={date} />
                                    : <Typography component='p' color='error'>{validationError}</Typography>
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
