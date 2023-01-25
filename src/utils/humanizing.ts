import truncate from 'lodash/truncate';

export const humanizeUrl = (url: string) => truncate(url, { length: 100 });
