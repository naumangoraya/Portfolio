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
import { formatTextWithBackticks } from '../../utils/textFormatting';
import toast from 'react-hot-toast';

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

  .admin-controls {
    margin: 20px 0;
    display: flex;
    gap: 10px;
    justify-content: center;

    .add-button {
      background: var(--green);
      color: var(--navy);
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 4px;
      font-weight: 600;
      font-size: var(--fz-sm);

      &:hover {
        background: var(--light-green);
      }
    }
  }
`;

const StyledModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  .modal-content {
    background: var(--navy);
    border: 1px solid var(--green);
    border-radius: 8px;
    padding: 30px;
    max-width: 600px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;

    h3 {
      color: var(--lightest-slate);
      margin-bottom: 20px;
      font-size: var(--fz-xl);
    }

    .form-group {
      margin-bottom: 20px;

      label {
        display: block;
        color: var(--green);
        font-family: var(--font-mono);
        font-size: var(--fz-sm);
        margin-bottom: 5px;
        font-weight: 600;
      }

      input, textarea {
        width: 100%;
        padding: 10px;
        background: var(--light-navy);
        border: 1px solid var(--lightest-navy);
        border-radius: 4px;
        color: var(--lightest-slate);
        font-size: var(--fz-sm);

        &:focus {
          outline: none;
          border-color: var(--green);
        }
      }

      textarea {
        min-height: 100px;
        resize: vertical;
      }

      .checkbox-group {
        display: flex;
        align-items: center;
        gap: 10px;

        input[type="checkbox"] {
          width: auto;
        }
      }
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 30px;

      button {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        font-size: var(--fz-sm);

        &.save {
          background: var(--green);
          color: var(--navy);
        }

        &.cancel {
          background: var(--light-slate);
          color: var(--lightest-slate);
        }

        &:hover {
          opacity: 0.8;
        }
      }
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

  .admin-job-controls {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid var(--lightest-navy);
    display: flex;
    gap: 10px;
    
    button {
      background: var(--green);
      color: var(--navy);
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      font-size: var(--fz-sm);
      cursor: pointer;
      font-weight: 600;
      
      &:hover {
        background: var(--light-green);
      }
      
      &.delete {
        background: #ff6b6b;
        color: white;
        
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

const EditableJobs = ({ data = [] }) => {
  const [activeTabId, setActiveTabId] = useState(0);
  const [tabFocus, setTabFocus] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [jobData, setJobData] = useState(data);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    dates: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    achievements: '',
    responsibilities: '',
    tech: '',
    companyWebsite: '',
    order: 0,
    isActive: true,
    type: 'Full-time'
  });

  const tabs = useRef([]);
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { isAdmin, editMode } = useAuth();

  // Dummy data to display when no data comes from database
  const dummyJobs = [
    {
      _id: 'dummy1',
      company: "TechCorp Solutions",
      title: "Senior Full Stack Developer",
      dates: "Jan 2023 - Present",
      location: "San Francisco, CA",
      description: "Leading development of enterprise web applications using React, Node.js, and MongoDB. Mentoring junior developers and implementing best practices for code quality and performance.",
      tech: ["React", "Node.js", "MongoDB", "TypeScript", "AWS"]
    },
    {
      _id: 'dummy2',
      company: "InnovateLabs",
      title: "Frontend Developer",
      dates: "Mar 2021 - Dec 2022",
      location: "New York, NY",
      description: "Built responsive user interfaces and implemented modern frontend architectures. Collaborated with design and backend teams to deliver seamless user experiences.",
      tech: ["React", "Vue.js", "Sass", "Webpack", "Jest"]
    },
    {
      _id: 'dummy3',
      company: "StartupHub",
      title: "Software Engineer",
      dates: "Jun 2020 - Feb 2021",
      location: "Austin, TX",
      description: "Developed features for a SaaS platform, focusing on user authentication, payment processing, and real-time notifications.",
      tech: ["Python", "Django", "PostgreSQL", "Redis", "Docker"]
    }
  ];

  // Use dummy data if no real data is provided, otherwise use jobData state
  const jobsToDisplay = jobData && jobData.length > 0 ? jobData : dummyJobs;

  useEffect(() => {
    setJobData(data);
  }, [data]);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const jobPayload = {
      ...formData,
      tech: formData.tech.split(',').map(t => t.trim()).filter(t => t),
      achievements: formData.achievements.split(',').map(a => a.trim()).filter(a => a),
      responsibilities: formData.responsibilities.split(',').map(r => r.trim()).filter(r => r)
    };

    try {
      if (editingJob) {
        // Update existing job
        const response = await fetch(`/api/jobs/${editingJob._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          },
          body: JSON.stringify(jobPayload),
        });

        if (response.ok) {
          const updatedJob = await response.json();
          setJobData(prev => prev.map(j => j._id === editingJob._id ? updatedJob.job : j));
          toast.success('Job updated successfully!');
        } else {
          toast.error('Failed to update job');
        }
      } else {
        // Create new job
        const response = await fetch('/api/jobs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          },
          body: JSON.stringify(jobPayload),
        });

        if (response.ok) {
          const newJob = await response.json();
          setJobData(prev => [...prev, newJob.job]);
          toast.success('Job created successfully!');
        } else {
          toast.error('Failed to create job');
        }
      }

      setIsModalOpen(false);
      setEditingJob(null);
      resetForm();
    } catch (error) {
      console.error('Error saving job:', error);
      toast.error('An error occurred while saving the job');
    }
  };

  const handleEdit = (job) => {
    setEditingJob(job);
    setFormData({
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      dates: job.dates || '',
      startDate: job.startDate || '',
      endDate: job.endDate || '',
      isCurrent: job.isCurrent || false,
      description: job.description || '',
      achievements: Array.isArray(job.achievements) ? job.achievements.join(', ') : '',
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join(', ') : '',
      tech: Array.isArray(job.tech) ? job.tech.join(', ') : '',
      companyWebsite: job.companyWebsite || '',
      order: job.order || 0,
      isActive: job.isActive !== false,
      type: job.type || 'Full-time'
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        setJobData(prev => prev.filter(j => j._id !== jobId));
        toast.success('Job deleted successfully!');
        // Reset active tab if we deleted the current one
        if (activeTabId >= jobData.length - 1) {
          setActiveTabId(Math.max(0, jobData.length - 2));
        }
      } else {
        toast.error('Failed to delete job');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('An error occurred while deleting the job');
    }
  };

  const handleAdd = () => {
    setEditingJob(null);
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      location: '',
      dates: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      achievements: '',
      responsibilities: '',
      tech: '',
      companyWebsite: '',
      order: 0,
      isActive: true,
      type: 'Full-time'
    });
  };

  return (
    <>
      <StyledJobsSection id="jobs" ref={revealContainer}>
        <h2 className="numbered-heading">Experience & Trainings</h2>

        {isAdmin && editMode && (
          <div className="admin-controls">
            <button className="add-button" onClick={handleAdd}>
              Add New Job
            </button>
          </div>
        )}

        <div className="inner">
          <StyledTabList role="tablist" aria-label="Job tabs" onKeyDown={e => onKeyDown(e)}>
            {jobsToDisplay.map((job, i) => {
              const { company } = job;
              return (
                <StyledTabButton
                  key={job._id || i}
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
                <CSSTransition key={job._id || i} in={activeTabId === i} timeout={250} classNames="fade">
                  <StyledTabPanel
                    id={`panel-${i}`}
                    role="tabpanel"
                    tabIndex={activeTabId === i ? '0' : '-1'}
                    aria-labelledby={`tab-${i}`}
                    aria-hidden={activeTabId !== i}
                    hidden={activeTabId !== i}>
                    <h3>
                      <span>{formatTextWithBackticks(title)}</span>
                      <span className="company">
                        &nbsp;@&nbsp;
                        <span className="inline-link">
                          {formatTextWithBackticks(company)}
                        </span>
                      </span>
                    </h3>

                    <p className="range">{dates}</p>
                    {location && <p className="location">📍 {location}</p>}

                    <div className="description">{formatTextWithBackticks(description)}</div>
                    
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

                    {isAdmin && editMode && (
                      <div className="admin-job-controls">
                        <button onClick={() => handleEdit(job)}>Edit</button>
                        <button className="delete" onClick={() => handleDelete(job._id)}>Delete</button>
                      </div>
                    )}
                  </StyledTabPanel>
                </CSSTransition>
              );
            })}
          </StyledTabPanels>
        </div>
      </StyledJobsSection>

      {isModalOpen && (
        <StyledModal onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div className="modal-content">
            <h3>{editingJob ? 'Edit Job' : 'Add New Job'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Job Title *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Company *</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="dates">Dates (e.g., Jan 2023 - Present)</label>
                <input
                  type="text"
                  id="dates"
                  name="dates"
                  value={formData.dates}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="tech">Technologies (comma separated)</label>
                <input
                  type="text"
                  id="tech"
                  name="tech"
                  value={formData.tech}
                  onChange={handleInputChange}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div className="form-group">
                <label htmlFor="achievements">Achievements (comma separated)</label>
                <input
                  type="text"
                  id="achievements"
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleInputChange}
                  placeholder="Increased performance by 40%, Led team of 5"
                />
              </div>

              <div className="form-group">
                <label htmlFor="responsibilities">Responsibilities (comma separated)</label>
                <input
                  type="text"
                  id="responsibilities"
                  name="responsibilities"
                  value={formData.responsibilities}
                  onChange={handleInputChange}
                  placeholder="Lead development, Code reviews, Mentoring"
                />
              </div>

              <div className="form-group">
                <label htmlFor="companyWebsite">Company Website</label>
                <input
                  type="url"
                  id="companyWebsite"
                  name="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Job Type</label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  placeholder="Full-time, Part-time, Contract, Internship"
                />
              </div>

              <div className="form-group">
                <label htmlFor="order">Order</label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="isCurrent"
                    name="isCurrent"
                    checked={formData.isCurrent}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="isCurrent">Current Position</label>
                </div>
              </div>

              <div className="form-group">
                <div className="checkbox-group">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="isActive">Active</label>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="save">
                  {editingJob ? 'Update' : 'Create'} Job
                </button>
              </div>
            </form>
          </div>
        </StyledModal>
      )}
    </>
  );
};

EditableJobs.propTypes = {
  data: PropTypes.array,
};

export default EditableJobs;
