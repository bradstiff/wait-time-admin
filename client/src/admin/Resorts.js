import React from 'react';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import styled from 'styled-components';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';

export const resortsQuery = gql`
    query Resorts {
        resorts { 
            id,
            name,
            slug,
            logoFilename
        }
    }
`;

const ResortAvatar = styled.div`
    background-color: #000;
    width: 140px;
    text-align: center;

    &:hover img {
        opacity: 1;
    }    
`;

const ResortLogo = styled.img`
    height: 60px;
    width: auto;
    max-width: 140px;
    padding: 10px;
    opacity: 0.5;
    cursor: pointer;
`;

export default () => {
    return <Query query={resortsQuery}>
        {({ loading, error, data }) => {
            if (error) {
                console.log(error);
                return null;
            }
            if (loading) {
                return null;
            }
            const { resorts } = data;
            return (
                <List>
                    {resorts.map(resort => (
                        <ListItem key={resort.id} dense button component={Link} to={`/admin/resorts/${resort.id}`}>
                            <ResortAvatar>
                                <ResortLogo alt={resort.name} src={`${process.env.PUBLIC_URL}/logos/${resort.logoFilename}`} />
                            </ResortAvatar>
                            <ListItemText primary='0 lifts' />
                        </ListItem>
                    ))}
                </List>
            );
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Slug</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {resorts.map(resort => (
                                <TableRow key={resort.id}>
                                    <TableCell><Link to={`/admin/resorts/${resort.id}`}>{resort.name}</Link></TableCell>
                                    <TableCell>{resort.slug}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button variant='contained' color='primary' component={Link} to='/admin/resorts/create'>Add resort</Button>
                </Paper>
        }}
    </Query>
};