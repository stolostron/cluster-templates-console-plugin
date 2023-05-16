import { createIcon } from '@patternfly/react-icons/dist/esm/createIcon';
import React from 'react';

const PaperIcon = () => {
  const Icon = createIcon({
    svgPath:
      'M28,4.38H12a.7.7,0,0,0-.44.18l-4,4a.59.59,0,0,0-.15.28c0,.05,0,.11,0,.16V31a.62.62,0,0,0,.62.62H28a.62.62,0,0,0,.62-.62V5A.62.62,0,0,0,28,4.38ZM11.38,6.51V8.38H9.51Zm16,23.87H8.62V9.62H12A.62.62,0,0,0,12.62,9V5.62H27.38ZM12,13.38a.62.62,0,0,0,0,1.24h6a.62.62,0,0,0,0-1.24ZM11.38,18a.62.62,0,0,0,.62.62H24a.62.62,0,0,0,0-1.24H12A.62.62,0,0,0,11.38,18ZM24,21.38H12a.62.62,0,0,0,0,1.24H24A.62.62,0,0,0,24,21.38ZM24,25.38H12a.62.62,0,0,0,0,1.24H24A.62.62,0,0,0,24,25.38Z',
    width: 36,
    height: 36,
  });
  return <Icon />;
};

export default PaperIcon;
