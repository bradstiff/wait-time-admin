import React from 'react';
import { render, cleanup, wait, fireEvent } from 'react-testing-library';
import { MockedProvider } from 'react-apollo/test-utils';
import { createMemoryHistory } from 'history';

import { IntegrationTestContainer } from '../../app/App.test';
import Locations from '../../app/Locations';
import { UPLIFTS_BY_LIFT_QUERY } from './LiftUplifts';
import { makeCompareFn } from '../../common/SortEnabledTableHead';

const uplifts = [
    { id: 12513, date: new Date("2015-12-23T12:07:17.000Z"), waitSeconds: 76, seasonYear: 2015},
    { id: 12727, date: new Date("2015-12-24T14:59:36.000Z"), waitSeconds: 53, seasonYear: 2015},
    { id: 14838, date: new Date("2016-01-13T15:21:59.000Z"), waitSeconds: 55, seasonYear: 2015},
    { id: 49644, date: new Date("2016-03-16T15:13:23.000Z"), waitSeconds: 63, seasonYear: 2015},
    { id: 60774, date: new Date("2016-12-18T13:14:23.000Z"), waitSeconds: 46, seasonYear: 2016},
    { id: 60778, date: new Date("2016-12-18T15:08:21.000Z"), waitSeconds: 143, seasonYear: 2016},
    { id: 62795, date: new Date("2016-12-23T15:32:06.000Z"), waitSeconds: 42, seasonYear: 2016},
    { id: 65390, date: new Date("2016-12-28T15:31:47.000Z"), waitSeconds: 47, seasonYear: 2016},
    { id: 67657, date: new Date("2017-01-01T13:03:57.000Z"), waitSeconds: 36, seasonYear: 2016},
    { id: 68334, date: new Date("2017-01-03T15:33:58.000Z"), waitSeconds: 53, seasonYear: 2016},
    { id: 68529, date: new Date("2017-01-04T14:38:04.000Z"), waitSeconds: 63, seasonYear: 2016},
    { id: 68611, date: new Date("2017-01-04T14:38:06.000Z"), waitSeconds: 281, seasonYear: 2016},
    { id: 69041, date: new Date("2017-01-07T13:03:49.000Z"), waitSeconds: 67, seasonYear: 2016},
    { id: 76022, date: new Date("2017-01-25T15:27:46.000Z"), waitSeconds: 46, seasonYear: 2016},
    { id: 77378, date: new Date("2017-01-27T15:35:19.000Z"), waitSeconds: 221, seasonYear: 2016},
    { id: 81802, date: new Date("2017-02-04T12:23:23.000Z"), waitSeconds: 77, seasonYear: 2016},
    { id: 82052, date: new Date("2017-02-05T12:59:31.000Z"), waitSeconds: 77, seasonYear: 2016},
    { id: 85683, date: new Date("2017-02-11T14:47:57.000Z"), waitSeconds: 119, seasonYear: 2016},
    { id: 101195, date: new Date("2017-02-28T11:57:25.000Z"), waitSeconds: 55, seasonYear: 2016},
    { id: 107109, date: new Date("2017-03-09T14:57:11.000Z"), waitSeconds: 31, seasonYear: 2016},
    { id: 107110, date: new Date("2017-03-09T15:06:44.000Z"), waitSeconds: 97, seasonYear: 2016},
    { id: 107111, date: new Date("2017-03-09T15:14:21.000Z"), waitSeconds: 51, seasonYear: 2016},
    { id: 107112, date: new Date("2017-03-09T15:21:16.000Z"), waitSeconds: 26, seasonYear: 2016},
    { id: 107113, date: new Date("2017-03-09T15:30:03.000Z"), waitSeconds: 94, seasonYear: 2016},
    { id: 115617, date: new Date("2017-03-26T12:30:50.000Z"), waitSeconds: 58, seasonYear: 2016},
    { id: 117396, date: new Date("2017-04-05T11:58:30.000Z"), waitSeconds: 34, seasonYear: 2016},
    { id: 117399, date: new Date("2017-04-05T12:35:35.000Z"), waitSeconds: 26, seasonYear: 2016},
    { id: 122683, date: new Date("2017-12-29T10:34:27.000Z"), waitSeconds: 32, seasonYear: 2017},
    { id: 123779, date: new Date("2018-01-01T13:45:51.000Z"), waitSeconds: 65, seasonYear: 2017},
];

const columns = [
    { field: 'date', label: 'Date' },
    { field: 'waitSeconds', label: 'Wait Time (seconds)' },
];

const getUplifts = (seasonYear, month, day, hour) => uplifts
    .filter(uplift => !seasonYear || seasonYear === uplift.seasonYear)
    .filter(uplift => !month || month === uplift.date.getUTCMonth() + 1)
    .filter(uplift => !day || day === uplift.date.getUTCDay() + 1)
    .filter(uplift => !hour || hour === uplift.date.getUTCHours())

const getUpliftsCount = (seasonYear, month, day, hour) => getUplifts(seasonYear, month, day, hour).length;
const getUpliftsPage = (offset = 0, orderBy = 'date', order = 'asc', seasonYear, month, day, hour) =>
    getUplifts(seasonYear, month, day, hour)
        .sort(makeCompareFn(order, orderBy, columns, 'id'))
        .slice(offset * 25, offset * 25 + 25);

const mocks = [
    {
        request: {
            query: UPLIFTS_BY_LIFT_QUERY,
            variables: {
                id: 1,
                offset: 0,
                limit: 25,
                orderBy: 'date',
                order: 'asc',
                seasonYear: undefined,
                month: undefined,
                day: undefined,
                hour: undefined,
            },
        },
        result: {
            data: {
                lift: {
                    id: '1',
                    name: 'Test Lift',
                    upliftList: {
                        count: getUpliftsCount(),
                        uplifts: getUpliftsPage(),
                    }
                },
            },
        },
    },
    {
        request: {
            query: UPLIFTS_BY_LIFT_QUERY,
            variables: {
                id: 1,
                offset: 0,
                limit: 25,
                orderBy: 'waitSeconds',
                order: 'asc',
                seasonYear: undefined,
                month: undefined,
                day: undefined,
                hour: undefined,
            },
        },
        result: {
            data: {
                lift: {
                    id: '1',
                    name: 'Test Lift',
                    upliftList: {
                        count: getUpliftsCount(),
                        uplifts: getUpliftsPage(0, 'waitSeconds'),
                    }
                },
            },
        },
    },
    {
        request: {
            query: UPLIFTS_BY_LIFT_QUERY,
            variables: {
                id: 1,
                offset: 0,
                limit: 25,
                orderBy: 'waitSeconds',
                order: 'desc',
                seasonYear: undefined,
                month: undefined,
                day: undefined,
                hour: undefined,
            },
        },
        result: {
            data: {
                lift: {
                    id: '1',
                    name: 'Test Lift',
                    upliftList: {
                        count: getUpliftsCount(),
                        uplifts: getUpliftsPage(0, 'waitSeconds', 'desc'),
                    }
                },
            },
        },
    },
    {
        request: {
            query: UPLIFTS_BY_LIFT_QUERY,
            variables: {
                id: 1,
                offset: 25,
                limit: 25,
                orderBy: 'waitSeconds',
                order: 'desc',
                seasonYear: undefined,
                month: undefined,
                day: undefined,
                hour: undefined,
            },
        },
        result: {
            data: {
                lift: {
                    id: '1',
                    name: 'Test Lift',
                    upliftList: {
                        count: getUpliftsCount(),
                        uplifts: getUpliftsPage(1, 'waitSeconds', 'desc'),
                    }
                },
            },
        },
    },

    {
        request: {
            query: UPLIFTS_BY_LIFT_QUERY,
            variables: {
                id: 1,
                offset: 0,
                limit: 50,
                orderBy: 'date',
                order: 'asc',
                seasonYear: undefined,
                month: undefined,
                day: undefined,
                hour: undefined,
            },
        },
        result: {
            data: {
                lift: {
                    id: '1',
                    name: 'Test Lift',
                    upliftList: {
                        count: getUpliftsCount(),
                        uplifts, //all
                    }
                },
            },
        },
    },

    {
        request: {
            query: UPLIFTS_BY_LIFT_QUERY,
            variables: {
                id: 1,
                offset: 0,
                limit: 25,
                orderBy: 'date',
                order: 'asc',
                seasonYear: 2014,
                month: undefined,
                day: undefined,
                hour: undefined,
            },
        },
        result: {
            data: {
                lift: {
                    id: '1',
                    name: 'Test Lift',
                    upliftList: {
                        count: 0,
                        uplifts: null,
                    }
                },
            },
        },
    },

    {
        request: {
            query: UPLIFTS_BY_LIFT_QUERY,
            variables: {
                id: 1,
                offset: 0,
                limit: 25,
                orderBy: 'date',
                order: 'asc',
                seasonYear: 2016,
                month: undefined,
                day: undefined,
                hour: undefined,
            },
        },
        result: {
            data: {
                lift: {
                    id: '1',
                    name: 'Test Lift',
                    upliftList: {
                        count: getUpliftsCount(2016),
                        uplifts: getUpliftsPage(0, 'date', 'asc', 2016),
                    }
                },
            },
        },
    },
    {
        request: {
            query: UPLIFTS_BY_LIFT_QUERY,
            variables: {
                id: 1,
                offset: 0,
                limit: 25,
                orderBy: 'date',
                order: 'asc',
                seasonYear: 2016,
                month: 3,
                day: undefined,
                hour: undefined,
            },
        },
        result: {
            data: {
                lift: {
                    id: '1',
                    name: 'Test Lift',
                    upliftList: {
                        count: getUpliftsCount(2016, 3),
                        uplifts: getUpliftsPage(0, 'date', 'asc', 2016, 3),
                    }
                },
            },
        },
    },
    {
        request: {
            query: UPLIFTS_BY_LIFT_QUERY,
            variables: {
                id: 1,
                offset: 0,
                limit: 25,
                orderBy: 'date',
                order: 'asc',
                seasonYear: 2016,
                month: 3,
                day: 5,
                hour: undefined,
            },
        },
        result: {
            data: {
                lift: {
                    id: '1',
                    name: 'Test Lift',
                    upliftList: {
                        count: getUpliftsCount(2016, 3, 5),
                        uplifts: getUpliftsPage(0, 'date', 'asc', 2016, 3, 5),
                    }
                },
            },
        },
    },
    {
        request: {
            query: UPLIFTS_BY_LIFT_QUERY,
            variables: {
                id: 1,
                offset: 0,
                limit: 25,
                orderBy: 'date',
                order: 'asc',
                seasonYear: 2016,
                month: 3,
                day: 5,
                hour: 15,
            },
        },
        result: {
            data: {
                lift: {
                    id: '1',
                    name: 'Test Lift',
                    upliftList: {
                        count: getUpliftsCount(2016, 3, 5, 15),
                        uplifts: getUpliftsPage(0, 'date', 'asc', 2016, 3, 5, 15),
                    }
                },
            },
        },
    },
];

let history;

beforeEach(() => history = createMemoryHistory({ initialEntries: [Locations.LiftUplifts.toUrl({ id: 1 })] }));
afterEach(cleanup);

const TestApp = () => (
    <MockedProvider mocks={mocks} addTypename={false}>
        <IntegrationTestContainer history={history} />
    </MockedProvider>
);

const selectMenu = (menu, item, getByText) => {
    fireEvent.click(getByText(menu));
    fireEvent.click(getByText(item));
}

const tableData = container => 
    [...container.querySelectorAll('tbody > tr')]
        .map(tr => [...tr.querySelectorAll('th, td')]
            .map(td => td.textContent));

test('renders 29 uplifts in 2 pages of 25 per page, sorts by Wait Time descending, advances to 2nd page and formats date properly', async () => {
    const { container, debug, getByText } = render(<TestApp />);
    await wait();
    expect(getByText('1-25 of 29')).toBeTruthy;
    fireEvent.click(getByText('Wait Time (seconds)')); //sort by wait time asc
    await wait();
    expect(getByText('1-25 of 29')).toBeTruthy;
    fireEvent.click(getByText('Wait Time (seconds)')); //sort by wait time desc
    await wait();
    expect(getByText('1-25 of 29')).toBeTruthy;
    fireEvent.click(container.querySelector('button[aria-label="Next Page"]')); //go to next page
    await wait();
    expect(getByText('26-29 of 29')).toBeTruthy;
    const expectedTableData = [
        ['Fri, Dec 29, 2017 10:34 AM', '32'],
        ['Thu, Mar 9, 2017 2:57 PM', '31'],
        ['Wed, Apr 5, 2017 12:35 PM', '26'],
        ['Thu, Mar 9, 2017 3:21 PM', '26'],
    ];
    expect(tableData(container)).toEqual(expectedTableData);
});

test('renders 29 uplifts in 2 pages of 25 per page, then in 1 page of 50 per page', async () => {
    const { container, debug, getByText } = render(<TestApp />);
    await wait();
    expect(getByText('1-25 of 29')).toBeTruthy;
    selectMenu('25', '50', getByText); //select 50 per page
    await wait();
    expect(getByText('1-29 of 29')).toBeTruthy;
});

test('renders 4 uplifts after filtering for 2016-2017, then March, then Thursday, then 3-4PM', async () => {
    const { container, debug, getByText } = render(<TestApp />);
    await wait();
    expect(getByText('1-25 of 29')).toBeTruthy;
    selectMenu('All seasons', '2016 - 2017', getByText);
    await wait();
    expect(getByText('1-23 of 23')).toBeTruthy;
    selectMenu('All months', 'March', getByText);
    await wait();
    expect(getByText('1-6 of 6')).toBeTruthy;
    selectMenu('All days', 'Thursday', getByText);
    await wait();
    expect(getByText('1-5 of 5')).toBeTruthy;
    selectMenu('All hours', '3PM - 4PM', getByText);
    await wait();
    expect(getByText('1-4 of 4')).toBeTruthy;
});

test('renders "No uplifts found" after filtering for 2014-2015', async () => {
    const { container, debug, getByText } = render(<TestApp />);
    await wait();
    expect(getByText('1-25 of 29')).toBeTruthy;
    selectMenu('All seasons', '2014 - 2015', getByText);
    await wait();
    expect(getByText('No uplifts found.')).toBeTruthy;
});
