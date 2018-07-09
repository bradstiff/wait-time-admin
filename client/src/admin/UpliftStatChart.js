import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ChartistGraph from 'react-chartist';

const seasonYears = [2016, 2017]; //todo: hard-coded
const hours = [8, 9, 10, 11, 12, 13, 14, 15, 16];

const UpliftStatChart = ({ upliftGroupings, dataPoint }) => {
    const data = {
        labels: hours.map(hour => moment().hour(hour).format('hA')),
        series: seasonYears.map(seasonYear => (
            hours.map(hour => {
                const grouping = upliftGroupings.find(g => g.groupKey === hour && g.group2Key === seasonYear);
                return grouping
                    ? grouping[dataPoint]
                    : null;
            })
        )),
    };
    var options = {
        low: 0,
        showArea: true
    };
    return <ChartistGraph
        data={data}
        options={options}
        type={'Line'}
    />;
}

UpliftStatChart.propTypes = {
    upliftGroupings: PropTypes
        .arrayOf(PropTypes.shape({
            groupKey: PropTypes.number.isRequired,
            group2Key: PropTypes.number.isRequired,
            upliftCount: PropTypes.number,
            waitTimeAverage: PropTypes.number,
        }))
        .isRequired,
    dataPoint: PropTypes
        .oneOf(['upliftCount', 'waitTimeAverage'])
        .isRequired,
}
export default UpliftStatChart;