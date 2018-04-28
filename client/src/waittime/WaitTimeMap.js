import React, { Component } from 'react';
import PinchZoomPan from 'react-responsive-pinch-zoom-pan';
import ComicBubbles from '../comicbubbles/comicbubbles';

class WaitTimeMap extends Component {
    render() {
        console.log(`render ${this.props.resort.loading ? 'Loading ' : ''} ${this.props.resort.slug}, ${this.props.waitTimeDate ? this.props.waitTimeDate.date : 'Loading WaitTimeDate'}`);
        return (
            <PinchZoomPan initialScale={1}>
                <canvas
                    id='trailMap'
                    ref={canvas => this.canvas = canvas}
                    width={0}
                    height={0}
                    scale={1}
                />
            </PinchZoomPan>
        );
    }

    componentDidMount() {
        this.ensureCanvas();
    }

    shouldComponentUpdate(nextProps) {
        return this.props.resort !== nextProps.resort ||
            this.props.waitTimeDate !== nextProps.waitTimeDate;
    }

    componentDidUpdate() {
        console.log(`componentDidUpdate ${this.props.resort.loading ? 'Loading ' : ''} ${this.props.resort.slug}, ${this.props.waitTimeDate ? this.props.waitTimeDate.date : 'Loading WaitTimeDate'}`);
        this.ensureCanvas();
    }

    ensureCanvas() {
        console.log(`ensureCanvas ${this.props.resort.loading ? 'Loading ' : ''} ${this.props.resort.slug}, ${this.props.waitTimeDate ? this.props.waitTimeDate.date : 'Loading WaitTimeDate'}`);
        if (!this.props.resort) {
            // need trail map filename; we will get updated when parent query finishes
            return;
        }
        const { trailMapFilename } = this.props.resort;
        if (!this.trailMap || this.trailMap.filename !== trailMapFilename) {
            this.loadTrailMap(trailMapFilename);
        } else if (this.canvas.width && this.canvas.height) {
            this.drawCanvas();
        }
    }

    loadTrailMap = (trailMapFilename) => {
        console.log(`loadTrailMap ${this.props.resort.loading ? 'Loading ' : ''} ${this.props.resort.slug}, ${this.props.waitTimeDate ? this.props.waitTimeDate.date : 'Loading WaitTimeDate'}`);
        const src = `${process.env.PUBLIC_URL}/trailmaps/${trailMapFilename}`;
        const image = new Image();
        this.trailMap = {
            filename: trailMapFilename,
            image,
        };
        image.alt = 'Trail Map';
        image.src = src;
        image.onload = function() {
            console.log(`image loaded ${this.props.resort.loading ? 'Loading ' : ''} ${this.props.resort.slug}, ${this.props.waitTimeDate ? this.props.waitTimeDate.date : 'Loading WaitTimeDate'}`);
            if (!this.canvas) {
                // component unmounted before image loaded
                return;
            }
            this.canvas.width = image.width;
            this.canvas.height = image.height;
            this.forceUpdate(); // cause PinchZoomPan to calculate autofit minScale, and invoke ensureCanvas
        }.bind(this);
    }

    drawCanvas = () => {
        console.log(`drawCanvas ${this.props.resort.loading ? 'Loading ' : ''} ${this.props.resort.slug}, ${this.props.waitTimeDate ? this.props.waitTimeDate.date : 'Loading WaitTimeDate'}`);
        const context = this.canvas.getContext('2d');
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        context.drawImage(this.trailMap.image, 0, 0);

        if (this.props.waitTimeDate && this.props.waitTimeDate.timePeriods.length) {
            console.log(`drawBubbles ${this.props.resort.loading ? 'Loading ' : ''} ${this.props.resort.slug}, ${this.props.waitTimeDate ? this.props.waitTimeDate.date : 'Loading WaitTimeDate'}`);
            this.drawBubbles();
        }
    }

    drawBubbles = () => {
        const bubbleDefinitions = getBubbleDefinitions(this.props.resort.id);
        const { timePeriods, selectedTimestamp } = this.props.waitTimeDate;
        const waitTimes = timePeriods.find(timePeriod => timePeriod.timestamp === selectedTimestamp).waitTimes;
        const bubbles = waitTimes.reduce((result, { liftID, seconds }) => {
                const bubble = bubbleDefinitions.find(({ id }) => id === liftID.toString());
                if (bubble != null) {
                    result.push({
                        ...bubble,
                        text: seconds.toString(),
                    });
                }
                return result;
        }, []);

        const defaults = {
            textDrawing: true,
            readonly: true,
            width: 37,
            height: 'auto',
            fontWeight: 'bold',
            background: '#D44126',
            color: '#fff',
            opacity: 1,
            bubbleStyle: 'speak',
        };

        new ComicBubbles('trailMap', {
            canvas: defaults,
            bubble: bubbles,
        });
    }
}

export default WaitTimeMap;

const getBubbleDefinitions = (resortID) => {
    switch (resortID) {
        case 1:
            return [
                { id: '47356', tag: 'Bar', x: 335, y: 231, tailLocation: 'n', tailX: 355, tailY: 276 },
                { id: '47355', tag: 'Elk', x: 987, y: 336, tailLocation: 'n', tailX: 973, tailY: 380 },
                { id: '47353', tag: 'Sout', x: 1250, y: 246, tailLocation: 'n', tailX: 1236, tailY: 288 },
                { id: '47350', tag: 'Chri', x: 1272, y: 741, tailLocation: 'n', tailX: 1319, tailY: 781 },
                { id: '42146', tag: 'Sund', x: 928, y: 315, tailLocation: 'n', tailX: 912, tailY: 354 },
                { id: '42145', tag: 'Bash', x: 730, y: 540, tailLocation: 'n', tailX: 753, tailY: 588 },
                { id: '42144', tag: 'Gond', x: 1340, y: 696, tailLocation: 'n', tailX: 1375, tailY: 759 },
                { id: '42141', tag: 'Thun', x: 530, y: 571, tailLocation: 'n', tailX: 570, tailY: 617 },
                { id: '47357', tag: 'Four', x: 500, y: 326, tailLocation: 'n', tailX: 477, tailY: 379 },
                { id: '42140', tag: 'BC', x: 429, y: 368, tailLocation: 'n', tailX: 433, tailY: 427 },
                { id: '42143', tag: 'storm', x: 351, y: 372, tailLocation: 'n', tailX: 390, tailY: 421 },
                { id: '47358', tag: 'pony', x: 255, y: 433, tailLocation: 'n', tailX: 238, tailY: 476 },
                { id: '47351', tag: 'Prev', x: 1205, y: 772, tailLocation: 'n', tailX: 1289, tailY: 792 },
                { id: '50719', tag: 'Suns', x: 1181, y: 210, tailLocation: 'n', tailX: 1223, tailY: 260 },
            ];
        case 'steamboatMorningsidePark.png':
            return [
                { id: '47352', tag: 'morn', x: 312, y: 316, tailLocation: 'n', tailX: 332, tailY: 361 },
            ];
        case 2:
            return [
                { id: '55569', tag: 'Gemi', x: 532, y: 934, tailLocation: 'n', tailX: 514, tailY: 974 },
                { id: '55570', tag: 'Ende', x: 698, y: 916, tailLocation: 'n', tailX: 679, tailY: 946 },
                { id: '45250', tag: 'Eagl', x: 1113, y: 349, tailLocation: 'n', tailX: 1133, tailY: 394 },
                { id: '45249', tag: 'Pano', x: 139, y: 332, tailLocation: 'n', tailX: 159, tailY: 377 },
                { id: '44956', tag: 'Pion', x: 1383, y: 761, tailLocation: 'n', tailX: 1403, tailY: 806 },
                { id: '44955', tag: 'Zeph', x: 418, y: 898, tailLocation: 'n', tailX: 428, tailY: 945 },
                { id: '44621', tag: 'High', x: 940, y: 438, tailLocation: 'n', tailX: 960, tailY: 483 },
                { id: '42115', tag: 'Olym', x: 1178, y: 781, tailLocation: 's', tailX: 1188, tailY: 750 },
                { id: '42114', tag: 'Pros', x: 887, y: 883, tailLocation: 'n', tailX: 851, tailY: 914 },
                { id: '42113', tag: 'Arro', x: 482, y: 896, tailLocation: 'n', tailX: 458, tailY: 957 },
                { id: '42112', tag: 'Look', x: 1098, y: 770, tailLocation: 's', tailX: 1167, tailY: 740 },
                { id: '42111', tag: 'Eski', x: 799, y: 877, tailLocation: 'n', tailX: 838, tailY: 928 },
                { id: '42109', tag: 'Chal', x: 378, y: 650, tailLocation: 'n', tailX: 411, tailY: 700 },
                { id: '42106', tag: 'Supe', x: 449, y: 684, tailLocation: 'n', tailX: 473, tailY: 744 },
                { id: '44620', tag: 'Sunn', x: 125, y: 400, tailLocation: 'w', tailX: 193, tailY: 408 },
                { id: '55571', tag: 'Pony', x: 433, y: 779, tailLocation: 's', tailX: 483, tailY: 748 },
                { id: '42108', tag: 'Iron', x: 521, y: 729, tailLocation: 'n', tailX: 494, tailY: 754 },
            ];
        default:
            return [];
    }
};
