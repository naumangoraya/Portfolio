'use client';

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Link from 'next/link';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Icon } from '@components/icons';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { usePrefersReducedMotion } from '@hooks';
import { useAuth } from '../../contexts/AuthContext';
import { useProjects } from '../../hooks/useProjects';
import { formatTextWithBackticks } from '../../utils/textFormatting';
import toast from 'react-hot-toast';

// Helper function to get adjustable image URL
const getAdjustableImageUrl = (url, width = 300, height = 200, crop = 'fill') => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  // If it's a Cloudinary URL, add transformation parameters
  const baseUrl = url.split('/upload/')[0] + '/upload/';
  const publicId = url.split('/upload/')[1];
  
  return `${baseUrl}c_fill,w_${width},h_${height},q_auto/${publicId}`;
};

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

  .admin-controls {
    margin-top: 20px;
    display: flex;
    gap: 10px;

    .add-button {
      ${({ theme }) => theme.mixins.button};
      background: var(--green);
      color: var(--navy);
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 4px;
      font-weight: 600;

      &:hover {
        background: var(--light-green);
      }
    }
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
    overflow: hidden;
  }

  .project-image {
    width: 100%;
    height: 200px;
    margin: -2rem -1.75rem 1rem -1.75rem;
    background-color: var(--lightest-navy);
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: var(--border-radius) var(--border-radius) 0 0;
    position: relative;
    overflow: hidden;

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      opacity: 0;
      transition: opacity 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: var(--fz-sm);
      font-weight: 600;
    }

    &:hover .image-overlay {
      opacity: 1;
    }

    .featured-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background: var(--green);
      color: var(--navy);
      padding: 4px 8px;
      border-radius: 12px;
      font-size: var(--fz-xs);
      font-weight: 600;
      font-family: var(--font-mono);
    }
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

  .admin-project-controls {
    position: absolute;
    top: 10px;
    right: 10px;
    display: flex;
    gap: 5px;
    z-index: 10;

    button {
      padding: 4px 8px;
      border: none;
      border-radius: 3px;
      font-size: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }
    }

    .delete {
      background: #ff6b6b;
      color: white;

      &:hover {
        background: #ff5252;
      }
    }

    .feature {
      background: var(--green);
      color: var(--navy);

      &:hover {
        background: #4ade80;
      }
    }

    .unfeature {
      background: #f59e0b;
      color: white;

      &:hover {
        background: #d97706;
      }
    }
  }

  &:hover .admin-project-controls {
    opacity: 1;
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

      input, textarea, select {
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

const Projects = ({ data = [] }) => {
  const { isAdmin, editMode } = useAuth();
  const { projects, regularProjects, isLoading, error, refreshData } = useProjects(data);
  
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
    featured: false,
    showInProjects: true
  });
  const [showMore, setShowMore] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const revealTitle = useRef(null);
  const revealArchiveLink = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  const GRID_LIMIT = 6;
  
  // Use only projects from database - no dummy data fallback
  const displayProjects = regularProjects;
  
  // Calculate which projects to show based on showMore state
  const projectsToShow = showMore ? displayProjects : displayProjects.slice(0, GRID_LIMIT);

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = async (file) => {
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
        
        // Update the form data with the uploaded image
        setFormData(prev => ({
          ...prev,
          image: {
            url: result.url,
            alt: prev.image.alt || file.name,
            publicId: result.publicId
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

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: { url: '', alt: '' }
    }));
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
        toast.success(isEditing ? 'Project updated successfully!' : 'Project created successfully!');
        
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
      featured: false,
      showInProjects: true
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

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title || '',
      description: project.description || '',
      github: project.github || '',
      external: project.external || '',
      tech: Array.isArray(project.tech) ? project.tech.join(', ') : project.tech || '',
      image: project.image || { url: '', alt: '' },
      featured: project.featured || false,
      showInProjects: project.showInProjects !== false
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (projectId) => {
    if (!confirm('Are you sure you want to delete this project?')) {
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
        toast.success('Project deleted successfully!');
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
        featured: !project.featured,
        showInProjects: project.featured // If it was featured, now show in projects
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
        toast.success(project.featured ? 'Project moved to regular projects!' : 'Project marked as featured!');
        
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

  const handleAdd = () => {
    setEditingProject(null);
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      github: '',
      external: '',
      tech: '',
      image: { url: '', alt: '' },
      featured: false,
      showInProjects: true
    });
  };

  const projectInner = project => {
    const { github, external, title, tech, description, image, featured } = project;

    return (
      <div className="project-inner">
        {isAdmin && editMode && (
          <div className="admin-project-controls">
            <button onClick={() => handleEdit(project)}>Edit</button>
            <button className="delete" onClick={() => handleDelete(project._id)}>Delete</button>
            <button 
              className={featured ? "unfeature" : "feature"}
              onClick={() => handleToggleFeatured(project)}
            >
              {featured ? 'Unfeature' : 'Feature'}
            </button>
          </div>
        )}
        
        {/* Only show images for featured projects */}
        {featured && image && image.url && (
          <div 
            className="project-image"
            style={{ backgroundImage: `url(${getAdjustableImageUrl(image.url, 300, 200, 'fill')})` }}
          >
            <div className="featured-badge">Featured</div>
            <div className="image-overlay">
              {image.alt || 'Project Preview'}
            </div>
          </div>
        )}
        
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
            <a href={external || github} target="_blank" rel="noopener noreferrer">
                              {formatTextWithBackticks(title)}
            </a>
          </h3>

                                    <div className="project-description">
                    {formatTextWithBackticks(description)}
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
    <>
      <StyledProjectsSection>
        <h2 ref={revealTitle}>Other Noteworthy Projects</h2>

        <Link className="inline-link archive-link" href="/archive" ref={revealArchiveLink}>
          view the archive
        </Link>

        {isAdmin && editMode && (
          <div className="admin-controls">
            <button className="add-button" onClick={handleAdd}>
              Add New Project
            </button>
          </div>
        )}

        <ul className="projects-grid">
          {isLoading ? (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '40px',
              color: 'var(--light-slate)'
            }}>
              Loading projects...
            </div>
          ) : error ? (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '40px',
              color: '#ff6b6b'
            }}>
              Error loading projects: {error}
            </div>
          ) : displayProjects && displayProjects.length > 0 ? (
            prefersReducedMotion ? (
              <>
                {projectsToShow &&
                  projectsToShow.map((project, i) => (
                    <StyledProject key={project._id || i}>{projectInner(project)}</StyledProject>
                  ))}
              </>
            ) : (
              <TransitionGroup component={null}>
                {projectsToShow &&
                  projectsToShow.map((project, i) => (
                    <CSSTransition
                      key={project._id || i}
                      classNames="fadeup"
                      timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                      exit={false}>
                      <StyledProject
                        key={project._id || i}
                        ref={el => (revealProjects.current[i] = el)}
                        style={{
                          transitionDelay: `${i >= GRID_LIMIT ? (i - GRID_LIMIT) * 100 : 0}ms`,
                        }}>
                        {projectInner(project)}
                      </StyledProject>
                    </CSSTransition>
                  ))}
              </TransitionGroup>
            )
          ) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '40px',
              color: 'var(--light-slate)'
            }}>
              <h3 style={{ marginBottom: '20px', color: 'var(--lightest-slate)' }}>
                No Projects Yet
              </h3>
              <p style={{ marginBottom: '20px' }}>
                Start building your portfolio by adding your first project!
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
                  Add Your First Project
                </button>
              )}
            </div>
          )}
        </ul>

        {displayProjects.length > GRID_LIMIT && (
          <button className="more-button" onClick={() => setShowMore(!showMore)}>
            Show {showMore ? 'Less' : 'More'}
          </button>
        )}
      </StyledProjectsSection>

      {isModalOpen && (
        <StyledModal onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div className="modal-content">
            <h3>{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title *</label>
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
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
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

              <div className="form-group">
                <label htmlFor="github">GitHub URL</label>
                <input
                  type="url"
                  id="github"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="external">Live Demo URL</label>
                <input
                  type="url"
                  id="external"
                  name="external"
                  value={formData.external}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  />
                  Featured Project
                </label>
                <div style={{ 
                  fontSize: 'var(--fz-xs)', 
                  color: 'var(--slate)', 
                  marginLeft: '25px',
                  fontStyle: 'italic'
                }}>
                  Featured projects appear in the &quot;Some Things I&apos;ve Built&quot; section with images. 
                  Regular projects appear in &quot;Other Noteworthy Projects&quot; without images.
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="project-image">Project Image (Featured Projects Only)</label>
                <div style={{ 
                  fontSize: 'var(--fz-xs)', 
                  color: 'var(--slate)', 
                  marginBottom: '10px',
                  fontStyle: 'italic'
                }}>
                  Images are only displayed for featured projects. Regular projects will not show images.
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
                      htmlFor="image-upload"
                      style={{ 
                        cursor: 'pointer',
                        color: 'var(--green)',
                        fontWeight: '600'
                      }}
                    >
                      {isUploading ? 'Uploading...' : 'Click to upload image'}
                    </label>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="imageAlt">Image Alt Text</label>
                <input
                  type="text"
                  id="imageAlt"
                  name="imageAlt"
                  value={formData.image.alt}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    image: { ...prev.image, alt: e.target.value }
                  }))}
                  placeholder="Describe the image for accessibility"
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
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
                    id="showInProjects"
                    name="showInProjects"
                    checked={formData.showInProjects}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="showInProjects">Show in Projects</label>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="save">
                  {editingProject ? 'Update' : 'Create'} Project
                </button>
              </div>
            </form>
          </div>
        </StyledModal>
      )}
    </>
  );
};

Projects.propTypes = {
  data: PropTypes.array,
};

export default Projects;
