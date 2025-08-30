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

const StyledServicesSection = styled.section`
  max-width: 1000px;
  margin: 0 auto 100px;
  padding: 0 20px;

  .admin-controls {
    margin-top: 20px;
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

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-top: 50px;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 15px;
    }
  }

  .service-card {
    background-color: var(--light-navy);
    border: 1px solid var(--lightest-navy);
    border-radius: 6px;
    padding: 25px;
    position: relative;
    transition: var(--transition);
    min-height: 180px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 10px 30px -10px rgba(2, 12, 27, 0.7);
    text-align: center;

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px -20px rgba(2, 12, 27, 0.7);
    }

    .admin-service-controls {
      position: absolute;
      top: 20px;
      right: 20px;
      display: flex;
      gap: 8px;
      opacity: 0;
      transition: opacity 0.2s ease;

      button {
        background: var(--green);
        color: var(--navy);
        border: none;
        border-radius: 4px;
        padding: 6px 12px;
        font-size: 11px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s ease;

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(100, 255, 100, 0.3);
        }

        &.delete {
          background: #ff6b6b;
          color: white;

          &:hover {
            background: #ff5252;
            box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
          }
        }
      }
    }

    &:hover .admin-service-controls {
      opacity: 1;
    }

    .service-title {
      color: var(--lightest-slate);
      font-size: var(--fz-xxl);
      font-weight: 700;
      margin-bottom: 25px;
      line-height: 1.2;
      text-align: center;
    }

    .service-description {
      color: var(--light-slate);
      font-size: var(--fz-lg);
      line-height: 1.7;
      flex-grow: 1;
      text-align: center;
    }
  }

  .empty-state {
    text-align: center;
    color: var(--slate);
    padding: 80px 20px;
    
    .icon {
      font-size: 4em;
      margin-bottom: 25px;
      opacity: 0.6;
      color: var(--green);
    }

    .message {
      font-size: var(--fz-lg);
      margin-bottom: 25px;
      color: var(--light-slate);
      font-weight: 500;
    }

    .add-first-button {
      background: var(--green);
      color: var(--navy);
      border: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: var(--font-mono);

      &:hover {
        background: var(--light-green);
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(100, 255, 100, 0.3);
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

const Services = ({ data = [] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceData, setServiceData] = useState(data);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: ''
  });

  const { isAdmin, editMode } = useAuth();
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Function to format text and highlight backtick-wrapped content
  const formatText = (text) => {
    if (!text) return '';
    return formatTextWithBackticks(text);
  };

  // Dummy data to display when no data comes from database
  const dummyServices = [
    {
      _id: 'dummy1',
      title: "`Web Development`",
      shortDescription: "Full-stack `web development` with modern technologies. Building responsive, performant applications that deliver exceptional user experiences.",
      icon: "",
      isFeatured: false,
      category: "",
      features: []
    },
    {
      _id: 'dummy2',
      title: "`AI & Machine Learning`",
      shortDescription: "Designing and implementing intelligent systems using cutting-edge `AI/ML` technologies. From data preprocessing to model deployment.",
      icon: "",
      isFeatured: false,
      category: "",
      features: []
    },
    {
      _id: 'dummy3',
      title: "`UI/UX Design`",
      shortDescription: "Creating intuitive and beautiful user interfaces. Focused on `user-centered design` principles and modern design systems.",
      icon: "",
      isFeatured: false,
      category: "",
      features: []
    },
    {
      _id: 'dummy4',
      title: "`Business Automation`",
      shortDescription: "Streamlining business processes through intelligent `automation`. Integrating platforms and building efficient workflows.",
      icon: "",
      isFeatured: false,
      category: "",
      features: []
    },
    {
      _id: 'dummy5',
      title: "`LLM Integration`",
      shortDescription: "Building intelligent applications powered by `Large Language Models`. Creating RAG systems, AI agents, and smart APIs.",
      icon: "",
      isFeatured: false,
      category: "",
      features: []
    }
  ];

  // Use dummy data if no real data is provided, otherwise use serviceData state
  const servicesToDisplay = serviceData && serviceData.length > 0 ? serviceData : dummyServices;

  useEffect(() => {
    setServiceData(data);
  }, [data]);

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
    
    const servicePayload = {
      ...formData
    };

    try {
      if (editingService) {
        // Update existing service
        const response = await fetch(`/api/services/${editingService._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          },
          body: JSON.stringify(servicePayload),
        });

        if (response.ok) {
          const updatedService = await response.json();
          setServiceData(prev => prev.map(s => s._id === editingService._id ? updatedService.service : s));
          toast.success('Service updated successfully!');
        } else {
          toast.error('Failed to update service');
        }
      } else {
        // Create new service
        const response = await fetch('/api/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          },
          body: JSON.stringify(servicePayload),
        });

        if (response.ok) {
          const newService = await response.json();
          setServiceData(prev => [...prev, newService.service]);
          toast.success('Service created successfully!');
        } else {
          toast.error('Failed to create service');
        }
      }

      setIsModalOpen(false);
      setEditingService(null);
      resetForm();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error('An error occurred while saving the service');
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title || '',
      description: service.description || '',
      shortDescription: service.shortDescription || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (serviceId) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      const response = await fetch(`/api/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        setServiceData(prev => prev.filter(s => s._id !== serviceId));
        toast.success('Service deleted successfully!');
      } else {
        toast.error('Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error('An error occurred while deleting the service');
    }
  };

  const handleAdd = () => {
    setEditingService(null);
    resetForm();
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      shortDescription: ''
    });
  };

  return (
    <>
      <StyledServicesSection id="services" ref={revealContainer}>
        <h2 className="numbered-heading">What I Do</h2>

        {isAdmin && editMode && (
          <div className="admin-controls">
            <button className="add-button" onClick={handleAdd}>
              Add New Service
            </button>
          </div>
        )}

        <div className="services-grid">
          {servicesToDisplay.length > 0 ? (
            servicesToDisplay.map((service, i) => (
              <div key={service._id || i} className="service-card">
                {isAdmin && editMode && (
                  <div className="admin-service-controls">
                    <button onClick={() => handleEdit(service)}>Edit</button>
                    <button className="delete" onClick={() => handleDelete(service._id)}>Delete</button>
                  </div>
                )}

                <div className="service-title">{formatText(service.title)}</div>
                <div className="service-description">
                  {formatText(service.shortDescription || service.description)}
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="icon">🚀</div>
              <div className="message">No services added yet</div>
              {isAdmin && editMode && (
                <button className="add-first-button" onClick={handleAdd}>
                  Add Your First Service
                </button>
              )}
            </div>
          )}
        </div>
      </StyledServicesSection>

      {isModalOpen && (
        <StyledModal onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div className="modal-content">
            <h3>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
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
                <label htmlFor="shortDescription">Description *</label>
                <textarea
                  id="shortDescription"
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Describe your service..."
                />
              </div>

              <div className="form-actions">
                <button type="button" className="cancel" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="save">
                  {editingService ? 'Update' : 'Create'} Service
                </button>
              </div>
            </form>
          </div>
        </StyledModal>
      )}
    </>
  );
};

Services.propTypes = {
  data: PropTypes.array,
};

export default Services; 