'use client';

import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';
import { useAuth } from '../../contexts/AuthContext';
import { useProjects } from '../../hooks/useProjects';
import { formatTextWithBackticks } from '../../utils/textFormatting';
import toast from 'react-hot-toast';

const StyledProjectsGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};

  a {
    position: relative;
    z-index: 1;
  }
`;

const StyledProject = styled.li`
  position: relative;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(12, 1fr);
  align-items: center;

  @media (max-width: 768px) {
    ${({ theme }) => theme.mixins.boxShadow};
  }

  &:not(:last-of-type) {
    margin-bottom: 100px;

    @media (max-width: 768px) {
      margin-bottom: 70px;
    }

    @media (max-width: 480px) {
      margin-bottom: 30px;
    }
  }

  &:nth-of-type(odd) {
    .project-content {
      grid-column: 7 / -1;
      text-align: right;

      @media (max-width: 1080px) {
        grid-column: 5 / -1;
      }
      @media (max-width: 768px) {
        grid-column: 1 / -1;
        padding: 40px 40px 30px;
        text-align: left;
      }
      @media (max-width: 480px) {
        padding: 25px 25px 20px;
      }
    }
    .project-tech-list {
      justify-content: flex-end;

      @media (max-width: 768px) {
        justify-content: flex-start;
      }

      li {
        margin: 0 0 5px 20px;

        @media (max-width: 768px) {
          margin: 0 10px 5px 0;
        }
      }
    }
    .project-links {
      justify-content: flex-end;
      margin-left: 0;
      margin-right: -10px;

      @media (max-width: 768px) {
        justify-content: flex-start;
        margin-left: -10px;
        margin-right: 0;
      }
    }
    .project-image {
      grid-column: 1 / 8;

      @media (max-width: 768px) {
        grid-column: 1 / -1;
      }
    }
  }

  .project-content {
    position: relative;
    grid-column: 1 / 7;
    grid-row: 1 / -1;

    @media (max-width: 1080px) {
      grid-column: 1 / 9;
    }

    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      grid-column: 1 / -1;
      padding: 40px 40px 30px;
      z-index: 5;
    }

    @media (max-width: 480px) {
      padding: 30px 25px 20px;
    }
  }

  .project-overline {
    margin: 10px 0;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    font-weight: 400;
  }

  .project-title {
    color: var(--lightest-slate);
    font-size: clamp(24px, 5vw, 28px);

    @media (min-width: 768px) {
      margin: 0 0 20px;
    }

    @media (max-width: 768px) {
      color: var(--white);

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
  }

  .project-description {
    ${({ theme }) => theme.mixins.boxShadow};
    position: relative;
    z-index: 2;
    padding: 25px;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    color: var(--light-slate);
    font-size: var(--fz-lg);

    @media (max-width: 768px) {
      padding: 20px 0;
      background-color: transparent;
      box-shadow: none;

      &:hover {
        box-shadow: none;
      }
    }

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }

    strong {
      color: var(--white);
      font-weight: normal;
    }
  }

  .project-tech-list {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
    margin: 25px 0 10px;
    padding: 0;
    list-style: none;

    li {
      margin: 0 20px 5px 0;
      color: var(--light-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      white-space: nowrap;
    }

    @media (max-width: 768px) {
      margin: 10px 0;

      li {
        margin: 0 10px 5px 0;
        color: var(--lightest-slate);
      }
    }
  }

  .project-links {
    display: flex;
    align-items: center;
    position: relative;
    margin-top: 10px;
    margin-left: -10px;
    color: var(--lightest-slate);

    a {
      ${({ theme }) => theme.mixins.flexCenter};
      padding: 10px;

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

    .cta {
      ${({ theme }) => theme.mixins.smallButton};
      margin: 10px;
    }
  }

  .project-image {
    ${({ theme }) => theme.mixins.boxShadow};
    grid-column: 6 / -1;
    grid-row: 1 / -1;
    position: relative;
    z-index: 1;
    border-radius: var(--border-radius);
    overflow: hidden;

    @media (max-width: 768px) {
      grid-column: 1 / -1;
      height: 300px;
      opacity: 1;
    }

    a {
      width: 100%;
      height: 100%;
      background-color: var(--light-navy);
      border-radius: var(--border-radius);
      vertical-align: middle;
      display: block;
      position: relative;

      &:hover,
      &:focus {
        background: transparent;
        outline: 0;

        &:before,
        .img {
          background: transparent;
          filter: none;
        }
      }

      &:before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 3;
        transition: var(--transition);
        background-color: var(--navy);
        mix-blend-mode: screen;
        opacity: 0.1;
      }
    }

    .img {
      border-radius: var(--border-radius);
      mix-blend-mode: normal;
      filter: grayscale(20%) contrast(1.1) brightness(95%);
      transition: var(--transition);
      width: 100%;
      height: 100%;
      object-fit: cover;

      @media (max-width: 768px) {
        object-fit: cover;
        width: 100%;
        height: 100%;
        filter: grayscale(10%) contrast(1.1) brightness(95%);
      }
    }

    &:hover .img {
      filter: grayscale(0%) contrast(1) brightness(100%);
    }
  }
`;

const Featured = ({ data = [] }) => {
  const { isAdmin, editMode } = useAuth();
  const { featuredProjects, isLoading, error, refreshData } = useProjects(data);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    github: '',
    external: '',
    tech: '',
    image: { url: '', alt: '' },
    featured: true,
    showInProjects: false
  });

  // Use featured projects from hook, no dummy data fallback
  const displayProjects = featuredProjects;

  const revealTitle = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      github: project.github || '',
      external: project.external || '',
      tech: Array.isArray(project.tech) ? project.tech.join(', ') : project.tech || '',
      image: project.image || { url: '', alt: '' },
      featured: project.featured || true,
      showInProjects: project.showInProjects || false
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (projectId) => {
    if (!confirm('Are you sure you want to delete this featured project?')) {
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Admin authentication required');
        return;
      }

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Featured project deleted successfully!');
        
        // Refresh data
        refreshData();
      } else {
        console.error('API Error:', result);
        toast.error(result.error || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error('Failed to delete project. Please try again.');
    }
  };

  const handleToggleFeatured = async (project) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Admin authentication required');
        return;
      }

      const updatedData = {
        ...project,
        featured: false, // Remove from featured
        showInProjects: true // Add to regular projects
      };

      const response = await fetch(`/api/projects/${project._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Project moved to regular projects!');
        
        // Refresh data
        refreshData();
      } else {
        console.error('API Error:', result);
        toast.error(result.error || 'Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      toast.error('Failed to update project. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        toast.error('Admin authentication required');
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      // Process tech array from comma-separated string
      const processedData = {
        ...formData,
        tech: formData.tech ? formData.tech.split(',').map(t => t.trim()).filter(t => t) : []
      };

      let response;
      if (isEditing) {
        // Update existing project
        response = await fetch(`/api/projects/${editingProject._id}`, {
          method: 'PUT',
          headers,
          body: JSON.stringify(processedData)
        });
      } else {
        // Create new project
        response = await fetch('/api/projects', {
          method: 'POST',
          headers,
          body: JSON.stringify(processedData)
        });
      }

      const result = await response.json();

      if (response.ok) {
        toast.success(isEditing ? 'Featured project updated successfully!' : 'Featured project created successfully!');
        
        // Refresh data
        refreshData();
        
        // Reset form and close modal
        setFormData({
          title: '',
          description: '',
          github: '',
          external: '',
          tech: '',
          image: { url: '', alt: '' },
          featured: true,
          showInProjects: false
        });
        setIsModalOpen(false);
        setIsEditing(false);
        setEditingProject(null);
      } else {
        console.error('API Error:', result);
        toast.error(result.error || 'Failed to save project');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('Failed to save project. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setFormData(prev => ({
          ...prev,
          image: {
            url: result.url,
            publicId: result.publicId,
            alt: prev.image.alt || file.name
          }
        }));
        toast.success('Image uploaded successfully!');
      } else {
        toast.error(result.error || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: { url: '', alt: '', publicId: '' }
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      github: '',
      external: '',
      tech: '',
      image: { url: '', alt: '' },
      featured: true,
      showInProjects: false
    });
    setIsEditing(false);
    setEditingProject(null);
  };

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const initializeAnimations = async () => {
      try {
        if (sr && sr.reveal) {
          await sr.reveal(revealTitle.current, srConfig());
          for (let i = 0; i < revealProjects.current.length; i++) {
            if (revealProjects.current[i]) {
              await sr.reveal(revealProjects.current[i], srConfig(i * 100));
            }
          }
        }
      } catch (error) {
        console.warn('ScrollReveal not available:', error);
      }
    };

    initializeAnimations();
  }, [prefersReducedMotion]);

  return (
    <>
      <section id="projects">
        <h2 className="numbered-heading" ref={revealTitle}>
          Some Things I&apos;ve Built
        </h2>

        {isAdmin && editMode && (
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{
                background: 'var(--green)',
                color: 'var(--navy)',
                border: 'none',
                borderRadius: '4px',
                padding: '12px 24px',
                fontSize: '16px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
            >
              Add New Featured Project
            </button>
          </div>
        )}

        <StyledProjectsGrid>
          {isLoading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              color: 'var(--light-slate)',
              gridColumn: '1 / -1'
            }}>
              Loading featured projects...
            </div>
          ) : error ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              color: '#ff6b6b',
              gridColumn: '1 / -1'
            }}>
              Error loading featured projects: {error}
            </div>
          ) : displayProjects && displayProjects.length > 0 ? (
            displayProjects.map((project, i) => {
              const { external, title, tech, github, image, description, summary } = project;

              return (
                <StyledProject key={i} ref={el => (revealProjects.current[i] = el)}>
                  <div className="project-content">
                    <div>
                      <p className="project-overline">Featured Project</p>

                      {isAdmin && editMode && (
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          display: 'flex',
                          gap: '5px',
                          zIndex: 10
                        }}>
                          <button
                            onClick={() => handleEdit(project)}
                            style={{
                              background: 'var(--green)',
                              color: 'var(--navy)',
                              border: 'none',
                              borderRadius: '3px',
                              padding: '4px 8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              fontWeight: '600'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(project._id)}
                            style={{
                              background: '#ff6b6b',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              padding: '4px 8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              fontWeight: '600'
                            }}
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleToggleFeatured(project)}
                            style={{
                              background: '#f59e0b',
                              color: 'white',
                              border: 'none',
                              borderRadius: '3px',
                              padding: '4px 8px',
                              fontSize: '12px',
                              cursor: 'pointer',
                              fontWeight: '600'
                            }}
                          >
                            Move to Regular
                          </button>
                        </div>
                      )}

                      <h3 className="project-title">
                        <a href={external} target="_blank" rel="noopener noreferrer">
                          {formatTextWithBackticks(title)}
                        </a>
                      </h3>

                      <div className="project-description">
                        {formatTextWithBackticks(description || summary)}
                      </div>

                      {tech && tech.length > 0 && (
                        <ul className="project-tech-list">
                          {tech.map((techItem, i) => (
                            <li key={i}>{techItem}</li>
                          ))}
                        </ul>
                      )}

                      <div className="project-links">
                        {github && (
                          <a href={github} aria-label="GitHub Link">
                            <Icon name="GitHub" />
                          </a>
                        )}
                        {external && (
                          <a href={external} aria-label="External Link" className="external">
                            <Icon name="External" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="project-image">
                    <a href={external ? external : github ? github : '#'}>
                      {image && image.url ? (
                        <img 
                          src={image.url} 
                          alt={image.alt || title} 
                          className="img"
                          style={{ width: '100%', height: 'auto', borderRadius: 'var(--border-radius)' }}
                          onError={(e) => {
                            // Fallback to a placeholder if image fails to load
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                      ) : null}
                      {/* Fallback placeholder */}
                      <div 
                        style={{
                          display: image && image.url ? 'none' : 'flex',
                          width: '100%',
                          height: '100%',
                          backgroundColor: 'var(--light-navy)',
                          borderRadius: 'var(--border-radius)',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'var(--light-slate)',
                          fontSize: 'var(--fz-sm)',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
                        {title} Preview
                      </div>
                    </a>
                  </div>
                </StyledProject>
              );
            })
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '40px',
              color: 'var(--light-slate)',
              gridColumn: '1 / -1'
            }}>
              <h3 style={{ marginBottom: '20px', color: 'var(--lightest-slate)' }}>
                No Featured Projects Yet
              </h3>
              <p style={{ marginBottom: '20px' }}>
                Showcase your best work by adding featured projects with images!
              </p>
              {isAdmin && editMode && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  style={{
                    background: 'var(--green)',
                    color: 'var(--navy)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '12px 24px',
                    fontSize: '16px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Add Your First Featured Project
                </button>
              )}
            </div>
          )}
        </StyledProjectsGrid>
      </section>

      {/* Modal for adding/editing featured projects */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'var(--navy)',
            padding: '30px',
            borderRadius: '8px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            border: '1px solid var(--lightest-navy)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ color: 'var(--lightest-slate)', margin: 0 }}>
                {isEditing ? 'Edit Featured Project' : 'Add New Featured Project'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--light-slate)',
                  fontSize: '24px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="title" style={{ display: 'block', marginBottom: '5px', color: 'var(--lightest-slate)' }}>
                  Project Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--lightest-navy)',
                    borderRadius: '4px',
                    backgroundColor: 'var(--light-navy)',
                    color: 'var(--lightest-slate)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="description" style={{ display: 'block', marginBottom: '5px', color: 'var(--lightest-slate)' }}>
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--lightest-navy)',
                    borderRadius: '4px',
                    backgroundColor: 'var(--light-navy)',
                    color: 'var(--lightest-slate)',
                    resize: 'vertical'
                  }}
                />
              </div>



              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="github" style={{ display: 'block', marginBottom: '5px', color: 'var(--lightest-slate)' }}>
                  GitHub URL
                </label>
                <input
                  type="url"
                  id="github"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--lightest-navy)',
                    borderRadius: '4px',
                    backgroundColor: 'var(--light-navy)',
                    color: 'var(--lightest-slate)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="external" style={{ display: 'block', marginBottom: '5px', color: 'var(--lightest-slate)' }}>
                  External URL
                </label>
                <input
                  type="url"
                  id="external"
                  name="external"
                  value={formData.external}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--lightest-navy)',
                    borderRadius: '4px',
                    backgroundColor: 'var(--light-navy)',
                    color: 'var(--lightest-slate)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="tech" style={{ display: 'block', marginBottom: '5px', color: 'var(--lightest-slate)' }}>
                  Technologies (comma-separated)
                </label>
                <input
                  type="text"
                  id="tech"
                  name="tech"
                  value={Array.isArray(formData.tech) ? formData.tech.join(', ') : formData.tech}
                  onChange={handleInputChange}
                  placeholder="React, Node.js, MongoDB"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--lightest-navy)',
                    borderRadius: '4px',
                    backgroundColor: 'var(--light-navy)',
                    color: 'var(--lightest-slate)'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="project-image-featured" style={{ display: 'block', marginBottom: '5px', color: 'var(--lightest-slate)' }}>
                  Project Image (Featured Projects Only)
                </label>
                <div style={{ 
                  fontSize: 'var(--fz-xs)', 
                  color: 'var(--slate)', 
                  marginBottom: '10px',
                  fontStyle: 'italic'
                }}>
                  Images are required for featured projects to make them stand out.
                </div>
                {formData.image.url ? (
                  <div style={{ marginBottom: '10px' }}>
                    <img 
                      src={formData.image.url} 
                      alt="Project preview" 
                      style={{ 
                        width: '100%', 
                        height: '150px', 
                        objectFit: 'cover', 
                        borderRadius: '4px',
                        border: '1px solid var(--lightest-navy)'
                      }} 
                    />
                    <div style={{ 
                      display: 'flex', 
                      gap: '10px', 
                      marginTop: '10px' 
                    }}>
                      <button
                        type="button"
                        onClick={removeImage}
                        style={{
                          background: '#ff6b6b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Remove Image
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ 
                    border: '2px dashed var(--lightest-navy)', 
                    borderRadius: '4px', 
                    padding: '20px', 
                    textAlign: 'center',
                    background: 'var(--light-navy)'
                  }}>
                    <label 
                      htmlFor="image-upload-featured"
                      style={{ 
                        cursor: 'pointer',
                        color: 'var(--green)',
                        fontWeight: '600'
                      }}
                    >
                      Click to upload image
                    </label>
                    <input
                      id="image-upload-featured"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label htmlFor="imageAlt" style={{ display: 'block', marginBottom: '5px', color: 'var(--lightest-slate)' }}>
                  Image Alt Text
                </label>
                <input
                  type="text"
                  id="imageAlt"
                  name="imageAlt"
                  value={formData.image.alt}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    image: { ...prev.image, alt: e.target.value }
                  }))}
                  placeholder="Description of the image for accessibility"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid var(--lightest-navy)',
                    borderRadius: '4px',
                    backgroundColor: 'var(--light-navy)',
                    color: 'var(--lightest-slate)'
                  }}
                />
              </div>

              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                justifyContent: 'flex-end',
                marginTop: '20px'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  style={{
                    background: 'var(--lightest-navy)',
                    color: 'var(--lightest-slate)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '10px 20px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    background: 'var(--green)',
                    color: 'var(--navy)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '10px 20px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  {isEditing ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

Featured.propTypes = {
  data: PropTypes.array,
  onDataChange: PropTypes.func
};

export default Featured;
