'use client';

import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import { srConfig } from '../../src/config';
import sr from '../../src/utils/sr';
import { Icon } from '../../src/components/icons';
import { usePrefersReducedMotion } from '../../src/hooks';
import { useAuth } from '../../src/contexts/AuthContext';
import AdminControls from '../../src/components/AdminControls';
import { formatTextWithBackticks } from '../../src/utils/textFormatting';
import toast from 'react-hot-toast';

const StyledTableContainer = styled.div`
  margin: 100px -20px;

  @media (max-width: 768px) {
    margin: 50px -10px;
  }

  .admin-controls {
    margin-bottom: 30px;
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
      transition: all 0.2s ease;

      &:hover {
        background: var(--light-green);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(100, 255, 100, 0.2);
      }
    }
  }

  table {
    width: 100%;
    border-collapse: collapse;

    .hide-on-mobile {
      @media (max-width: 768px) {
        display: none;
      }
    }

    tbody tr {
      position: relative;
      
      &:hover,
      &:focus {
        background-color: var(--light-navy);
      }

      .admin-row-controls {
        display: flex;
        gap: 5px;
        justify-content: center;
        align-items: center;

        button {
          background: var(--green);
          color: var(--navy);
          border: none;
          border-radius: 3px;
          padding: 4px 8px;
          font-size: 10px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;

          &:hover {
            background: var(--light-green);
            transform: translateY(-1px);
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

      .admin-controls-cell {
        min-width: 80px;
        text-align: center;
      }
    }

    th,
    td {
      padding: 10px;
      text-align: left;

      &:first-child {
        padding-left: 20px;

        @media (max-width: 768px) {
          padding-left: 10px;
        }
      }
      &:last-child {
        padding-right: 20px;

        @media (max-width: 768px) {
          padding-right: 10px;
        }
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }

    tr {
      cursor: default;

      td:first-child {
        border-top-left-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
      }
      td:last-child {
        border-top-right-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
      }
    }

    td {
      &.year {
        padding-right: 20px;

        @media (max-width: 768px) {
          padding-right: 10px;
          font-size: var(--fz-sm);
        }
      }

      &.title {
        padding-top: 15px;
        padding-right: 20px;
        color: var(--lightest-slate);
        font-size: var(--fz-xl);
        font-weight: 600;
        line-height: 1.25;
      }

      &.company {
        font-size: var(--fz-lg);
        white-space: nowrap;
      }

             &.tech {
         font-size: var(--fz-sm);
         font-family: var(--font-mono);
         line-height: 1.5;
         .separator {
           margin: 0 5px;
         }
         span {
           display: inline-block;
         }
       }

      &.links {
        min-width: 100px;

        div {
          display: flex;
          align-items: center;

          a {
            ${({ theme }) => theme.mixins.flexCenter};
            flex-shrink: 0;
          }

          a + a {
            margin-left: 10px;
          }
        }
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
        min-height: 80px;
        resize: vertical;
      }

      .tech-inputs {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        align-items: center;

        .tech-tag {
          background: var(--green);
          color: var(--navy);
          padding: 5px 10px;
          border-radius: 15px;
          font-size: var(--fz-xs);
          display: flex;
          align-items: center;
          gap: 5px;

          button {
            background: none;
            border: none;
            color: var(--navy);
            cursor: pointer;
            font-size: 14px;
            padding: 0;
            margin: 0;
          }
        }

        .add-tech {
          display: flex;
          gap: 10px;
          align-items: center;

          input {
            width: 120px;
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

export default function ArchivePageClient({ initialData = [] }) {
  const revealTitle = useRef(null);
  const revealTable = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { isAdmin, editMode, isLoading } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [archiveData, setArchiveData] = useState(initialData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    date: '',
    tech: [],
    github: '',
    external: '',
    ios: '',
    android: '',
    content: ''
  });

     // Fetch initial data only if not provided as prop
   useEffect(() => {
     console.log('🚀 Component mounted, initialData:', initialData?.length || 0, 'items');
     console.log('📊 Initial archiveData state:', archiveData);
     
     // Only fetch from API if no initialData provided
     if (!initialData || initialData.length === 0) {
       console.log('🔄 No initial data provided, fetching from API...');
       refreshArchiveData();
     } else {
       console.log('✅ Using provided initialData, no API fetch needed');
     }
   }, [initialData]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealTable.current, srConfig(200, 0));
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 10)));
  }, [prefersReducedMotion]);

  // Debug authentication state
  useEffect(() => {
    console.log('Archive Page - Auth State:', { isAdmin, editMode, isLoading });
    if (isAdmin) {
      const token = localStorage.getItem('adminToken');
      console.log('Admin token available:', !!token);
      console.log('Token value:', token ? token.substring(0, 20) + '...' : 'No token');
    }
  }, [isAdmin, editMode, isLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTechChange = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTech = e.target.value.trim();
      if (newTech && !formData.tech.includes(newTech)) {
        setFormData(prev => ({
          ...prev,
          tech: [...prev.tech, newTech]
        }));
        e.target.value = '';
      }
    }
  };

  const removeTech = (index) => {
    setFormData(prev => ({
      ...prev,
      tech: prev.tech.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check authentication before submitting
    if (!isAdmin) {
      toast.error('You must be logged in as admin to perform this action');
      return;
    }

    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      toast.error('Admin token not found. Please log in again.');
      return;
    }

    setIsSubmitting(true);
    console.log('Submitting form with token:', adminToken ? 'Token exists' : 'No token');
    
         try {
       // Validate required fields
       if (!formData.title.trim()) {
         toast.error('Title is required');
         return;
       }
       
       if (!formData.date) {
         toast.error('Date is required');
         return;
       }
       
       // Clean and prepare form data - handle empty fields properly
       const cleanedFormData = {
         title: formData.title.trim(),
         company: formData.company.trim() || null,
         date: formData.date,
         tech: formData.tech.filter(tech => tech.trim() !== ''),
         github: formData.github.trim() || null,
         external: formData.external.trim() || null,
         ios: formData.ios.trim() || null,
         android: formData.android.trim() || null,
         content: formData.content.trim() || ''
       };

      console.log('Submitting cleaned data:', cleanedFormData);
      console.log('Tech array before submission:', formData.tech);
      console.log('Tech array after cleaning:', cleanedFormData.tech);

      if (editingProject) {
        // Update existing project
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        };
        console.log('Update request headers:', headers);
        
                 const response = await fetch('/api/archive', {
           method: 'PUT',
           headers,
           body: JSON.stringify({
             ...cleanedFormData,
             slug: editingProject.slug // Include the slug for the API
           }),
         });

        console.log('Update response status:', response.status);

                 if (response.ok) {
           const updatedProject = await response.json();
           console.log('Update response:', updatedProject);
           await refreshArchiveData();
           toast.success('Archive entry updated successfully!');
         } else {
           const errorData = await response.json();
           console.error('Update failed:', errorData);
           toast.error(`Failed to update archive entry: ${errorData.error || 'Unknown error'}`);
           return; // Don't close modal on error
         }
      } else {
        // Create new project
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`,
        };
        console.log('Create request headers:', headers);
        
        const response = await fetch('/api/archive', {
          method: 'POST',
          headers,
          body: JSON.stringify(cleanedFormData),
        });

        console.log('Create response status:', response.status);

                 if (response.ok) {
           const newProject = await response.json();
           console.log('API response data:', newProject);
           await refreshArchiveData();
           toast.success('Archive entry created successfully!');
         } else {
           const errorData = await response.json();
           console.error('Create failed:', errorData);
           toast.error(`Failed to create archive entry: ${errorData.error || 'Unknown error'}`);
           return; // Don't close modal on error
         }
      }

             setIsModalOpen(false);
       setEditingProject(null);
       resetForm();
     } catch (error) {
       console.error('Error saving archive entry:', error);
       toast.error('An error occurred while saving the archive entry');
     } finally {
       setIsSubmitting(false);
     }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    
    // Format date for input field (YYYY-MM-DD)
    let formattedDate = '';
    if (project.date) {
      const date = new Date(project.date);
      if (!isNaN(date.getTime())) {
        formattedDate = date.toISOString().split('T')[0];
      }
    }
    
    setFormData({
      title: project.title || '',
      company: project.company || '',
      date: formattedDate,
      tech: project.tech || [],
      github: project.github || '',
      external: project.external || '',
      ios: project.ios || '',
      android: project.android || '',
      content: project.content || ''
    });
    setIsModalOpen(true);
  };

     const handleDelete = async (projectSlug) => {
     if (!confirm('Are you sure you want to delete this archive entry?')) {
       return;
     }

     try {
       console.log('🗑️ Attempting to delete archive with slug:', projectSlug);
       
       const response = await fetch(`/api/archive?slug=${projectSlug}`, {
         method: 'DELETE',
         headers: {
           'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
         },
       });

       console.log('📡 Delete response status:', response.status);

       if (response.ok) {
         await refreshArchiveData();
         toast.success('Archive entry deleted successfully!');
       } else {
         const errorData = await response.json();
         console.error('❌ Delete failed:', response.status, errorData);
         toast.error(`Failed to delete archive entry: ${errorData.error || 'Unknown error'}`);
       }
     } catch (error) {
       console.error('💥 Error deleting archive entry:', error);
       toast.error('An error occurred while deleting the archive entry');
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
      company: '',
      date: '',
      tech: [],
      github: '',
      external: '',
      ios: '',
      android: '',
      content: ''
    });
  };

     const refreshArchiveData = async () => {
     try {
       setIsRefreshing(true);
       console.log('🔍 Fetching archive data from API...');
       
       const response = await fetch('/api/archive');
       console.log('📡 API Response status:', response.status);
       
       if (response.ok) {
         const data = await response.json();
         console.log('📊 Raw API response:', data);
         console.log('📋 Data structure check:', {
           hasData: !!data,
           isArray: Array.isArray(data),
           hasProjects: data && Array.isArray(data.projects),
           projectsLength: data?.projects?.length || 0,
           dataKeys: data ? Object.keys(data) : []
         });
         
         // Ensure we always set an array, even if the API response is unexpected
         if (data && Array.isArray(data.projects)) {
           console.log('✅ Setting archive data from data.projects:', data.projects);
           setArchiveData(data.projects);
         } else if (data && Array.isArray(data)) {
           console.log('⚠️ Setting archive data from data array directly:', data);
           setArchiveData(data);
         } else {
           console.warn('❌ Unexpected API response structure:', data);
           setArchiveData([]);
         }
       } else {
         console.error('❌ API response not ok:', response.status);
         setArchiveData([]);
       }
     } catch (error) {
       console.error('💥 Error refreshing archive data:', error);
       setArchiveData([]);
     } finally {
       setIsRefreshing(false);
     }
   };

  

  return (
    <main>
      <AdminControls />
      <header ref={revealTitle}>
        <h1 className="big-heading">Archive</h1>
        <p className="subtitle">A big list of things I&apos;ve worked on</p>
      </header>

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--light-slate)' }}>
          Loading authentication...
        </div>
      )}

      {isRefreshing && (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--green)' }}>
          Updating archive data...
        </div>
      )}

             {!isLoading && isAdmin && editMode && (
         <div className="admin-controls">
           <button className="add-button" onClick={handleAdd}>
             Add New Archive Entry
           </button>
           <button 
             className="add-button" 
             onClick={() => {
               console.log('🧹 Force clearing archive data...');
               setArchiveData([]);
               refreshArchiveData();
             }}
             style={{ background: 'var(--light-slate)', color: 'var(--navy)' }}
           >
             🔄 Force Refresh
           </button>
           <button 
             className="add-button" 
             onClick={() => {
               console.log('🗑️ Clearing all archive data...');
               setArchiveData([]);
               localStorage.removeItem('archiveData');
               sessionStorage.removeItem('archiveData');
             }}
             style={{ background: '#ff6b6b', color: 'white' }}
           >
             🗑️ Clear All Data
           </button>
         </div>
       )}

      {!isLoading && !isAdmin && (
        <div style={{ textAlign: 'center', padding: '20px', color: 'var(--light-slate)' }}>
          <p>Welcome to the Archive! Here you can see all the projects I&apos;ve worked on.</p>
        </div>
      )}

      <StyledTableContainer ref={revealTable}>
        <table>
          <thead>
            <tr>
              <th>Year</th>
              <th>Title</th>
              <th className="hide-on-mobile">Made at</th>
              <th className="hide-on-mobile">Built with</th>
              <th>Link</th>
              {/* Only show Actions header when admin is in edit mode */}
              {isAdmin && editMode && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(archiveData) && archiveData.length > 0 &&
              archiveData.map((project, i) => {
                const {
                  date,
                  github,
                  external,
                  ios,
                  android,
                  title,
                  tech,
                  company,
                  slug,
                } = project;
                
                // Debug logging for tech data
                console.log(`Project ${i}:`, { title, tech, techLength: tech?.length });
                
                return (
                  <tr key={i} ref={el => (revealProjects.current[i] = el)}>
                                         <td className="overline year">
                       {date ? `${new Date(date).getFullYear()}` : '—'}
                     </td>

                                         <td className="title">{formatTextWithBackticks(title)}</td>

                    <td className="company hide-on-mobile">
                      {company ? <span>{company}</span> : <span>—</span>}
                    </td>

                    <td className="tech hide-on-mobile">
                      {tech?.length > 0 ? (
                        tech.map((item, i) => (
                          <span key={i}>
                            {item}
                            {i !== tech.length - 1 && <span className="separator">&middot;</span>}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: 'var(--light-slate)', fontStyle: 'italic' }}>—</span>
                      )}
                    </td>

                    <td className="links">
                      <div>
                        {external && (
                          <a href={external} aria-label="External Link">
                            <Icon name="External" />
                          </a>
                        )}
                        {github && (
                          <a href={github} aria-label="GitHub Link">
                            <Icon name="GitHub" />
                          </a>
                        )}
                        {ios && (
                          <a href={ios} aria-label="Apple App Store Link">
                            <Icon name="AppStore" />
                          </a>
                        )}
                        {android && (
                          <a href={android} aria-label="Google Play Store Link">
                            <Icon name="PlayStore" />
                          </a>
                        )}
                      </div>
                    </td>

                    {/* Only show Actions column when admin is in edit mode */}
                    {isAdmin && editMode && (
                      <td className="admin-controls-cell">
                        <div className="admin-row-controls">
                          <button onClick={() => handleEdit(project)}>Edit</button>
                          <button className="delete" onClick={() => handleDelete(slug)}>Delete</button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
          </tbody>
        </table>
        
        {/* Show message when no archive data */}
        {Array.isArray(archiveData) && archiveData.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px', 
            color: 'var(--light-slate)',
            gridColumn: '1 / -1'
          }}>
            <h3 style={{ marginBottom: '20px', color: 'var(--lightest-slate)' }}>
              No Archive Entries Yet
            </h3>
            <p style={{ marginBottom: '20px' }}>
              {isAdmin && editMode 
                ? 'Start building your archive by adding your first entry!' 
                : 'Check back later for more projects!'
              }
            </p>
          </div>
        )}
      </StyledTableContainer>

      {isModalOpen && (
        <StyledModal onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div className="modal-content">
            <h3>{editingProject ? 'Edit Archive Entry' : 'Add New Archive Entry'}</h3>
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
                  placeholder="Enter project title"
                />
              </div>

              <div className="form-group">
                <label htmlFor="company">Company/Made at (Optional)</label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company name or leave empty for '—'"
                />
              </div>

              <div className="form-group">
                <label htmlFor="date">Date *</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="tech">Technologies (Optional)</label>
                <div className="tech-inputs">
                  {formData.tech.map((tech, index) => (
                    <div key={index} className="tech-tag">
                      {tech}
                      <button type="button" onClick={() => removeTech(index)}>×</button>
                    </div>
                  ))}
                  <div className="add-tech">
                    <input
                      type="text"
                      placeholder="Add technology"
                      onKeyDown={handleTechChange}
                      id="tech-input"
                    />
                    <button 
                      type="button" 
                      onClick={() => {
                        const input = document.getElementById('tech-input');
                        if (input && input.value.trim()) {
                          const newTech = input.value.trim();
                          if (newTech && !formData.tech.includes(newTech)) {
                            setFormData(prev => ({
                              ...prev,
                              tech: [...prev.tech, newTech]
                            }));
                            input.value = '';
                          }
                        }
                      }}
                      style={{
                        background: 'var(--green)',
                        color: 'var(--navy)',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: 'var(--fz-xs)',
                        fontWeight: '600'
                      }}
                    >
                      Add
                    </button>
                  </div>
                  <div style={{ fontSize: 'var(--fz-xs)', color: 'var(--light-slate)', marginTop: '5px' }}>
                    Press Enter or click Add button to add technology
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="github">GitHub URL (Optional)</label>
                <input
                  type="url"
                  id="github"
                  name="github"
                  value={formData.github}
                  onChange={handleInputChange}
                  placeholder="https://github.com/... or leave empty"
                />
              </div>

              <div className="form-group">
                <label htmlFor="external">External URL (Optional)</label>
                <input
                  type="url"
                  id="external"
                  name="external"
                  value={formData.external}
                  onChange={handleInputChange}
                  placeholder="https://... or leave empty"
                />
              </div>

              <div className="form-group">
                <label htmlFor="ios">iOS App Store URL (Optional)</label>
                <input
                  type="url"
                  id="ios"
                  name="ios"
                  value={formData.ios}
                  onChange={handleInputChange}
                  placeholder="https://apps.apple.com/... or leave empty"
                />
              </div>

              <div className="form-group">
                <label htmlFor="android">Google Play Store URL (Optional)</label>
                <input
                  type="url"
                  id="android"
                  name="android"
                  value={formData.android}
                  onChange={handleInputChange}
                  placeholder="https://play.google.com/... or leave empty"
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Description (Optional)</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Project description or leave empty"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                                 <button type="submit" className="save" disabled={isSubmitting}>
                   {isSubmitting ? 'Saving...' : (editingProject ? 'Update' : 'Create') + ' Entry'}
                 </button>
              </div>
            </form>
          </div>
        </StyledModal>
      )}
    </main>
  );
}
