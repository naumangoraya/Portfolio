'use client';

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import { KEY_CODES } from '@utils';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledJobsSection = styled.section`
  max-width: 700px;

  .inner {
    display: flex;

    @media (max-width: 600px) {
      display: block;
    }

    // Prevent container from jumping
    @media (min-width: 700px) {
      min-height: 340px;
    }
  }
`;

const StyledTabList = styled.div`
  position: relative;
  z-index: 3;
  width: max-content;
  padding: 0;
  margin: 0;
  list-style: none;

  @media (max-width: 600px) {
    display: flex;
    overflow-x: auto;
    width: calc(100% + 100px);
    padding-left: 50px;
    margin-left: -50px;
    margin-bottom: 30px;
  }
  @media (max-width: 480px) {
    width: calc(100% + 50px);
    padding-left: 25px;
    margin-left: -25px;
  }

  li {
    &:first-of-type {
      @media (max-width: 600px) {
        margin-left: 50px;
      }
      @media (max-width: 480px) {
        margin-left: 25px;
      }
    }
    &:last-of-type {
      @media (max-width: 600px) {
        padding-right: 50px;
      }
      @media (max-width: 480px) {
        padding-right: 25px;
      }
    }
  }
`;

const StyledTabButton = styled.button`
  ${({ theme }) => theme.mixins.link};
  display: flex;
  align-items: center;
  width: 100%;
  height: var(--tab-height);
  padding: 0 20px 2px;
  border-left: 2px solid var(--lightest-navy);
  background-color: transparent;
  color: ${({ isActive }) => (isActive ? 'var(--green)' : 'var(--slate)')};
  font-family: var(--font-mono);
  font-size: var(--fz-xs);
  text-align: left;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 0 15px 2px;
  }
  @media (max-width: 600px) {
    ${({ theme }) => theme.mixins.flexCenter};
    min-width: 120px;
    padding: 0 15px;
    border-left: 0;
    border-bottom: 2px solid var(--lightest-navy);
    text-align: center;
  }

  &:hover,
  &:focus {
    background-color: var(--light-navy);
  }
`;

const StyledTabPanels = styled.div`
  position: relative;
  width: 100%;
  margin-left: 20px;

  @media (max-width: 600px) {
    margin-left: 0;
  }
`;

const StyledTabPanel = styled.div`
  width: 100%;
  height: auto;
  padding: 10px 5px;

  ul {
    ${({ theme }) => theme.mixins.fancyList};
  }

  h3 {
    margin-bottom: 2px;
    font-size: var(--fz-xxl);
    font-weight: 500;
    line-height: 1.3;

    .company {
      color: var(--green);
    }
  }

  .range {
    margin-bottom: 25px;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }

  .location {
    margin-bottom: 15px;
    color: var(--light-slate);
    font-size: var(--fz-sm);
  }

  .description {
    color: var(--light-slate);
    line-height: 1.6;
    margin-bottom: 20px;
  }

  .tech-stack {
    margin-top: 20px;
    
    strong {
      color: var(--lightest-slate);
      font-size: var(--fz-sm);
      margin-bottom: 10px;
      display: block;
    }
    
    .tech-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .tech-tag {
        background: var(--navy);
        color: var(--green);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: var(--fz-xs);
        font-family: var(--font-mono);
      }
    }
  }
`;

const StyledHighlight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 2px;
  height: var(--tab-height);
  border-radius: 4px;
  background: var(--green);
  transform: translateY(calc(${({ activeTabId }) => activeTabId} * var(--tab-height)));
  transition: transform 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition-delay: 0.1s;

  @media (max-width: 600px) {
    top: auto;
    bottom: 0;
    width: 100%;
    max-width: var(--tab-width);
    height: 2px;
    margin-left: 50px;
    transform: translateX(calc(${({ activeTabId }) => activeTabId} * var(--tab-width)));
  }
  @media (max-width: 480px) {
    margin-left: 25px;
  }
`;

const Jobs = ({ data = [] }) => {
  const [activeTabId, setActiveTabId] = useState(0);
  const [tabFocus, setTabFocus] = useState(null);
  const tabs = useRef([]);
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Dummy data to display when no data comes from database
  const dummyJobs = [
    {
      company: "TechCorp Solutions",
      title: "Senior Full Stack Developer",
      dates: "Jan 2023 - Present",
      location: "San Francisco, CA",
      description: "Leading development of enterprise web applications using React, Node.js, and MongoDB. Mentoring junior developers and implementing best practices for code quality and performance.",
      tech: ["React", "Node.js", "MongoDB", "TypeScript", "AWS"]
    },
    {
      company: "InnovateLabs",
      title: "Frontend Developer",
      dates: "Mar 2021 - Dec 2022",
      location: "New York, NY",
      description: "Built responsive user interfaces and implemented modern frontend architectures. Collaborated with design and backend teams to deliver seamless user experiences.",
      tech: ["React", "Vue.js", "Sass", "Webpack", "Jest"]
    },
    {
      company: "StartupHub",
      title: "Software Engineer",
      dates: "Jun 2020 - Feb 2021",
      location: "Austin, TX",
      description: "Developed features for a SaaS platform, focusing on user authentication, payment processing, and real-time notifications.",
      tech: ["Python", "Django", "PostgreSQL", "Redis", "Docker"]
    },
    {
      company: "Digital Dynamics",
      title: "Junior Developer",
      dates: "Jan 2020 - May 2020",
      location: "Remote",
      description: "Assisted in building client websites and e-commerce solutions. Learned modern web development practices and tools.",
      tech: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"]
    }
  ];

  // Use dummy data if no real data is provided
  const jobsToDisplay = data && data.length > 0 ? data : dummyJobs;

  // Re-render when data changes
  useEffect(() => {
    if (jobsToDisplay && jobsToDisplay.length > 0) {
      setActiveTabId(0);
    }
  }, [jobsToDisplay]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, [prefersReducedMotion]);

  const focusTab = () => {
    if (tabs.current[tabFocus]) {
      tabs.current[tabFocus].focus();
      return;
    }
    // If we're at the end, move to the start
    if (tabFocus >= tabs.current.length) {
      setTabFocus(0);
    }
    // If we're at the start, move to the end
    if (tabFocus < 0) {
      setTabFocus(tabs.current.length - 1);
    }
  };

  // Only re-run the effect if tabFocus changes
  useEffect(() => focusTab(), [tabFocus]);

  // Focus on tabs when using up & down arrow keys
  const onKeyDown = e => {
    switch (e.key) {
      case KEY_CODES.ARROW_UP: {
        e.preventDefault();
        setTabFocus(tabFocus - 1);
        break;
      }

      case KEY_CODES.ARROW_DOWN: {
        e.preventDefault();
        setTabFocus(tabFocus + 1);
        break;
      }

      default: {
        break;
      }
    }
  };

  return (
    <StyledJobsSection id="jobs" ref={revealContainer}>
      <h2 className="numbered-heading">Experience & Trainings</h2>

      <div className="inner">
        <StyledTabList role="tablist" aria-label="Job tabs" onKeyDown={e => onKeyDown(e)}>
          {jobsToDisplay.map((job, i) => {
            const { company } = job;
            return (
              <StyledTabButton
                key={i}
                isActive={activeTabId === i}
                onClick={() => setActiveTabId(i)}
                ref={el => (tabs.current[i] = el)}
                id={`tab-${i}`}
                role="tab"
                tabIndex={activeTabId === i ? '0' : '-1'}
                aria-selected={activeTabId === i ? true : false}
                aria-controls={`panel-${i}`}>
                <span>{company}</span>
              </StyledTabButton>
            );
          })}
          <StyledHighlight activeTabId={activeTabId} />
        </StyledTabList>

        <StyledTabPanels>
          {jobsToDisplay.map((job, i) => {
            const { title, company, location, dates, description, tech } = job;

            return (
              <CSSTransition key={i} in={activeTabId === i} timeout={250} classNames="fade">
                <StyledTabPanel
                  id={`panel-${i}`}
                  role="tabpanel"
                  tabIndex={activeTabId === i ? '0' : '-1'}
                  aria-labelledby={`tab-${i}`}
                  aria-hidden={activeTabId !== i}
                  hidden={activeTabId !== i}>
                  <h3>
                    <span>{title}</span>
                    <span className="company">
                      &nbsp;@&nbsp;
                      <span className="inline-link">
                        {company}
                      </span>
                    </span>
                  </h3>

                  <p className="range">{dates}</p>
                  {location && <p className="location">📍 {location}</p>}

                  <div className="description">{description}</div>
                  
                  {tech && tech.length > 0 && (
                    <div className="tech-stack">
                      <strong>Technologies:</strong>
                      <div className="tech-tags">
                        {tech.map((techItem, index) => (
                          <span key={index} className="tech-tag">{techItem}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </StyledTabPanel>
              </CSSTransition>
            );
          })}
        </StyledTabPanels>
      </div>
    </StyledJobsSection>
  );
};

Jobs.propTypes = {
  data: PropTypes.array,
};

export default Jobs;
