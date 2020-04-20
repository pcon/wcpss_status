const DATE_FORMAT = 'YYYY-MM-DD';

const MODIFIED = 'modified';
const TRADITIONAL = 'traditional';
const YEAR_ROUND = 'yearround';

const CANCELLATIONS = 'cancellations';
const DELAYS = 'delays';
const EOQ = 'EOQ';
const EXCEPTIONS = 'exceptions';
const FIRST_DAY = 'FIRST_DAY';
const HOLIDAYS = 'holidays';
const LAST_DAY = 'LAST_DAY';
const MAKEUP = 'makeup';
const REPORT_CARD = 'REPORT_CARD';
const SPECIALS = 'specials';
const TRACK_OUT = 'trackout';
const VACATIONS = 'vacations';
const WORKDAYS = 'workdays';

const SPECIAL_TYPES = [
    EOQ,
    FIRST_DAY,
    LAST_DAY,
    REPORT_CARD
];

const SPECIALS_MAP = {
    EOQ: 'End of Nine Weeks',
    FIRST_DAY: 'First Day',
    LAST_DAY: 'Last Day',
    REPORT_CARD: 'Report Card'
};

const GLOBAL_EXCEPTIONS = [
    CANCELLATIONS,
    DELAYS
];

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

const DAY_FORMAT = {
    [TRADITIONAL]: false,
    [MODIFIED]: false,
    [YEAR_ROUND]: {
        [TRACK1]: false,
        [TRACK2]: false,
        [TRACK3]: false,
        [TRACK4]: false
    }
};

module.exports = {
    CALENDAR_TYPES: CALENDAR_TYPES,
    CANCELLATIONS: CANCELLATIONS,
    DATE_FORMAT: DATE_FORMAT,
    DAY_FORMAT: DAY_FORMAT,
    DELAYS: DELAYS,
    EOQ: EOQ,
    EXCEPTIONS: EXCEPTIONS,
    FIRST_DAY: FIRST_DAY,
    GLOBAL_EXCEPTIONS: GLOBAL_EXCEPTIONS,
    HOLIDAYS: HOLIDAYS,
    LAST_DAY: LAST_DAY,
    MAKEUP: MAKEUP,
    MODIFIED: MODIFIED,
    REPORT_CARD: REPORT_CARD,
    SPECIAL_TYPES: SPECIAL_TYPES,
    SPECIALS_MAP: SPECIALS_MAP,
    SPECIALS: SPECIALS,
    TRACK_OUT: TRACK_OUT,
    TRACK1: TRACK1,
    TRACK2: TRACK2,
    TRACK3: TRACK3,
    TRACK4: TRACK4,
    TRACKS: TRACKS,
    TRADITIONAL: TRADITIONAL,
    YEAR_ROUND: YEAR_ROUND
};