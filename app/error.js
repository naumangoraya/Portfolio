'use client';

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const StyledError = styled.main`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  min-height: 100vh;
  padding: 0 20px;
  text-align: center;

  h1 {
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-xxl), 5vw, 60px);
    margin-bottom: 10px;
  }

  p {
    color: var(--slate);
    max-width: 500px;
    margin-bottom: 30px;
  }

  button {
    ${({ theme }) => theme.mixins.bigButton};
  }
`;

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <StyledError>
      <h1>Something went wrong</h1>
      <p>
        This page failed to load. It is usually temporary — try again, and if it keeps happening the
        database may be unreachable.
      </p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </StyledError>
  );
}

Error.propTypes = {
  error: PropTypes.object,
  reset: PropTypes.func.isRequired,
};
