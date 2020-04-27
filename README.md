# Wake County Public School System (WCPSS) API

This repo provides an API for the WCPSS calendar.  It is built nightly at 01:05 AM (0105) Eastern Time or whenever the repository is updated.  I pushed the time an hour later to not have to worry about DST changes.  If you need better granularity, either run it yourself or look at using one of the other forward looking endpoints.

## Available Endpoints

| Request | Endpoint | Description |
| :-----: | :------- | :---------- |
| [GET](/wcpss_status/api/today/) | `/api/today/` | Get today's status |
| [GET](/wcpss_status/api/tomorrow/) | `/api/tomorrow/` | Get tomorrow's status |
| [GET](/wcpss_status/api/thisweek/) | `/api/thisweek/` | Get this week's status |
| [GET](/wcpss_status/api/nextweek/) | `/api/nextweek/` | Get next week's status |

# Implementation notes

- For the week views, the first day of the week is Monday following the ISO week standard.  For people using this in conjunction with [Home Assistant](https://www.home-assistant.io/) you can get the index into the array by using `now().weekday()`

# Todo List
- [X] Define structure for data
- [X] Add 2019-2020 and 2020-2021 calendar years for all types
- [X] Add validation for data files
- [X] Add linting for all scripts
- [X] Add endpoint for "today"
- [X] Add endpoint for "tomorrow"
- [X] Add endpoint for "this week"
- [X] Add endpoint for "next week"
- [ ] Add calendar view