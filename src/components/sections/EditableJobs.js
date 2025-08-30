'use client';

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import { KEY_CODES } from '@utils';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
import { useAuth } from '../../contexts/AuthContext';

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

  .add-job-button {
    ${({ theme }) => theme.mixins.button};
    margin: 20px 0;
    background: var(--green);
    color: var(--navy);
    
    &:hover {
      background: var(--light-green);
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

  .edit-controls {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--lightest-navy);
    
    .edit-button {
      background: var(--green);
      color: var(--navy);
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: var(--fz-sm);
      cursor: pointer;
      margin-right: 10px;
      
      &:hover {
        background: var(--light-green);
      }
      
      &.delete {
        background: #ff6b6b;
        
        &:hover {
          background: #ff5252;
        }
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

const EditableJobs = ({ data = [], onUpdate }) => {
  const [activeTabId, setActiveTabId] = useState(0);
  const [tabFocus, setTabFocus] = useState(null);
  const [editingJob, setEditingJob] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    dates: '',
    description: '',
    tech: []
  });
  const tabs = useRef([]);
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { isAdmin } = useAuth();

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

  const startEditing = (job) => {
    setEditingJob(job._id || job.company);
    setEditValues({
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      dates: job.dates || '',
      description: job.description || '',
      tech: job.tech ? job.tech.join(', ') : ''
    });
  };

  const saveEdit = async () => {
    try {
      const jobData = {
        ...editValues,
        tech: editValues.tech.split(',').map(tech => tech.trim()).filter(tech => tech)
      };

      const response = await fetch('/api/jobs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({
          jobId: editingJob,
          updates: jobData
        }),
      });

      if (response.ok) {
        if (onUpdate) {
          onUpdate();
        }
        setEditingJob(null);
        setEditValues({});
      }
    } catch (error) {
      console.error('Error updating job:', error);
    }
  };

  const cancelEdit = () => {
    setEditingJob(null);
    setEditValues({});
  };

  const deleteJob = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const response = await fetch('/api/jobs', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({ jobId }),
      });

      if (response.ok) {
        if (onUpdate) {
          onUpdate();
        }
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const addNewJob = async () => {
    try {
      const jobData = {
        ...newJob,
        tech: newJob.tech.split(',').map(tech => tech.trim()).filter(tech => tech)
      };

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(jobData),
      });

      if (response.ok) {
        if (onUpdate) {
          onUpdate();
        }
        setNewJob({
          title: '',
          company: '',
          location: '',
          dates: '',
          description: '',
          tech: ''
        });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  const renderEditableField = (field, value, jobId) => {
    if (!isAdmin || editingJob !== jobId) {
      return value;
    }

    return (
      <input
        type="text"
        value={editValues[field] || ''}
        onChange={(e) => setEditValues({ ...editValues, [field]: e.target.value })}
        style={{
          background: 'transparent',
          border: '1px solid var(--green)',
          borderRadius: '4px',
          padding: '4px 8px',
          color: 'inherit',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          width: '100%'
        }}
      />
    );
  };

  return (
    <StyledJobsSection id="jobs" ref={revealContainer}>
      <h2 className="numbered-heading">Experience & Trainings</h2>

      {isAdmin && (
        <button 
          className="add-job-button"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel Add Job' : 'Add New Job'}
        </button>
      )}

      {showAddForm && isAdmin && (
        <div style={{ 
          background: 'var(--light-navy)', 
          padding: '20px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid var(--green)'
        }}>
          <h3 style={{ color: 'var(--green)', marginBottom: '15px' }}>Add New Job</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <input
              placeholder="Job Title"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              style={{ padding: '8px', background: 'var(--navy)', border: '1px solid var(--lightest-navy)', borderRadius: '4px', color: 'var(--lightest-slate)' }}
            />
            <input
              placeholder="Company"
              value={newJob.company}
              onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
              style={{ padding: '8px', background: 'var(--navy)', border: '1px solid var(--lightest-navy)', borderRadius: '4px', color: 'var(--lightest-slate)' }}
            />
            <input
              placeholder="Location"
              value={newJob.location}
              onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
              style={{ padding: '8px', background: 'var(--navy)', border: '1px solid var(--lightest-navy)', borderRadius: '4px', color: 'var(--lightest-slate)' }}
            />
            <input
              placeholder="Dates (e.g., Jan 2023 - Present)"
              value={newJob.dates}
              onChange={(e) => setNewJob({ ...newJob, dates: e.target.value })}
              style={{ padding: '8px', background: 'var(--navy)', border: '1px solid var(--lightest-navy)', borderRadius: '4px', color: 'var(--lightest-slate)' }}
            />
            <textarea
              placeholder="Job Description"
              value={newJob.description}
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              style={{ 
                padding: '8px', 
                background: 'var(--navy)', 
                border: '1px solid var(--lightest-navy)', 
                borderRadius: '4px', 
                color: 'var(--lightest-slate)',
                gridColumn: '1 / -1',
                minHeight: '80px',
                resize: 'vertical'
              }}
            />
            <input
              placeholder="Technologies (comma-separated)"
              value={newJob.tech}
              onChange={(e) => setNewJob({ ...newJob, tech: e.target.value })}
              style={{ padding: '8px', background: 'var(--navy)', border: '1px solid var(--lightest-navy)', borderRadius: '4px', color: 'var(--lightest-slate)' }}
            />
          </div>
          <button
            onClick={addNewJob}
            style={{
              background: 'var(--green)',
              color: 'var(--navy)',
              border: 'none',
              borderRadius: '4px',
              padding: '10px 20px',
              marginTop: '15px',
              cursor: 'pointer'
            }}
          >
            Add Job
          </button>
        </div>
      )}

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
            const { title, company, location, dates, description, tech, _id } = job;
            const jobId = _id || company;

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
                    <span>{renderEditableField('title', title, jobId)}</span>
                    <span className="company">
                      &nbsp;@&nbsp;
                      <span className="inline-link">
                        {renderEditableField('company', company, jobId)}
                      </span>
                    </span>
                  </h3>

                  <p className="range">{renderEditableField('dates', dates, jobId)}</p>
                  {location && <p className="location">📍 {renderEditableField('location', location, jobId)}</p>}

                  <div className="description">{renderEditableField('description', description, jobId)}</div>
                  
                  {tech && tech.length > 0 && (
                    <div className="tech-stack">
                      <strong>Technologies:</strong>
                      <div className="tech-tags">
                        {editingJob === jobId ? (
                          <input
                            type="text"
                            value={editValues.tech || ''}
                            onChange={(e) => setEditValues({ ...editValues, tech: e.target.value })}
                            placeholder="Enter technologies (comma-separated)"
                            style={{
                              background: 'transparent',
                              border: '1px solid var(--green)',
                              borderRadius: '4px',
                              padding: '4px 8px',
                              color: 'inherit',
                              fontFamily: 'inherit',
                              fontSize: 'inherit',
                              width: '100%'
                            }}
                          />
                        ) : (
                          tech.map((techItem, index) => (
                            <span key={index} className="tech-tag">{techItem}</span>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {isAdmin && (
                    <div className="edit-controls">
                      {editingJob === jobId ? (
                        <>
                          <button className="edit-button" onClick={saveEdit}>Save</button>
                          <button className="edit-button cancel" onClick={cancelEdit}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="edit-button" onClick={() => startEditing(job)}>Edit</button>
                          <button className="edit-button delete" onClick={() => deleteJob(jobId)}>Delete</button>
                        </>
                      )}
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

EditableJobs.propTypes = {
  data: PropTypes.array,
  onUpdate: PropTypes.func,
};

export default EditableJobs;
