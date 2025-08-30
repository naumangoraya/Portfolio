'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const StyledProjectsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .archive-link {
    font-family: var(--font-mono);
    font-size: var(--fz-sm);
    &:after {
      bottom: 0.1em;
    }
  }

  .projects-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 15px;
    position: relative;
    margin-top: 50px;

    @media (max-width: 1080px) {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }

  .more-button {
    ${({ theme }) => theme.mixins.button};
    margin: 80px auto 0;
  }
`;

const StyledProject = styled.li`
  position: relative;
  cursor: default;
  transition: var(--transition);

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .project-inner {
        transform: translateY(-7px);
      }
    }
  }

  a {
    position: relative;
    z-index: 1;
  }

  .project-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
    overflow: auto;
  }

  .project-top {
    ${({ theme }) => theme.mixins.flexBetween};
    margin-bottom: 35px;

    .folder {
      color: var(--green);
      svg {
        width: 40px;
        height: 40px;
      }
    }

    .project-links {
      display: flex;
      align-items: center;
      margin-right: -10px;
      color: var(--light-slate);

      a {
        ${({ theme }) => theme.mixins.flexCenter};
        padding: 5px 7px;

        &.external {
          svg {
            width: 22px;
            height: 22px;
            margin-top: -4px;
          }
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .project-title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);

    a {
      position: static;

      &:before {
        content: '';
        display: block;
        position: absolute;
        z-index: 0;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }
    }
  }

  .project-description {
    color: var(--light-slate);
    font-size: 17px;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  .project-tech-list {
    display: flex;
    align-items: flex-end;
    flex-grow: 1;
    flex-wrap: wrap;
    padding: 0;
    margin: 20px 0 0 0;
    list-style: none;

    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;

      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
  }
`;

const Projects = ({ data = [] }) => {
  const [showMore, setShowMore] = useState(false);
  const revealTitle = useRef(null);
  const revealArchiveLink = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Dummy data to display when no data comes from database
  const dummyProjects = [
    {
      title: "E-commerce Platform",
      description: "A full-stack e-commerce solution built with React, Node.js, and MongoDB. Features include user authentication, product management, shopping cart, and payment processing.",
      summary: "Modern e-commerce platform with React and Node.js",
      image: { url: "/demo.png", alt: "E-commerce Platform" },
      github: "https://github.com/example/ecommerce",
      external: "https://ecommerce-demo.com",
      tech: ["React", "Node.js", "MongoDB", "Stripe", "Redux"],
      featured: true,
      showInProjects: true
    },
    {
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates, team collaboration, and progress tracking. Built with modern web technologies.",
      summary: "Collaborative task management with real-time updates",
      image: { url: "/demo.png", alt: "Task Management App" },
      github: "https://github.com/example/task-manager",
      external: "https://task-manager-demo.com",
      tech: ["Vue.js", "Express", "Socket.io", "PostgreSQL", "JWT"],
      featured: true,
      showInProjects: true
    },
    {
      title: "Weather Dashboard",
      description: "A weather application that displays current weather conditions and forecasts for multiple cities. Integrates with OpenWeatherMap API and features a clean, responsive design.",
      summary: "Weather dashboard with API integration",
      image: { url: "/demo.png", alt: "Weather Dashboard" },
      github: "https://github.com/example/weather-app",
      external: "https://weather-demo.com",
      tech: ["HTML", "CSS", "JavaScript", "Weather API", "LocalStorage"],
      featured: false,
      showInProjects: true
    },
    {
      title: "Portfolio Website",
      description: "A responsive portfolio website built with Next.js and styled-components. Features smooth animations, dark mode, and mobile-first design.",
      summary: "Modern portfolio website with Next.js",
      image: { url: "/demo.png", alt: "Portfolio Website" },
      github: "https://github.com/example/portfolio",
      external: "https://portfolio-demo.com",
      tech: ["Next.js", "Styled Components", "Framer Motion", "TypeScript"],
      featured: false,
      showInProjects: true
    },
    {
      title: "Chat Application",
      description: "Real-time chat application with user authentication, private messaging, and group chat functionality. Built with React and Firebase.",
      summary: "Real-time chat app with Firebase backend",
      image: { url: "/demo.png", alt: "Chat Application" },
      github: "https://github.com/example/chat-app",
      external: "https://chat-demo.com",
      tech: ["React", "Firebase", "Material-UI", "Real-time Database"],
      featured: false,
      showInProjects: true
    },
    {
      title: "Recipe Finder",
      description: "A recipe discovery application that helps users find recipes based on available ingredients. Features search, filtering, and recipe saving functionality.",
      summary: "Recipe discovery app with ingredient search",
      image: { url: "/demo.png", alt: "Recipe Finder" },
      github: "https://github.com/example/recipe-finder",
      external: "https://recipe-finder-demo.com",
      tech: ["React", "Node.js", "Spoonacular API", "CSS Grid", "LocalStorage"],
      featured: false,
      showInProjects: true
    }
  ];

  // Use dummy data if no real data is provided
  const projectsToDisplay = data && data.length > 0 ? data : dummyProjects;

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, [prefersReducedMotion]);

  const GRID_LIMIT = 6;
  const projects = projectsToDisplay.filter(project => project.showInProjects !== false);
  const firstSix = projects.slice(0, GRID_LIMIT);
  const projectsToShow = showMore ? projects : firstSix;

  const projectInner = project => {
    const { github, external, title, tech, description, summary } = project;

    return (
      <div className="project-inner">
        <header>
          <div className="project-top">
            <div className="folder">
              <Icon name="Folder" />
            </div>
            <div className="project-links">
              {github && (
                <a href={github} aria-label="GitHub Link" target="_blank" rel="noreferrer">
                  <Icon name="GitHub" />
                </a>
              )}
              {external && (
                <a
                  href={external}
                  aria-label="External Link"
                  className="external"
                  target="_blank"
                  rel="noreferrer">
                  <Icon name="External" />
                </a>
              )}
            </div>
          </div>

          <h3 className="project-title">
            {external ? (
              <a href={external} target="_blank" rel="noreferrer">
                {title}
              </a>
            ) : (
              <span>{title}</span>
            )}
          </h3>

          <div className="project-description">
            {description || summary}
          </div>
        </header>

        <footer>
          {tech && (
            <ul className="project-tech-list">
              {tech.map((techItem, i) => (
                <li key={i}>{techItem}</li>
              ))}
            </ul>
          )}
        </footer>
      </div>
    );
  };

  return (
    <StyledProjectsSection>
      <h2 ref={revealTitle}>Other Noteworthy Projects</h2>

      <Link className="inline-link archive-link" href="/archive" ref={revealArchiveLink}>
        view the archive
      </Link>

      <ul className="projects-grid">
        {prefersReducedMotion ? (
          <>
            {projectsToShow &&
              projectsToShow.map((project, i) => (
                <StyledProject key={i}>{projectInner(project)}</StyledProject>
              ))}
          </>
        ) : (
          <TransitionGroup component={null}>
            {projectsToShow &&
              projectsToShow.map((project, i) => (
                <CSSTransition
                  key={i}
                  classNames="fadeup"
                  timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                  exit={false}>
                  <StyledProject
                    key={i}
                    ref={el => (revealProjects.current[i] = el)}
                    style={{
                      transitionDelay: `${i >= GRID_LIMIT ? (i - GRID_LIMIT) * 100 : 0}ms`,
                    }}>
                    {projectInner(project)}
                  </StyledProject>
                </CSSTransition>
              ))}
          </TransitionGroup>
        )}
      </ul>

      {projects.length > GRID_LIMIT && (
        <button className="more-button" onClick={() => setShowMore(!showMore)}>
          Show {showMore ? 'Less' : 'More'}
        </button>
      )}
    </StyledProjectsSection>
  );
};

Projects.propTypes = {
  data: PropTypes.array,
};

export default Projects;
