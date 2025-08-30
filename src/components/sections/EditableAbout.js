'use client';

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { usePrefersReducedMotion } from '@hooks';
import { useAuth } from '../../contexts/AuthContext';
import { formatTextWithBackticks } from '../../utils/textFormatting';
import toast from 'react-hot-toast';

// Helper function to get adjustable image URL
const getAdjustableImageUrl = (url, width = 380, height = 380, crop = 'fill') => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  // If it's a Cloudinary URL, add transformation parameters
  const baseUrl = url.split('/upload/')[0] + '/upload/';
  const publicId = url.split('/upload/')[1];
  
  return `${baseUrl}c_fill,w_${width},h_${height},q_auto/${publicId}`;
};

const StyledAboutSection = styled.section`
  max-width: 900px;

  .admin-controls {
    margin-top: 20px;
    display: flex;
    gap: 10px;
    justify-content: center;

    .edit-button {
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

  .inner {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-gap: 50px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;

const StyledText = styled.div`
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    grid-gap: 0 10px;
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }
`;

const StyledPic = styled.div`
  position: relative;
  max-width: 380px;
  max-height: 380px;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 60%;
    max-height: 300px;
  }

  .wrapper {
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: var(--border-radius);
    background-color: transparent;

    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 8px;
      left: 8px;
      z-index: -1;
      border-radius: var(--border-radius);
      border: 2px solid var(--green);
      background-color: transparent;
    }

    .img {
      position: relative;
      border-radius: var(--border-radius);
      transition: var(--transition);
      z-index: 1;
      border: none;
      width: 100%;
      height: 100%;
      object-fit: cover;

      &:hover {
        transform: translate(-4px, -4px);
        box-shadow: 0 10px 30px -10px rgba(2, 12, 27, 0.7);
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
    max-width: 700px;
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

      .skills-container {
        .skill-inputs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 10px;

          @media (max-width: 480px) {
            grid-template-columns: 1fr;
          }
        }

        .add-skill {
          background: var(--green);
          color: var(--navy);
          border: none;
          padding: 5px 10px;
          border-radius: 4px;
          cursor: pointer;
          font-size: var(--fz-xs);
          margin-top: 10px;

          &:hover {
            background: var(--light-green);
          }
        }

        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;

          .skill-tag {
            background: var(--light-navy);
            color: var(--green);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: var(--fz-xs);
            display: flex;
            align-items: center;
            gap: 5px;

            .remove-skill {
              background: none;
              border: none;
              color: var(--light-slate);
              cursor: pointer;
              font-size: 12px;
              padding: 0;

              &:hover {
                color: #ff6b6b;
              }
            }
          }
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

const EditableAbout = ({ data, onUpdate }) => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { isAdmin, editMode } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aboutData, setAboutData] = useState(data);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: [],
    image: {
      url: '',
      alt: ''
    },
    order: 0
  });
  const [newSkill, setNewSkill] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Use dynamic data or fallback to defaults
  const title = aboutData?.title || "About Me";
  const description = aboutData?.description || "I'm a software engineer who specializes in building (and occasionally designing) exceptional digital experiences.\n\nCurrently, I'm an engineer at `Upstatement` focused on building accessible, inclusive products and digital experiences for a variety of clients.\n\nMy journey into web development started back in 2012 when I decided to try editing custom Tumblr themes — turns out hacking together a custom reblog button taught me a lot about `HTML` & `CSS`!\n\nFast-forward to today, and I've had the privilege of building software for `an advertising agency`, `a start-up`, `a huge corporation`, and `a student-led design studio`.\n\nI also recently launched a course that covers everything you need to build a web app with the `Spotify API` using `Node.js`, `React`, and more.\n\nHere are a few technologies I've been working with recently:\n\n`JavaScript (ES6+)`\n`TypeScript`\n`React`\n`Eleventy`\n`Node.js`\n`WordPress`";
  const skills = aboutData?.skills?.map(skill => skill.name) || ['JavaScript (ES6+)', 'Python', 'React', 'Node.js', 'Machine Learning', 'Deep Learning', 'Data Science', 'Generative AI', 'RAGs', 'Automation'];
  const imageUrl = aboutData?.image?.url || "/images/me.jpg";
  const imageAlt = aboutData?.image?.alt || "Headshot";

  useEffect(() => {
    setAboutData(data);
  }, [data]);

  useEffect(() => {
    if (aboutData) {
      setFormData({
        title: aboutData.title || '',
        description: aboutData.description || '',
        skills: aboutData.skills || [],
        image: aboutData.image || { url: '', alt: '' },
        order: aboutData.order || 0
      });
    }
  }, [aboutData]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, [prefersReducedMotion]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedAbout = await response.json();
        setAboutData(updatedAbout.about);
        if (onUpdate) {
          onUpdate(updatedAbout.about);
        }
        toast.success('About section updated successfully!');
        setIsModalOpen(false);
      } else {
        toast.error('Failed to update about section');
      }
    } catch (error) {
      console.error('Error updating about section:', error);
      toast.error('An error occurred while updating the about section');
    }
  };

  const handleEdit = () => {
    setFormData({
      title: aboutData?.title || '',
      description: aboutData?.description || '',
      skills: aboutData?.skills || [],
      image: aboutData?.image || { url: '', alt: '' },
      order: aboutData?.order || 0
    });
    setIsModalOpen(true);
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.find(s => s.name === newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, { name: newSkill.trim() }]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillName) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.name !== skillName)
    }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setFormData(prev => ({
          ...prev,
          image: {
            url: result.url,
            alt: prev.image.alt || 'Profile Image'
          }
        }));
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('An error occurred while uploading the image');
    } finally {
      setIsUploading(false);
    }
  };

  // Function to format description with line breaks and green backtick highlighting
  const formatDescription = (text) => {
    if (!text) return '';
    
    // Split by line breaks and format each paragraph
    const paragraphs = text.split('\n');
    return paragraphs.map((paragraph, index) => (
      <React.Fragment key={index}>
        {formatTextWithBackticks(paragraph)}
        {index < paragraphs.length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <>
      <StyledAboutSection id="about" ref={revealContainer}>
        <h2 className="numbered-heading">{title}</h2>

        {isAdmin && editMode && (
          <div className="admin-controls">
            <button className="edit-button" onClick={handleEdit}>
              Edit About Section
            </button>
          </div>
        )}

        <div className="inner">
          <StyledText>
            <div>
              <p>{formatDescription(description)}</p>
            </div>

            <ul className="skills-list">
              {skills && skills.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </StyledText>

                     <StyledPic>
             <div className="wrapper">
               <img
                 className="img"
                 src={getAdjustableImageUrl(imageUrl, 380, 380, 'fill')}
                 alt={imageAlt}
                 style={{ objectFit: 'cover' }}
               />
             </div>
           </StyledPic>
        </div>
      </StyledAboutSection>

      {isModalOpen && (
        <StyledModal onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div className="modal-content">
            <h3>Edit About Section</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="About Me"
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Write your about me description here. Use line breaks for paragraphs and backticks `like this` for highlighting important terms..."
                  rows="8"
                />
                <small style={{ color: 'var(--slate)', fontSize: '12px', marginTop: '5px' }}>
                  Use line breaks (Enter key) to create paragraphs. Wrap important terms in backticks `like this` to highlight them in green.
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="skills">Skills</label>
                <div className="skills-container">
                  <div className="skill-inputs">
                    <input
                      type="text"
                      id="skills"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add new skill"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                    />
                    <button type="button" className="add-skill" onClick={addSkill}>
                      Add Skill
                    </button>
                  </div>
                  <div className="skills-list">
                    {formData.skills.map((skill, index) => (
                      <span key={index} className="skill-tag">
                        {skill.name}
                        <button
                          type="button"
                          className="remove-skill"
                          onClick={() => removeSkill(skill.name)}
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="profile-image">Profile Image</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="file"
                    id="profile-image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ flex: 1 }}
                  />
                  {isUploading && <span style={{ color: 'var(--green)' }}>Uploading...</span>}
                </div>
                                 {formData.image.url && (
                   <div style={{ marginTop: '10px' }}>
                     <img
                       src={getAdjustableImageUrl(formData.image.url, 100, 100, 'fill')}
                       alt="Preview"
                       style={{ borderRadius: '4px', width: '100px', height: '100px' }}
                     />
                   </div>
                 )}
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

              <div className="form-actions">
                <button type="button" className="cancel" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="save">
                  Update About Section
                </button>
              </div>
            </form>
          </div>
        </StyledModal>
      )}
    </>
  );
};

EditableAbout.propTypes = {
  data: PropTypes.object,
  onUpdate: PropTypes.func
};

export default EditableAbout;
