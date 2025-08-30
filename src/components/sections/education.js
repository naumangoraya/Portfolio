'use client';

import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { usePrefersReducedMotion } from '@hooks';
import { useAuth } from '../../contexts/AuthContext';
import { formatTextWithBackticks } from '../../utils/textFormatting';
import toast from 'react-hot-toast';

const StyledEducationSection = styled.section`
  max-width: 1000px;
  margin: 0 auto 100px;
  padding: 20px;

  .inner {
    @media (max-width: 600px) {
      padding: 0;
    }
  }

  .admin-controls {
    margin-top: 20px;
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;

    button {
      background: var(--green);
      color: var(--navy);
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 4px;
      font-weight: 600;
      font-size: var(--fz-sm);
      transition: all 0.2s ease;

      &:hover {
        background: var(--light-green);
        transform: translateY(-1px);
      }

      &.add-button {
        background: var(--green);
      }

      &.seed-button {
        background: #f59e0b;
        
        &:hover {
          background: #f39c12;
        }
      }
    }
  }

  .education-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 50px;
    position: relative;
    margin-top: 50px;

    @media (max-width: 1080px) {
      gap: 40px;
    }

    @media (max-width: 768px) {
      gap: 30px;
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }

  .education-item {
    position: relative;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
    border: 1px solid transparent;
    box-shadow: 0 10px 30px -15px rgba(2, 12, 27, 0.7);

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px -20px rgba(2, 12, 27, 0.8), 0 10px 30px -15px rgba(0, 0, 0, 0.3);
      background-color: var(--navy);
      border: 1px solid var(--green-tint);
    }

    .admin-controls {
      position: absolute;
      top: 10px;
      right: 10px;
      display: flex;
      gap: 5px;
      opacity: 0;
      transition: opacity 0.2s ease;

      button {
        background: var(--green);
        color: var(--navy);
        border: none;
        padding: 4px 8px;
        cursor: pointer;
        border-radius: 3px;
        font-size: 10px;
        font-weight: 600;
        transition: all 0.2s ease;

        &:hover {
          background: var(--light-green);
        }

        &.delete {
          background: #ff6b6b;
          
          &:hover {
            background: #ff5252;
          }
        }

        &.edit {
          background: #f59e0b;
          
          &:hover {
            background: #f39c12;
          }
        }
      }
    }

    &:hover .admin-controls {
      opacity: 1;
    }
  }

  .education-header {
    margin-bottom: 1rem;

    .degree {
      color: var(--lightest-slate);
      font-size: var(--fz-xl);
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .school {
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-sm);
      margin-bottom: 0.5rem;
    }

    .location {
      color: var(--light-slate);
      font-size: var(--fz-sm);
      margin-bottom: 0.5rem;
    }

    .dates {
      color: var(--light-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
    }
  }

  .education-content {
    .description {
      color: var(--light-slate);
      font-size: var(--fz-sm);
      line-height: 1.6;
      margin-bottom: 1rem;
    }

    .gpa {
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      margin-bottom: 1rem;
    }

    .coursework {
      margin-bottom: 1rem;

      h4 {
        color: var(--lightest-slate);
        font-size: var(--fz-sm);
        margin-bottom: 0.5rem;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          color: var(--light-slate);
          font-size: var(--fz-xs);
          margin-bottom: 0.25rem;
          padding-left: 15px;
          position: relative;

          &:before {
            content: '▹';
            position: absolute;
            left: 0;
            color: var(--green);
            font-size: var(--fz-xs);
          }
        }
      }
    }

    .achievements {
      margin-bottom: 1rem;

      h4 {
        color: var(--lightest-slate);
        font-size: var(--fz-sm);
        margin-bottom: 0.5rem;
      }

      ul {
        list-style: none;
        padding: 0;
        margin: 0;

        li {
          color: var(--light-slate);
          font-size: var(--fz-xs);
          margin-bottom: 0.25rem;
          padding-left: 15px;
          position: relative;

          &:before {
            content: '▹';
            position: absolute;
            left: 0;
            color: var(--green);
            font-size: var(--fz-xs);
          }
        }
      }
    }
  }

  .loading {
    text-align: center;
    color: var(--light-slate);
    padding: 2rem;
  }

  .error {
    text-align: center;
    color: #ff6b6b;
    padding: 2rem;
  }

  .empty {
    text-align: center;
    color: var(--light-slate);
    padding: 2rem;
    font-style: italic;
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
        margin-bottom: 8px;
        font-weight: 600;
      }

      input, textarea {
        width: 100%;
        padding: 12px;
        background: var(--light-navy);
        border: 1px solid var(--lightest-navy);
        border-radius: 4px;
        color: var(--lightest-slate);
        font-size: var(--fz-sm);
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

        &:focus {
          outline: none;
          border-color: var(--green);
          box-shadow: 0 0 0 2px rgba(100, 255, 100, 0.1);
        }

        &::placeholder {
          color: var(--slate);
          opacity: 0.7;
        }
      }

      textarea {
        min-height: 100px;
        resize: vertical;
        font-family: inherit;
        line-height: 1.5;
      }

      .array-inputs {
        .array-input {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;

          input {
            flex: 1;
          }

          button {
            background: #ff6b6b;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;

            &:hover {
              background: #ff5252;
            }
          }
        }

        .add-array-item {
          background: var(--green);
          color: var(--navy);
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;

          &:hover {
            background: var(--light-green);
          }
        }
      }
    }

    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid var(--lightest-navy);

      button {
        padding: 12px 24px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        font-size: var(--fz-sm);
        transition: all 0.2s ease;
        min-width: 100px;

        &.save {
          background: var(--green);
          color: var(--navy);
          
          &:hover {
            background: var(--light-green);
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(100, 255, 100, 0.2);
          }
        }

        &.cancel {
          background: var(--lightest-navy);
          color: var(--lightest-slate);
          
          &:hover {
            background: var(--light-navy);
            transform: translateY(-1px);
          }
        }

        &:active {
          transform: translateY(0);
        }
      }
    }
  }
`;

const Education = ({ data = [] }) => {
  const revealTitle = useRef(null);
  const revealGrid = useRef(null);
  const revealItems = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { isAdmin, editMode } = useAuth();
  
  const [education, setEducation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEducation, setCurrentEducation] = useState(null);
  const [formData, setFormData] = useState({
    degree: '',
    school: '',
    location: '',
    startDate: '',
    endDate: 'Present',
    current: false,
    description: '',
    gpa: '',
    relevantCoursework: [],
    achievements: [],
    isActive: true,
    order: 1
  });

  useEffect(() => {
    console.log('Education component received data:', data);
    if (data && data.length > 0) {
      setEducation(data);
      setIsLoading(false);
    } else if (data && data.length === 0) {
      setEducation([]);
      setIsLoading(false);
    } else {
      fetchEducation();
    }
  }, [data]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealGrid.current, srConfig(200, 0));
    revealItems.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, [prefersReducedMotion, education]);

  const fetchEducation = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/education');
      if (response.ok) {
        const data = await response.json();
        setEducation(data.education || []);
      } else {
        setError('Failed to fetch education data');
      }
    } catch (error) {
      setError('Error fetching education data');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const seedEducationData = async () => {
    try {
      const response = await fetch('/api/education/seed', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        toast.success('Education seeded successfully!');
        await fetchEducation();
      } else {
        const errorData = await response.json();
        toast.error(`Failed to seed education: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error seeding education:', error);
      toast.error('An error occurred while seeding education');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInputChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = isEditing 
        ? `/api/education/${currentEducation._id}`
        : '/api/education';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Education ${isEditing ? 'updated' : 'created'} successfully!`);
        await fetchEducation();
        setIsModalOpen(false);
        resetForm();
      } else {
        const errorData = await response.json();
        toast.error(`Failed to ${isEditing ? 'update' : 'create'} education: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving education:', error);
      toast.error('An error occurred while saving education');
    }
  };

  const handleEdit = (edu) => {
    setCurrentEducation(edu);
    setFormData({
      degree: edu.degree || '',
      school: edu.school || '',
      location: edu.location || '',
      startDate: edu.startDate || '',
      endDate: edu.endDate || 'Present',
      current: edu.current || false,
      description: edu.description || '',
      gpa: edu.gpa || '',
      relevantCoursework: edu.relevantCoursework || [],
      achievements: edu.achievements || [],
      isActive: edu.isActive !== false,
      order: edu.order || 1
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this education entry?')) {
      return;
    }

    try {
      const response = await fetch(`/api/education/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        toast.success('Education deleted successfully!');
        await fetchEducation();
      } else {
        const errorData = await response.json();
        toast.error(`Failed to delete education: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting education:', error);
      toast.error('An error occurred while deleting education');
    }
  };

  const handleAdd = () => {
    setCurrentEducation(null);
    setFormData({
      degree: '',
      school: '',
      location: '',
      startDate: '',
      endDate: 'Present',
      current: false,
      description: '',
      gpa: '',
      relevantCoursework: [],
      achievements: [],
      isActive: true,
      order: 1
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      degree: '',
      school: '',
      location: '',
      startDate: '',
      endDate: 'Present',
      current: false,
      description: '',
      gpa: '',
      relevantCoursework: [],
      achievements: [],
      isActive: true,
      order: 1
    });
    setCurrentEducation(null);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <StyledEducationSection>
        <div className="inner">
          <div className="loading">Loading education...</div>
        </div>
      </StyledEducationSection>
    );
  }

  if (error) {
    return (
      <StyledEducationSection>
        <div className="inner">
          <div className="error">Error: {error}</div>
        </div>
      </StyledEducationSection>
    );
  }

  return (
    <>
      <StyledEducationSection id="education">
        <div className="inner">
          <h2 className="numbered-heading" ref={revealTitle}>Education</h2>

          {isAdmin && editMode && (
            <div className="admin-controls">
              <button className="add-button" onClick={handleAdd}>
                Add Education Entry
              </button>
              <button 
                className="seed-button" 
                onClick={seedEducationData}
              >
                Seed with Dummy Data
              </button>
            </div>
          )}

          {education.length === 0 ? (
            <div className="empty">No education entries found. Add some education entries to get started!</div>
          ) : (
            <div className="education-grid" ref={revealGrid}>
              {education.map((edu, i) => (
                <div 
                  key={edu._id} 
                  className="education-item"
                  ref={el => (revealItems.current[i] = el)}
                >
                  {isAdmin && editMode && (
                    <div className="admin-controls">
                      <button 
                        className="edit"
                        onClick={() => handleEdit(edu)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete"
                        onClick={() => handleDelete(edu._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}

                  <div className="education-header">
                    <div className="degree">{edu.degree}</div>
                    <div className="school">{edu.school}</div>
                    <div className="location">📍 {edu.location}</div>
                    <div className="dates">
                      {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                    </div>
                  </div>

                  <div className="education-content">
                    {edu.description && (
                      <div className="description">
                        {formatTextWithBackticks(edu.description)}
                      </div>
                    )}

                    {edu.gpa && (
                      <div className="gpa">GPA: {edu.gpa}</div>
                    )}

                    {edu.relevantCoursework && edu.relevantCoursework.length > 0 && (
                      <div className="coursework">
                        <h4>Relevant Coursework:</h4>
                        <ul>
                          {edu.relevantCoursework.map((course, index) => (
                            <li key={index}>{course}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {edu.achievements && edu.achievements.length > 0 && (
                      <div className="achievements">
                        <h4>Achievements:</h4>
                        <ul>
                          {edu.achievements.map((achievement, index) => (
                            <li key={index}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </StyledEducationSection>

      {/* Modal for adding/editing education */}
      {isModalOpen && (
        <StyledModal onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div className="modal-content">
            <h3>{isEditing ? 'Edit Education Entry' : 'Add New Education Entry'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="degree">Degree *</label>
                <input
                  type="text"
                  id="degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleInputChange}
                  placeholder="e.g., Bachelor of Science in Computer Science"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="school">School/Institution *</label>
                <input
                  type="text"
                  id="school"
                  name="school"
                  value={formData.school}
                  onChange={handleInputChange}
                  placeholder="e.g., University of Technology"
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
                  placeholder="📍 e.g., Lahore, Pakistan"
                />
              </div>

              <div className="form-group">
                <label htmlFor="startDate">Start Date *</label>
                <input
                  type="month"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  placeholder="e.g., 2018-01"
                  required
                />
                <small style={{ color: 'var(--light-slate)', fontSize: '12px' }}>
                  Or enter manually: <input
                    type="text"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    placeholder="e.g., 2018 or 2018-01"
                    style={{ width: '100%', marginTop: '5px' }}
                  />
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input
                  type="month"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  placeholder="e.g., 2022-12"
                />
                <small style={{ color: 'var(--light-slate)', fontSize: '12px' }}>
                  Or enter manually: <input
                    type="text"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                    placeholder="e.g., 2022, Present, or 2022-12"
                    style={{ width: '100%', marginTop: '5px' }}
                  />
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="current">
                  <input
                    type="checkbox"
                    id="current"
                    name="current"
                    checked={formData.current || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, current: e.target.checked }))}
                    style={{ marginRight: '8px' }}
                  />
                  Currently studying here
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your education experience, focus areas, etc."
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="gpa">GPA</label>
                <input
                  type="text"
                  id="gpa"
                  name="gpa"
                  value={formData.gpa}
                  onChange={handleInputChange}
                  placeholder="e.g., 3.8/4.0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="coursework">Relevant Coursework</label>
                <div className="array-inputs">
                  {formData.relevantCoursework.map((course, index) => (
                    <div key={index} className="array-input">
                      <input
                        type="text"
                        id={`coursework-${index}`}
                        value={course}
                        onChange={(e) => handleArrayInputChange('relevantCoursework', index, e.target.value)}
                        placeholder="Course name"
                      />
                      <button type="button" onClick={() => removeArrayItem('relevantCoursework', index)}>
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" className="add-array-item" onClick={() => addArrayItem('relevantCoursework')}>
                    Add Course
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="achievements">Achievements</label>
                <div className="array-inputs">
                  {formData.achievements.map((achievement, index) => (
                    <div key={index} className="array-input">
                      <input
                        type="text"
                        id={`achievements-${index}`}
                        value={achievement}
                        onChange={(e) => handleArrayInputChange('achievements', index, e.target.value)}
                        placeholder="Achievement description"
                      />
                      <button type="button" onClick={() => removeArrayItem('achievements', index)}>
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" className="add-array-item" onClick={() => addArrayItem('achievements')}>
                    Add Achievement
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="order">Display Order</label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  min="1"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="save">
                  {isEditing ? 'Update Education' : 'Create Education'}
                </button>
              </div>
            </form>
          </div>
        </StyledModal>
      )}
    </>
  );
};

Education.propTypes = {
  data: PropTypes.array,
};

export default Education; 