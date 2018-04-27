import React from 'react';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { Query } from "react-apollo";

import styled from 'styled-components';

const ResortLogo = styled.img`
    height: 60px;
    width: auto;
    padding: 10px;
    opacity: ${props => props.selected ? 1 : 0.5};
    cursor: pointer;

    &:hover {
        opacity: 1;
    }    
`;

const ResortCarousel = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: auto 10px;
`;

const resortsQuery = gql`
    query Resorts {
        resorts { id, name, slug, logoFilename }
    }
`;

export default ({ selectedResortSlug }) => (
    <Query query={resortsQuery}>
        {({ loading, error, data }) => {
            if (loading) {
                return null;
            } else if (error) {
                console.log(error);
                return null;
            }
            return (
                <ResortCarousel>
                    {data.resorts.map(({ id, logoFilename, name, slug }) => {
                        return (
                            <Link key={id} to={`/resorts/${slug}`}>
                                <ResortLogo
                                    src={`${process.env.PUBLIC_URL}/logos/${logoFilename}`}
                                    alt={name}
                                    selected={slug === selectedResortSlug}
                                />
                            </Link>
                        )
                    })}
                </ResortCarousel>
            );
        }}
    </Query>
);