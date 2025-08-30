'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';

const StyledJobsEditor = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    
    h2 {
      margin: 0;
      color: var(--lightest-slate);
    }
    
    .add-btn {
      background: var(--green);
      color: var(--light-navy);
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      
      &:hover {
        background: var(--light-green);
      }
    }
  }

  .jobs-grid {
    display: grid;
    gap: 20px;
    margin-bottom: 30px;
  }

  .job-card {
    background: var(--light-navy);
    border-radius: 8px;
    padding: 20px;
    border: 1px solid var(--navy);
    
    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
      
      .job-title {
        font-size: 1.2em;
        font-weight: 600;
        color: var(--lightest-slate);
        margin: 0 0 5px 0;
      }
      
      .job-company {
        color: var(--green);
        font-size: 1em;
        margin: 0;
      }
      
      .job-actions {
        display: flex;
        gap: 10px;
        
        button {
          background: none;
          border: 1px solid var(--slate);
          color: var(--light-slate);
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          
          &:hover {
            border-color: var(--green);
            color: var(--green);
          }
          
          &.delete {
            border-color: var(--red);
            color: var(--red);
            
            &:hover {
              background: var(--red);
              color: white;
            }
          }
        }
      }
    }
    
    .job-details {
      color: var(--light-slate);
      margin-bottom: 15px;
      
      .job-location, .job-dates, .job-type {
        margin: 5px 0;
        font-size: 0.9em;
      }
    }
    
    .job-description {
      color: var(--light-slate);
      margin-bottom: 15px;
      line-height: 1.6;
    }
    
    .job-tech {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .tech-tag {
        background: var(--navy);
        color: var(--green);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.8em;
        font-family: var(--font-mono);
      }
    }
  }

  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    
    .modal-content {
      background: var(--light-navy);
      border-radius: 8px;
      padding: 30px;
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      
      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        
        h3 {
          margin: 0;
          color: var(--lightest-slate);
        }
        
        .close-btn {
          background: none;
          border: none;
          color: var(--light-slate);
          font-size: 1.5em;
          cursor: pointer;
          
          &:hover {
            color: var(--green);
          }
        }
      }
      
      .form-group {
        margin-bottom: 20px;
        
        label {
          display: block;
          margin-bottom: 5px;
          color: var(--lightest-slate);
          font-weight: 500;
        }
        
        input, textarea, select {
          width: 100%;
          padding: 10px;
          border: 1px solid var(--navy);
          border-radius: 4px;
          background: var(--navy);
          color: var(--lightest-slate);
          font-size: 14px;
          
          &:focus {
            outline: none;
            border-color: var(--green);
          }
        }
        
        textarea {
          min-height: 100px;
          resize: vertical;
        }
        
        .tech-input {
          display: flex;
          gap: 10px;
          align-items: center;
          
          input {
            flex: 1;
          }
          
          button {
            background: var(--green);
            color: var(--light-navy);
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            
            &:hover {
              background: var(--light-green);
            }
          }
        }
        
        .tech-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
          
          .tech-tag {
            background: var(--navy);
            color: var(--green);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            display: flex;
            align-items: center;
            gap: 5px;
            
            .remove-btn {
              background: none;
              border: none;
              color: var(--red);
              cursor: pointer;
              font-size: 1.2em;
              padding: 0;
              
              &:hover {
                color: var(--light-red);
              }
            }
          }
        }
      }
      
      .form-actions {
        display: flex;
        gap: 15px;
        justify-content: flex-end;
        margin-top: 30px;
        
        button {
          padding: 10px 20px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          
          &.cancel {
            background: var(--navy);
            color: var(--light-slate);
            border: 1px solid var(--slate);
            
            &:hover {
              border-color: var(--green);
              color: var(--green);
            }
          }
          
          &.save {
            background: var(--green);
            color: var(--light-navy);
            border: none;
            
            &:hover {
              background: var(--light-green);
            }
          }
        }
      }
    }
  }
`;

const JobsEditor = () => {
  const [jobs, setJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    dates: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    tech: [],
    type: 'Full-time',
    order: 1
  });
  const [newTech, setNewTech] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/jobs');
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      toast.error('Failed to fetch jobs');
    }
  };

  const openModal = (job = null) => {
    if (job) {
      setEditingJob(job);
      setFormData({
        title: job.title || '',
        company: job.company || '',
        location: job.location || '',
        dates: job.dates || '',
        startDate: job.startDate ? new Date(job.startDate).toISOString().split('T')[0] : '',
        endDate: job.endDate ? new Date(job.endDate).toISOString().split('T')[0] : '',
        isCurrent: job.isCurrent || false,
        description: job.description || '',
        tech: job.tech || [],
        type: job.type || 'Full-time',
        order: job.order || 1
      });
    } else {
      setEditingJob(null);
      setFormData({
        title: '',
        company: '',
        location: '',
        dates: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: '',
        tech: [],
        type: 'Full-time',
        order: 1
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
    setFormData({
      title: '',
      company: '',
      location: '',
      dates: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      tech: [],
      type: 'Full-time',
      order: 1
    });
  };

  const addTech = () => {
    if (newTech.trim() && !formData.tech.includes(newTech.trim())) {
      setFormData(prev => ({
        ...prev,
        tech: [...prev.tech, newTech.trim()]
      }));
      setNewTech('');
    }
  };

  const removeTech = (techToRemove) => {
    setFormData(prev => ({
      ...prev,
      tech: prev.tech.filter(tech => tech !== techToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingJob ? `/api/jobs/${editingJob._id}` : '/api/jobs';
      const method = editingJob ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingJob ? 'Job updated successfully!' : 'Job created successfully!');
        fetchJobs();
        closeModal();
      } else {
        toast.error('Failed to save job');
      }
    } catch (error) {
      toast.error('Error saving job');
    }
  };

  const deleteJob = async (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        const response = await fetch(`/api/jobs/${jobId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Job deleted successfully!');
          fetchJobs();
        } else {
          toast.error('Failed to delete job');
        }
      } catch (error) {
        toast.error('Error deleting job');
      }
    }
  };

  return (
    <StyledJobsEditor>
      <div className="header">
        <h2>Manage Jobs</h2>
        <button className="add-btn" onClick={() => openModal()}>
          + Add New Job
        </button>
      </div>

      <div className="jobs-grid">
        {jobs.map((job) => (
          <div key={job._id} className="job-card">
            <div className="job-header">
              <div>
                <h3 className="job-title">{job.title}</h3>
                <p className="job-company">{job.company}</p>
              </div>
              <div className="job-actions">
                <button onClick={() => openModal(job)}>Edit</button>
                <button className="delete" onClick={() => deleteJob(job._id)}>Delete</button>
              </div>
            </div>
            
            <div className="job-details">
              <div className="job-location">📍 {job.location}</div>
              <div className="job-dates">📅 {job.dates}</div>
              <div className="job-type">💼 {job.type}</div>
            </div>
            
            <div className="job-description">{job.description}</div>
            
            {job.tech && job.tech.length > 0 && (
              <div className="job-tech">
                {job.tech.map((tech, index) => (
                  <span key={index} className="tech-tag">{tech}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingJob ? 'Edit Job' : 'Add New Job'}</h3>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Company *</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>
              
              <div className="form-group">
                <label>Dates (Display Text)</label>
                <input
                  type="text"
                  value={formData.dates}
                  onChange={(e) => setFormData(prev => ({ ...prev, dates: e.target.value }))}
                  placeholder="e.g., May 2018 - Present"
                />
              </div>
              
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              
              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  disabled={formData.isCurrent}
                />
              </div>
              
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isCurrent}
                    onChange={(e) => setFormData(prev => ({ ...prev, isCurrent: e.target.checked }))}
                  />
                  Currently working here
                </label>
              </div>
              
              <div className="form-group">
                <label>Job Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                >
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Technologies</label>
                <div className="tech-input">
                  <input
                    type="text"
                    value={newTech}
                    onChange={(e) => setNewTech(e.target.value)}
                    placeholder="Add technology"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                  />
                  <button type="button" onClick={addTech}>Add</button>
                </div>
                <div className="tech-tags">
                  {formData.tech.map((tech, index) => (
                    <span key={index} className="tech-tag">
                      {tech}
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeTech(tech)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>Order</label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                  min="1"
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="save">
                  {editingJob ? 'Update Job' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StyledJobsEditor>
  );
};

export default JobsEditor;
