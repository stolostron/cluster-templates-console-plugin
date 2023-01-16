import generateInstanceYaml from './instanceYaml';

import clusterTemplate from '../mocks/clusterTemplateExample.json';
import { readFileSync } from 'fs';

describe('Download Instance yaml', () => {
  const expected = readFileSync(`${__dirname}/../mocks/downloadYamlResult.yaml`, {
    encoding: 'utf-8',
  });

  it('should generate correct instance yaml', () => {
    const text = generateInstanceYaml(clusterTemplate);
    expect(text).toEqual(expected);
  });
});
