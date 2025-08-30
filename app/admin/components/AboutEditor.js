'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';

const StyledAboutEditor = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;

  .header {
    margin-bottom: 30px;
    
    h2 {
      margin: 0 0 10px 0;
      color: var(--lightest-slate);
    }
    
    p {
      color: var(--light-slate);
      margin: 0;
    }
  }

  .form-container {
    background: var(--light-navy);
    border-radius: 8px;
    padding: 30px;
    border: 1px solid var(--navy);
  }

  .form-group {
    margin-bottom: 25px;
    
    label {
      display: block;
      margin-bottom: 8px;
      color: var(--lightest-slate);
      font-weight: 500;
    }
    
    input, textarea, select {
      width: 100%;
      padding: 12px;
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
      min-height: 120px;
      resize: vertical;
    }
    
    .skills-section {
      border: 1px solid var(--navy);
      border-radius: 4px;
      padding: 15px;
      background: var(--navy);
      
      .skill-input {
        display: flex;
        gap: 10px;
        margin-bottom: 15px;
        
        input, select {
          flex: 1;
        }
        
        button {
          background: var(--green);
          color: var(--light-navy);
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 600;
          
          &:hover {
            background: var(--light-green);
          }
        }
      }
      
      .skills-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 10px;
        
        .skill-item {
          background: var(--light-navy);
          border: 1px solid var(--slate);
          border-radius: 4px;
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .skill-info {
            .skill-name {
              color: var(--lightest-slate);
              font-weight: 500;
              margin-bottom: 3px;
            }
            
            .skill-category {
              color: var(--green);
              font-size: 0.8em;
              margin-bottom: 2px;
            }
            
            .skill-level {
              color: var(--slate);
              font-size: 0.8em;
            }
          }
          
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
    
    .experience-section {
      border: 1px solid var(--navy);
      border-radius: 4px;
      padding: 15px;
      background: var(--navy);
      
      .experience-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        
        @media (max-width: 768px) {
          grid-template-columns: 1fr;
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
      padding: 12px 24px;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      
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

  .preview-section {
    margin-top: 30px;
    padding: 20px;
    background: var(--navy);
    border-radius: 8px;
    border: 1px solid var(--slate);
    
    h3 {
      color: var(--lightest-slate);
      margin: 0 0 15px 0;
    }
    
    .preview-content {
      color: var(--light-slate);
      line-height: 1.6;
    }
  }
`;

const AboutEditor = () => {
  const [aboutData, setAboutData] = useState({
    title: '',
    description: '',
    longDescription: '',
    skills: [],
    experience: {
      years: 0,
      companies: [],
      highlights: []
    },
    education: {
      degree: '',
      institution: '',
      year: '',
      description: ''
    }
  });
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Programming',
    level: 'Intermediate'
  });
  const [newCompany, setNewCompany] = useState('');
  const [newHighlight, setNewHighlight] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    try {
      const response = await fetch('/api/about');
      if (response.ok) {
        const data = await response.json();
        setAboutData(data);
      }
    } catch (error) {
      toast.error('Failed to fetch about data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setAboutData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setAboutData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addSkill = () => {
    if (newSkill.name.trim()) {
      setAboutData(prev => ({
        ...prev,
        skills: [...prev.skills, { ...newSkill, name: newSkill.name.trim() }]
      }));
      setNewSkill({ name: '', category: 'Programming', level: 'Intermediate' });
    }
  };

  const removeSkill = (index) => {
    setAboutData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const addCompany = () => {
    if (newCompany.trim() && !aboutData.experience.companies.includes(newCompany.trim())) {
      setAboutData(prev => ({
        ...prev,
        experience: {
          ...prev.experience,
          companies: [...prev.experience.companies, newCompany.trim()]
        }
      }));
      setNewCompany('');
    }
  };

  const removeCompany = (company) => {
    setAboutData(prev => ({
      ...prev,
      experience: {
        ...prev.experience,
        companies: prev.experience.companies.filter(c => c !== company)
      }
    }));
  };

  const addHighlight = () => {
    if (newHighlight.trim() && !aboutData.experience.highlights.includes(newHighlight.trim())) {
      setAboutData(prev => ({
        ...prev,
        experience: {
          ...prev.experience,
          highlights: [...prev.experience.highlights, newHighlight.trim()]
        }
      }));
      setNewHighlight('');
    }
  };

  const removeHighlight = (highlight) => {
    setAboutData(prev => ({
      ...prev,
      experience: {
        ...prev.experience,
        highlights: prev.experience.highlights.filter(h => h !== highlight)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aboutData),
      });

      if (response.ok) {
        toast.success('About section updated successfully!');
        fetchAboutData();
      } else {
        toast.error('Failed to update about section');
      }
    } catch (error) {
      toast.error('Error updating about section');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <StyledAboutEditor>
      <div className="header">
        <h2>Edit About Section</h2>
        <p>Update your personal information, skills, and experience</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="form-group">
            <label>Section Title</label>
            <input
              type="text"
              value={aboutData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="About Me"
            />
          </div>

          <div className="form-group">
            <label>Main Description</label>
            <textarea
              value={aboutData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Your main description..."
            />
          </div>

          <div className="form-group">
            <label>Additional Description</label>
            <textarea
              value={aboutData.longDescription}
              onChange={(e) => handleInputChange('longDescription', e.target.value)}
              placeholder="Additional details about your background..."
            />
          </div>

          <div className="form-group">
            <label>Skills</label>
            <div className="skills-section">
              <div className="skill-input">
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Skill name"
                />
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="Programming">Programming</option>
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Tools">Tools</option>
                  <option value="Other">Other</option>
                </select>
                <select
                  value={newSkill.level}
                  onChange={(e) => setNewSkill(prev => ({ ...prev, level: e.target.value }))}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
                <button type="button" onClick={addSkill}>Add Skill</button>
              </div>
              
              <div className="skills-list">
                {aboutData.skills.map((skill, index) => (
                  <div key={index} className="skill-item">
                    <div className="skill-info">
                      <div className="skill-name">{skill.name}</div>
                      <div className="skill-category">{skill.category}</div>
                      <div className="skill-level">{skill.level}</div>
                    </div>
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={() => removeSkill(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Experience</label>
            <div className="experience-section">
              <div className="experience-grid">
                <div>
                  <label>Years of Experience</label>
                  <input
                    type="number"
                    value={aboutData.experience.years}
                    onChange={(e) => handleInputChange('experience.years', parseInt(e.target.value))}
                    min="0"
                  />
                </div>
                <div>
                  <label>Companies</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                      type="text"
                      value={newCompany}
                      onChange={(e) => setNewCompany(e.target.value)}
                      placeholder="Company name"
                    />
                    <button type="button" onClick={addCompany}>Add</button>
                  </div>
                  <div style={{ marginTop: '10px' }}>
                    {aboutData.experience.companies.map((company, index) => (
                      <span key={index} style={{ 
                        background: 'var(--light-navy)', 
                        padding: '4px 8px', 
                        margin: '2px', 
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}>
                        {company}
                        <button
                          type="button"
                          onClick={() => removeCompany(company)}
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: 'var(--red)', 
                            marginLeft: '8px',
                            cursor: 'pointer'
                          }}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div style={{ marginTop: '15px' }}>
                <label>Highlights</label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    value={newHighlight}
                    onChange={(e) => setNewHighlight(e.target.value)}
                    placeholder="Achievement or highlight"
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={addHighlight}>Add</button>
                </div>
                <div>
                  {aboutData.experience.highlights.map((highlight, index) => (
                    <span key={index} style={{ 
                      background: 'var(--light-navy)', 
                      padding: '4px 8px', 
                      margin: '2px', 
                      borderRadius: '4px',
                      display: 'inline-block'
                    }}>
                      {highlight}
                      <button
                        type="button"
                        onClick={() => removeHighlight(highlight)}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'var(--red)', 
                          marginLeft: '8px',
                          cursor: 'pointer'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Education</label>
            <div className="experience-section">
              <div className="experience-grid">
                <div>
                  <label>Degree</label>
                  <input
                    type="text"
                    value={aboutData.education.degree}
                    onChange={(e) => handleInputChange('education.degree', e.target.value)}
                    placeholder="e.g., Computer Science"
                  />
                </div>
                <div>
                  <label>Institution</label>
                  <input
                    type="text"
                    value={aboutData.education.institution}
                    onChange={(e) => handleInputChange('education.institution', e.target.value)}
                    placeholder="University name"
                  />
                </div>
                <div>
                  <label>Year</label>
                  <input
                    type="text"
                    value={aboutData.education.year}
                    onChange={(e) => handleInputChange('education.year', e.target.value)}
                    placeholder="e.g., 2018"
                  />
                </div>
                <div>
                  <label>Description</label>
                  <input
                    type="text"
                    value={aboutData.education.description}
                    onChange={(e) => handleInputChange('education.description', e.target.value)}
                    placeholder="Brief description"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel">
              Cancel
            </button>
            <button type="submit" className="save">
              Save Changes
            </button>
          </div>
        </div>
      </form>

      <div className="preview-section">
        <h3>Preview</h3>
        <div className="preview-content">
          <h2>{aboutData.title || 'About Me'}</h2>
          <p>{aboutData.description || 'Your description will appear here...'}</p>
          {aboutData.longDescription && <p>{aboutData.longDescription}</p>}
          
          {aboutData.skills && aboutData.skills.length > 0 && (
            <div>
              <h4>Skills:</h4>
              <ul>
                {aboutData.skills.map((skill, index) => (
                  <li key={index}>
                    <strong>{skill.name}</strong> - {skill.category} ({skill.level})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </StyledAboutEditor>
  );
};

export default AboutEditor;
