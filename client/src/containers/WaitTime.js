﻿import React, { Component } from 'react';
import styled from 'styled-components';
import qs from 'query-string';
import moment from 'moment';
import { Query } from "react-apollo";
import gql from 'graphql-tag';
import { Alert } from 'react-bootstrap';

import WaitTimeNav from './WaitTimeNav';
import WaitTimeView from './WaitTimeView';
import BackgroundImage from '../assets/resort-carousel-bg.jpg'

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
        flex: auto;
        overflow: hidden;
    }
`;

class WaitTime extends Component {
    get resortSlug() {
        return this.props.match.params.resort;
    }

    render() {
        const { date: searchDate } = this.props.location.search ? qs.parse(this.props.location.search) : {};
        if (searchDate && !moment.utc(searchDate).isValid()) {
            return (<Alert bsStyle='danger'>
                <h5>'Date must be entered as YYYY-MM-DD'</h5>
            </Alert>);
        }

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
                        return (<Alert bsStyle='danger'>
                            <h5>{JSON.stringify(error)}</h5>
                        </Alert>);
                    }
                    const { resort } = data;
                    const date = searchDate ||
                        (resort && resort.slug === this.resortSlug ?
                        resort.lastDate.date :
                        null);
                    return (
                        <Background>
                            <Flex>
                                <WaitTimeNav resortSlug={this.resortSlug} resort={resort} date={date} />
                                <WaitTimeView resortSlug={this.resortSlug} resort={resort} date={date} />
                            </Flex>
                        </Background>
                    );
                }}
            </Query>
        );
    }
}
export default WaitTime;
