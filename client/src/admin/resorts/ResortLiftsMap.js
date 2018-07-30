import React from 'react';
import PropTypes from 'prop-types';
import { Map, TileLayer } from 'react-leaflet'

class ResortLiftsMap extends React.Component {
    state = {};

    assignMapRef = node => {
        this.map = node;
    };

    handleMapBoundsChange = event => {
        const leaflet = event.target || (this.map && this.map.leafletElement);
        const { onBoundsChange } = this.props;
        if (!leaflet || !onBoundsChange) {
            return;
        }
        onBoundsChange(leaflet.getBounds());
    };

    render() {
        const { resortLocation, bounds, children } = this.props;
        const mapProps = bounds
            ? { bounds }
            : {
                center: resortLocation,
                zoom: 13,
            };
        return (
            <Map
                {...mapProps}
                ref={this.assignMapRef}
                whenReady={event => this.handleMapBoundsChange(event)}
                onViewportChanged={event => this.handleMapBoundsChange(event)}
                style={{ width: '100%', height: '100%' }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" crossOrigin={false} />
                {children}
            </Map>
        );
    }

    static propTypes = {
        resortLocation: PropTypes
            .shape({
                lat: PropTypes.number.isRequired,
                lng: PropTypes.number.isRequired,
            })
            .isRequired,
        bounds: PropTypes
            .arrayOf(PropTypes.shape({
                lat: PropTypes.number.isRequired,
                lng: PropTypes.number.isRequired,
            })),
        onBoundsChange: PropTypes.func,
        children: PropTypes.arrayOf(PropTypes.node),
    }
}

export default ResortLiftsMap;