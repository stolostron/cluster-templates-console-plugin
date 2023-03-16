import truncate from 'lodash/truncate';

export const humanizeUrl = (url: string) => truncate(url, { length: 100 });

export const humanizeErrorMsg = (errorMsg: string) => truncate(errorMsg, { length: 500 });
