// src/components/Loader.js

import React from 'react';
import { css } from '@emotion/react';
import { RingLoader } from 'react-spinners';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <RingLoader color={'#4A90E2'} css={override} size={100} />
    </div>
  );
};

export default Loader;
