'use client';

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledEducationSection = styled.section`
  max-width: 1000px;
  margin: 0 auto 100px;

  .education-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 30px;
    margin-top: 50px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  .education-card {
    background-color: var(--light-navy);
    border: 1px solid var(--lightest-navy);
    border-radius: 8px;
    padding: 30px;
    position: relative;
    transition: var(--transition);

    &:hover {
      transform: translateY(-5px);
      border-color: var(--green);
      box-shadow: 0 10px 30px -10px var(--green);
    }

    .quote-icon {
      position: absolute;
      top: 20px;
      left: 20px;
      font-size: 24px;
      color: var(--green);
      font-family: serif;
    }

    .degree-title {
      color: var(--lightest-slate);
      font-size: var(--fz-xl);
      font-weight: 600;
      margin-bottom: 10px;
      margin-top: 10px;
    }

    .institution {
      color: var(--green);
      font-size: var(--fz-lg);
      font-weight: 500;
      margin-bottom: 15px;
    }

    .dates {
      color: var(--slate);
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
    }

    .description {
      color: var(--slate);
      font-size: var(--fz-sm);
      line-height: 1.6;
      margin-top: 15px;
    }
  }
`;

const Education = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const educationData = [
    {
      degree: 'Bachelor of Computer Science',
      institution: 'FAST NUCES',
      dates: 'Aug 2021 - June 2025',
      description: 'Focused on computer science fundamentals, algorithms, data structures, and software engineering principles. Specialized in AI/ML courses and full-stack development.'
    },
    {
      degree: 'FSc Pre-Engineering',
      institution: 'Aspire College',
      dates: 'Aug 2019 - May 2021',
      description: 'Completed intermediate studies with focus on mathematics, physics, and chemistry. Developed strong analytical and problem-solving skills.'
    }
  ];

  return (
    <StyledEducationSection id="education" ref={revealContainer}>
      <h2 className="numbered-heading">Education</h2>

      <div className="education-grid">
        {educationData.map((edu, index) => (
          <div key={index} className="education-card">
            <div className="quote-icon">&quot;</div>
            <h3 className="degree-title">{edu.degree}</h3>
            <div className="institution">{edu.institution}</div>
            <div className="dates">{edu.dates}</div>
            <p className="description">{edu.description}</p>
          </div>
        ))}
      </div>
    </StyledEducationSection>
  );
};

export default Education; 