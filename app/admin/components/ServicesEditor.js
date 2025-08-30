'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';

const StyledServicesEditor = styled.div`
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

  .services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .service-card {
    background: var(--light-navy);
    border-radius: 8px;
    padding: 20px;
    border: 1px solid var(--navy);
    
    .service-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
      
      .service-title {
        font-size: 1.2em;
        font-weight: 600;
        color: var(--lightest-slate);
        margin: 0 0 5px 0;
      }
      
      .service-icon {
        font-size: 2em;
        margin-bottom: 10px;
      }
      
      .service-actions {
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
    
    .service-description {
      color: var(--light-slate);
      margin-bottom: 15px;
      line-height: 1.6;
    }
    
    .service-features {
      margin-bottom: 15px;
      
      .features-title {
        color: var(--green);
        font-size: 0.9em;
        margin-bottom: 8px;
        font-weight: 500;
      }
      
      .features-list {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        
        .feature-tag {
          background: var(--navy);
          color: var(--light-slate);
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.8em;
        }
      }
    }
    
    .service-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9em;
      color: var(--slate);
      
      .service-category {
        background: var(--navy);
        color: var(--green);
        padding: 3px 8px;
        border-radius: 4px;
      }
      
      .service-featured {
        color: var(--green);
        font-weight: 500;
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
        
        .feature-input {
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
        
        .feature-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
          
          .feature-tag {
            background: var(--navy);
            color: var(--light-slate);
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

const ServicesEditor = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    icon: '💻',
    features: [],
    category: 'Development',
    order: 1,
    isFeatured: false
  });
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (response.ok) {
        const data = await response.json();
        setServices(data);
      }
    } catch (error) {
      toast.error('Failed to fetch services');
    }
  };

  const openModal = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        title: service.title || '',
        description: service.description || '',
        shortDescription: service.shortDescription || '',
        icon: service.icon || '💻',
        features: service.features || [],
        category: service.category || 'Development',
        order: service.order || 1,
        isFeatured: service.isFeatured || false
      });
    } else {
      setEditingService(null);
      setFormData({
        title: '',
        description: '',
        shortDescription: '',
        icon: '💻',
        features: [],
        category: 'Development',
        order: 1,
        isFeatured: false
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      icon: '💻',
      features: [],
      category: 'Development',
      order: 1,
      isFeatured: false
    });
  };

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (featureToRemove) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature !== featureToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingService ? `/api/services/${editingService._id}` : '/api/services';
      const method = editingService ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(editingService ? 'Service updated successfully!' : 'Service created successfully!');
        fetchServices();
        closeModal();
      } else {
        toast.error('Failed to save service');
      }
    } catch (error) {
      toast.error('Error saving service');
    }
  };

  const deleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        const response = await fetch(`/api/services/${serviceId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          toast.success('Service deleted successfully!');
          fetchServices();
        } else {
          toast.error('Failed to delete service');
        }
      } catch (error) {
        toast.error('Error deleting service');
      }
    }
  };

  return (
    <StyledServicesEditor>
      <div className="header">
        <h2>Manage Services</h2>
        <button className="add-btn" onClick={() => openModal()}>
          + Add New Service
        </button>
      </div>

      <div className="services-grid">
        {services.map((service) => (
          <div key={service._id} className="service-card">
            <div className="service-header">
              <div>
                <div className="service-icon">{service.icon}</div>
                <h3 className="service-title">{service.title}</h3>
              </div>
              <div className="service-actions">
                <button onClick={() => openModal(service)}>Edit</button>
                <button className="delete" onClick={() => deleteService(service._id)}>Delete</button>
              </div>
            </div>
            
            <div className="service-description">{service.description}</div>
            
            {service.features && service.features.length > 0 && (
              <div className="service-features">
                <div className="features-title">Features:</div>
                <div className="features-list">
                  {service.features.map((feature, index) => (
                    <span key={index} className="feature-tag">{feature}</span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="service-meta">
              <span className="service-category">{service.category}</span>
              {service.isFeatured && <span className="service-featured">⭐ Featured</span>}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editingService ? 'Edit Service' : 'Add New Service'}</h3>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Service Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Icon (Emoji)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  placeholder="💻"
                />
              </div>
              
              <div className="form-group">
                <label>Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Brief description for cards"
                />
              </div>
              
              <div className="form-group">
                <label>Full Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Training">Training</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Features</label>
                <div className="feature-input">
                  <input
                    type="text"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add feature"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  />
                  <button type="button" onClick={addFeature}>Add</button>
                </div>
                <div className="feature-tags">
                  {formData.features.map((feature, index) => (
                    <span key={index} className="feature-tag">
                      {feature}
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeFeature(feature)}
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
              
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  />
                  Featured Service
                </label>
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="save">
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </StyledServicesEditor>
  );
};

export default ServicesEditor;
