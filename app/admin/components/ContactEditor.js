'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';

const StyledContactEditor = styled.div`
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
    
    input, select {
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
    
    .address-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }
    
    .social-links-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
      
      .social-input {
        .social-label {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 5px;
          
          .social-icon {
            font-size: 1.2em;
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
      
      .contact-info {
        margin-bottom: 20px;
        
        .info-item {
          margin: 10px 0;
          display: flex;
          align-items: center;
          gap: 10px;
          
          .icon {
            color: var(--green);
            width: 20px;
          }
        }
      }
      
      .social-links {
        .social-item {
          margin: 8px 0;
          display: flex;
          align-items: center;
          gap: 10px;
          
          .icon {
            color: var(--green);
            width: 20px;
          }
          
          a {
            color: var(--green);
            text-decoration: none;
            
            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
`;

const ContactEditor = () => {
  const [contactData, setContactData] = useState({
    email: '',
    phone: '',
    location: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
      instagram: '',
      facebook: '',
      youtube: '',
      behance: '',
      dribbble: ''
    },
    availability: 'Available',
    responseTime: '',
    workingHours: '',
    timezone: ''
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const response = await fetch('/api/contact');
      if (response.ok) {
        const data = await response.json();
        setContactData(data);
      }
    } catch (error) {
      toast.error('Failed to fetch contact data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setContactData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setContactData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactData),
      });

      if (response.ok) {
        toast.success('Contact information updated successfully!');
        fetchContactData();
      } else {
        toast.error('Failed to update contact information');
      }
    } catch (error) {
      toast.error('Error updating contact information');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <StyledContactEditor>
      <div className="header">
        <h2>Edit Contact Information</h2>
        <p>Update your contact details and social media links</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-container">
          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              value={contactData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              value={contactData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div className="form-group">
            <label>Location</label>
            <input
              type="text"
              value={contactData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, State, Country"
            />
          </div>

          <div className="form-group">
            <label>Address</label>
            <div className="address-grid">
              <div>
                <label>Street</label>
                <input
                  type="text"
                  value={contactData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  placeholder="Street address"
                />
              </div>
              <div>
                <label>City</label>
                <input
                  type="text"
                  value={contactData.address.city}
                  onChange={(e) => handleInputChange('address.city', e.target.value)}
                  placeholder="City"
                />
              </div>
              <div>
                <label>State/Province</label>
                <input
                  type="text"
                  value={contactData.address.state}
                  onChange={(e) => handleInputChange('address.state', e.target.value)}
                  placeholder="State or Province"
                />
              </div>
              <div>
                <label>Country</label>
                <input
                  type="text"
                  value={contactData.address.country}
                  onChange={(e) => handleInputChange('address.country', e.target.value)}
                  placeholder="Country"
                />
              </div>
              <div>
                <label>ZIP/Postal Code</label>
                <input
                  type="text"
                  value={contactData.address.zipCode}
                  onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                  placeholder="ZIP or Postal Code"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Social Media Links</label>
            <div className="social-links-grid">
              <div className="social-input">
                <div className="social-label">
                  <span className="social-icon">🐙</span>
                  <label>GitHub</label>
                </div>
                <input
                  type="url"
                  value={contactData.socialLinks.github}
                  onChange={(e) => handleInputChange('socialLinks.github', e.target.value)}
                  placeholder="https://github.com/username"
                />
              </div>
              
              <div className="social-input">
                <div className="social-label">
                  <span className="social-icon">💼</span>
                  <label>LinkedIn</label>
                </div>
                <input
                  type="url"
                  value={contactData.socialLinks.linkedin}
                  onChange={(e) => handleInputChange('socialLinks.linkedin', e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              
              <div className="social-input">
                <div className="social-label">
                  <span className="social-icon">🐦</span>
                  <label>Twitter</label>
                </div>
                <input
                  type="url"
                  value={contactData.socialLinks.twitter}
                  onChange={(e) => handleInputChange('socialLinks.twitter', e.target.value)}
                  placeholder="https://twitter.com/username"
                />
              </div>
              
              <div className="social-input">
                <div className="social-label">
                  <span className="social-icon">📷</span>
                  <label>Instagram</label>
                </div>
                <input
                  type="url"
                  value={contactData.socialLinks.instagram}
                  onChange={(e) => handleInputChange('socialLinks.instagram', e.target.value)}
                  placeholder="https://instagram.com/username"
                />
              </div>
              
              <div className="social-input">
                <div className="social-label">
                  <span className="social-icon">📘</span>
                  <label>Facebook</label>
                </div>
                <input
                  type="url"
                  value={contactData.socialLinks.facebook}
                  onChange={(e) => handleInputChange('socialLinks.facebook', e.target.value)}
                  placeholder="https://facebook.com/username"
                />
              </div>
              
              <div className="social-input">
                <div className="social-label">
                  <span className="social-icon">📺</span>
                  <label>YouTube</label>
                </div>
                <input
                  type="url"
                  value={contactData.socialLinks.youtube}
                  onChange={(e) => handleInputChange('socialLinks.youtube', e.target.value)}
                  placeholder="https://youtube.com/@username"
                />
              </div>
              
              <div className="social-input">
                <div className="social-label">
                  <span className="social-icon">🎨</span>
                  <label>Behance</label>
                </div>
                <input
                  type="url"
                  value={contactData.socialLinks.behance}
                  onChange={(e) => handleInputChange('socialLinks.behance', e.target.value)}
                  placeholder="https://behance.net/username"
                />
              </div>
              
              <div className="social-input">
                <div className="social-label">
                  <span className="social-icon">🏀</span>
                  <label>Dribbble</label>
                </div>
                <input
                  type="url"
                  value={contactData.socialLinks.dribbble}
                  onChange={(e) => handleInputChange('socialLinks.dribbble', e.target.value)}
                  placeholder="https://dribbble.com/username"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Availability</label>
            <select
              value={contactData.availability}
              onChange={(e) => handleInputChange('availability', e.target.value)}
            >
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          <div className="form-group">
            <label>Response Time</label>
            <input
              type="text"
              value={contactData.responseTime}
              onChange={(e) => handleInputChange('responseTime', e.target.value)}
              placeholder="e.g., 24 hours"
            />
          </div>

          <div className="form-group">
            <label>Working Hours</label>
            <input
              type="text"
              value={contactData.workingHours}
              onChange={(e) => handleInputChange('workingHours', e.target.value)}
              placeholder="e.g., 9 AM - 6 PM EST"
            />
          </div>

          <div className="form-group">
            <label>Timezone</label>
            <input
              type="text"
              value={contactData.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              placeholder="e.g., EST, PST, UTC"
            />
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
          <div className="contact-info">
            {contactData.email && (
              <div className="info-item">
                <span className="icon">📧</span>
                <span>{contactData.email}</span>
              </div>
            )}
            {contactData.phone && (
              <div className="info-item">
                <span className="icon">📞</span>
                <span>{contactData.phone}</span>
              </div>
            )}
            {contactData.location && (
              <div className="info-item">
                <span className="icon">📍</span>
                <span>{contactData.location}</span>
              </div>
            )}
            {contactData.workingHours && (
              <div className="info-item">
                <span className="icon">🕒</span>
                <span>{contactData.workingHours}</span>
              </div>
            )}
            {contactData.availability && (
              <div className="info-item">
                <span className="icon">🟢</span>
                <span>Status: {contactData.availability}</span>
              </div>
            )}
          </div>
          
          <div className="social-links">
            <h4>Social Links:</h4>
            {Object.entries(contactData.socialLinks).map(([platform, url]) => {
              if (!url) return null;
              const icons = {
                github: '🐙',
                linkedin: '💼',
                twitter: '🐦',
                instagram: '📷',
                facebook: '📘',
                youtube: '📺',
                behance: '🎨',
                dribbble: '🏀'
              };
              return (
                <div key={platform} className="social-item">
                  <span className="icon">{icons[platform]}</span>
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </StyledContactEditor>
  );
};

export default ContactEditor;
