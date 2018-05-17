import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Responsive from 'react-responsive';
import styled from 'styled-components';
import { Navbar, Nav } from 'react-bootstrap';

import ResortNavDesktop from './ResortNavDesktop';
import ResortNavMobile from './ResortNavMobile';
import DateNav from './DateNav';

const DESKTOP_BREAKPOINT = 780;
const Desktop = props => <Responsive {...props} minWidth={DESKTOP_BREAKPOINT} />;
const Mobile = props => <Responsive {...props} maxWidth={DESKTOP_BREAKPOINT - 1} />;

const ResortName = styled.span`
        text-transform: uppercase;
        border: none;
        font-family: "Gotham A", "Century Gothic", sans-serif;
        font-weight: 800;
        @media (min-width: ${DESKTOP_BREAKPOINT}px) {
            font-size: 28px;
            color: #FFF;
            padding: 2px 5px 2px 5px;
            margin-right: 10px;
        }
    `;
const Centered = styled.div`text-align: center`;

class WaitTimeNav extends Component {
    handleSelectDate = date => {
        this.props.history.push(`/resorts/${this.props.resort.slug}?date=${date.format('YYYY-MM-DD')}`);
    }

    render() {
        const { resortSlug, resort, date } = this.props;
        const resortName = resort ? resort.name : 'Loading';
        const dateDisplayFormat = window.screen.width >= DESKTOP_BREAKPOINT ? 'dddd, MMMM DD, YYYY' : 'ddd, MMMM DD, YYYY';

        return (
            <header>
                <Desktop>
                    {resortSlug !== 'serre-chevalier-vallee' && <ResortNavDesktop selectedResortSlug={resortSlug} />}
                    <Centered>
                        <ResortName>{resortName} Wait Times</ResortName>
                        <DateNav
                            dates={resort && resort.dates}
                            date={date}
                            displayFormat={dateDisplayFormat}
                            style={{ minWidth: '400px', display: 'inline-flex' }}
                            selectDate={this.handleSelectDate}
                        />
                    </Centered>
                </Desktop>
                <Mobile>
                    <Navbar inverse collapseOnSelect>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <ResortName>{resortName} Wait Times</ResortName>
                            </Navbar.Brand>
                            <Navbar.Toggle />
                        </Navbar.Header>
                        <Navbar.Collapse>
                            <Nav>
                                <ResortNavMobile />
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                    <DateNav
                        dates={resort && resort.dates}
                        date={date}
                        displayFormat={dateDisplayFormat}
                        style={{ padding: '0px 10px' }}
                        selectDate={this.handleSelectDate}
                    />
                </Mobile>
            </header>
        );
    };
}

export default withRouter(WaitTimeNav);
