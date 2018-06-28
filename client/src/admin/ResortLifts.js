import React from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import ResortLiftsMap from './ResortLiftsMap';

const resortQuery = gql`
    query Resort($resortID: Int!) {
        resort(id: $resortID) { 
            id,
            name,
            location { lat, lng },
            lifts { id },
        }
    }
`;

const updateAssignedLiftsMutation = gql`
    mutation UpdateResortAssignedLifts($id: Int!, $liftIDs: [Int!]) {
        updateResortAssignedLifts(id: $id, liftIDs: $liftIDs) { 
            id,
            name,
            location { lat, lng },
            lifts { id },
        }
    }
`;

class ResortLifts extends React.Component {
    state = {};

    handleAssignLift = id => {
        this.setState({
            assignedLiftIDs: [
                id,
                ...this.state.assignedLiftIDs
            ]
        });
    }

    handleUnassignLift = id => {
        const assignedLiftIDs = this.state.assignedLiftIDs.slice();
        const index = assignedLiftIDs.indexOf(id);
        if (index > -1) {
            assignedLiftIDs.splice(index, 1);
            this.setState({
                assignedLiftIDs
            });
        }
    }

    handleSave = () => {
        this.props.saveAssignedLifts(this.props.data.resort.id, this.state.assignedLiftIDs);
    }

    handleCancel = () => {

    }

    render() {
        const { data: { resort, error } } = this.props;
        if (error) {
            console.log(error);
            return null;
        }
        if (resort === undefined) {
            return null;
        }
        if (resort === null) {
            return <p>Resort not found</p>;
        }

        const { assignedLiftIDs } = this.state;
        return (
            <Paper>
                <Typography variant="display3" gutterBottom>
                    {resort.name}
                </Typography>
                <Button color='primary' onClick={this.handleCancel}>Cancel</Button>
                <Button variant='contained' color='primary' onClick={() => this.handleSave()}>Save</Button>
                <ResortLiftsMap
                    resortLocation={resort.location}
                    assignedLiftIDs={assignedLiftIDs}
                    onAssignLift={this.handleAssignLift}
                    onUnassignLift={this.handleUnassignLift}
                />
            </Paper>
        );
    }

    static getDerivedStateFromProps(props, state) {
        const { assignedLiftIDs } = state || {};
        const { data: { resort } } = props;
        if (resort && assignedLiftIDs === undefined) {
            return {
                assignedLiftIDs: resort.lifts.map(lift => lift.id),
            }
        } else {
            return null;
        }
    }
}

export default compose(
    graphql(resortQuery, {
        options: ({ match }) => ({ variables: { resortID: parseInt(match.params.id) } })
    }),
    graphql(updateAssignedLiftsMutation, {
        name: 'updateAssignedLifts',
        props: ({ updateAssignedLifts }) => ({
            saveAssignedLifts: (id, liftIDs) => 
                updateAssignedLifts({
                    variables: {
                        id,
                        liftIDs,
                    }
                })
        })
    })
)(ResortLifts);