const MODIFIED = 'modified';
const TRADITIONAL = 'traditional';
const YEAR_ROUND = 'yearround';

const CANCELLATIONS = 'cancellations';
const DELAYS = 'delays';
const EXCEPTIONS = 'exceptions';
const HOLIDAYS = 'holidays';
const TRACK_OUT = 'trackout';
const VACATIONS = 'vacations';
const WORKDAYS = 'workdays';

const TRACK1 = 'track1';
const TRACK2 = 'track2';
const TRACK3 = 'track3';
const TRACK4 = 'track4';
const TRACKS = [
    TRACK1,
    TRACK2,
    TRACK3,
    TRACK4
];

const CALENDAR_TYPES = {
    [MODIFIED]: {
        [EXCEPTIONS]: [
            HOLIDAYS,
            TRACK_OUT,
            VACATIONS,
            WORKDAYS
        ]
    },
    [TRADITIONAL]: {
        [EXCEPTIONS]: [
            HOLIDAYS,
            VACATIONS,
            WORKDAYS
        ]
    },
    [YEAR_ROUND]: {
        [EXCEPTIONS]: [
            TRACK_OUT,
            VACATIONS,
            WORKDAYS
        ]
    }
};

module.exports = {
    CALENDAR_TYPES: CALENDAR_TYPES,
    CANCELLATIONS: CANCELLATIONS,
    DELAYS: DELAYS,
    EXCEPTIONS: EXCEPTIONS,
    HOLIDAYS: HOLIDAYS,
    MODIFIED: MODIFIED,
    TRACK_OUT: TRACK_OUT,
    TRACK1: TRACK1,
    TRACK2: TRACK2,
    TRACK3: TRACK3,
    TRACK4: TRACK4,
    TRACKS: TRACKS,
    TRADITIONAL: TRADITIONAL,
    YEAR_ROUND: YEAR_ROUND
};