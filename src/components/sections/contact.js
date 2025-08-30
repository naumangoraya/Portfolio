'use client';

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';
import { useAuth } from '../../contexts/AuthContext';
import { formatTextWithBackticks } from '../../utils/textFormatting';
import toast from 'react-hot-toast';

const StyledContactSection = styled.section`
  max-width: 1000px;
  margin: 0 auto 100px;
  padding: 0 20px;

  @media (max-width: 768px) {
    margin: 0 auto 50px;
  }

  .admin-controls {
    margin-top: 20px;
    display: flex;
    gap: 10px;
    justify-content: center;
    flex-wrap: wrap;

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

      &.draft {
        background: var(--light-slate);
        color: var(--lightest-slate);
      }

      &.publish {
        background: var(--green);
        color: var(--navy);
      }
    }
  }

  .overline {
    display: block;
    margin-bottom: 20px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-md);
    font-weight: 400;

    &:before {
      bottom: 0;
      font-size: var(--fz-sm);
    }

    &:after {
      display: none;
    }
  }

  .title {
    font-size: clamp(40px, 5vw, 60px);
    margin-bottom: 50px;
  }

  .contact-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    margin-top: 30px;

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }

  .contact-info {
    h3 {
      color: var(--lightest-slate);
      font-size: var(--fz-xl);
      margin-bottom: 30px;
      font-weight: 600;
    }

    .info-item {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      color: var(--slate);
      font-size: var(--fz-md);

      .icon {
        width: 20px;
        height: 20px;
        margin-right: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
      }

      a {
        color: var(--slate);
        text-decoration: none;
        transition: var(--transition);

        &:hover {
          color: var(--green);
        }
      }
    }

    .social-links {
      margin-top: 35px;

      h4 {
        color: var(--lightest-slate);
        font-size: var(--fz-md);
        margin-bottom: 20px;
        font-weight: 600;
      }

      .social-icons {
        display: flex;
        gap: 15px;

        a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: var(--light-navy);
          color: var(--slate);
          text-decoration: none;
          transition: var(--transition);
          border: 1px solid var(--lightest-navy);

          svg {
            width: 24px;
            height: 24px;
          }

          &:hover {
            color: var(--green);
            transform: translateY(-3px);
            border-color: var(--green);
            box-shadow: 0 8px 25px -8px var(--green);
          }
        }
      }
    }
  }

  .contact-form {
    h3 {
      color: var(--lightest-slate);
      font-size: var(--fz-md);
      margin-bottom: 15px;
      font-weight: 600;
    }

    .form-group {
      margin-bottom: 8px;

      label {
        display: block;
        margin-bottom: 3px;
        color: var(--lightest-slate);
        font-family: var(--font-mono);
        font-size: var(--fz-xs);
        font-weight: 500;
      }

      input, textarea {
        width: 100%;
        padding: 6px 10px;
        background-color: var(--light-navy);
        border: 1px solid var(--lightest-navy);
        border-radius: 3px;
        color: var(--lightest-slate);
        font-family: var(--font-mono);
        font-size: var(--fz-xs);
        transition: var(--transition);
        line-height: 1.2;

        &:focus {
          outline: none;
          border-color: var(--green);
          box-shadow: 0 0 0 1px rgba(100, 255, 218, 0.1);
          background-color: var(--light-navy);
        }

        &::placeholder {
          color: var(--slate);
          opacity: 0.7;
        }
      }

      textarea {
        min-height: 60px;
        resize: vertical;
        line-height: 1.3;
      }
    }

    .submit-button {
      ${({ theme }) => theme.mixins.bigButton};
      margin-top: 10px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      font-size: var(--fz-xs);
      font-weight: 600;
      padding: 8px 16px;
      border-radius: 3px;
      transition: var(--transition);

      svg {
        width: 12px;
        height: 12px;
        transition: var(--transition);
      }

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 3px 10px -3px var(--green);

        svg {
          transform: translateX(2px);
        }
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
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
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;

    h3 {
      color: var(--lightest-slate);
      margin-bottom: 20px;
      font-size: var(--fz-xl);
    }

    .form-tabs {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      border-bottom: 1px solid var(--lightest-navy);

      .tab {
        background: none;
        border: none;
        color: var(--slate);
        padding: 10px 20px;
        cursor: pointer;
        border-bottom: 2px solid transparent;
        transition: var(--transition);

        &.active {
          color: var(--green);
          border-bottom-color: var(--green);
        }

        &:hover {
          color: var(--lightest-slate);
        }
      }
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
        min-height: 80px;
        resize: vertical;
      }

      .field-controls {
        display: flex;
        gap: 10px;
        margin-top: 10px;

        button {
          padding: 5px 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: var(--fz-xs);
          font-weight: 600;

          &.add-field {
            background: var(--green);
            color: var(--navy);
          }

          &.remove-field {
            background: #ff6b6b;
            color: white;
          }

          &.move-up, &.move-down {
            background: var(--light-slate);
            color: var(--lightest-slate);
          }
        }
      }

      .custom-fields {
        .custom-field {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
          align-items: center;

          input {
            flex: 1;
          }

          select {
            width: 120px;
          }

          button {
            background: #ff6b6b;
            color: white;
            border: none;
            border-radius: 4px;
            padding: 8px 12px;
            cursor: pointer;
            font-size: var(--fz-xs);
          }
        }
      }
    }

    .form-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 30px;
      flex-wrap: wrap;

      button {
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        font-size: var(--fz-sm);

        &.save-draft {
          background: var(--light-slate);
          color: var(--lightest-slate);
        }

        &.publish {
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

    .preview-section {
      margin-top: 20px;
      padding: 20px;
      background: var(--light-navy);
      border-radius: 4px;
      border: 1px solid var(--lightest-navy);

      h4 {
        color: var(--green);
        margin-bottom: 15px;
        font-size: var(--fz-md);
      }

      .preview-item {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        color: var(--slate);

        .icon {
          width: 20px;
          margin-right: 10px;
        }
      }
    }
  }
`;

const Contact = ({ data }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactData, setContactData] = useState(data);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [isDraft, setIsDraft] = useState(false);
  
  // Dynamic contact fields - will be populated from database
  const [contactFields, setContactFields] = useState([]);

  const [socialLinks, setSocialLinks] = useState([
    { id: 1, platform: 'github', label: 'GitHub', value: '', icon: 'github', required: false, customIcon: null },
    { id: 2, platform: 'linkedin', label: 'LinkedIn', value: '', icon: 'linkedin', required: false, customIcon: null },
    { id: 3, platform: 'twitter', label: 'Twitter', value: '', icon: 'twitter', required: false, customIcon: null },
    { id: 4, platform: 'instagram', label: 'Instagram', value: '', icon: 'instagram', required: false, customIcon: null }
  ]);

  const { isAdmin, editMode } = useAuth();
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Function to build contact fields based on available data
  const buildContactFields = (data) => {
    const fields = [];
    let id = 1;

    // Always include email (required)
    fields.push({
      id: id++,
      type: 'email',
      label: 'Email',
      value: data?.email || '',
      icon: 'email',
      required: true,
      customIcon: null
    });

    // Only include other fields if they have data
    if (data?.phone) {
      fields.push({
        id: id++,
        type: 'phone',
        label: 'Phone',
        value: data.phone,
        icon: 'phone',
        required: false,
        customIcon: null
      });
    }

    if (data?.address) {
      fields.push({
        id: id++,
        type: 'location',
        label: 'Location',
        value: data.address,
        icon: 'location',
        required: false,
        customIcon: null
      });
    }



    // Add custom fields if they exist
    if (data?.customFields && Array.isArray(data.customFields)) {
      data.customFields.forEach(customField => {
        fields.push({
          id: id++,
          type: customField.type,
          label: customField.label,
          value: customField.value,
          icon: customField.icon || 'portfolio',
          required: false,
          customIcon: customField.customIcon
        });
      });
    }

    return fields;
  };

  // Dummy data to display when no data comes from database
  const dummyContactData = {
    email: 'nauman.noor@gmail.com',
    phone: '+1 (555) 123-4567',
    address: 'Lahore, Pakistan',

    socialLinks: {
      github: 'https://github.com/nauman-noor',
      linkedin: 'https://linkedin.com/in/nauman-noor',
      twitter: 'https://twitter.com/nauman_noor',
      instagram: 'https://instagram.com/nauman.noor'
    }
  };

  // Use dummy data if no real data is provided
  const contactInfo = contactData || dummyContactData;

  useEffect(() => {
    setContactData(data);
    if (data) {
      // Build contact fields dynamically based on available data
      const fields = buildContactFields(data);
      const socials = [...socialLinks];
      
      if (data.social) {
        Object.keys(data.social).forEach(platform => {
          const social = socials.find(s => s.platform === platform);
          if (social) {
            if (typeof data.social[platform] === 'string') {
              // Main social platforms (github, linkedin, twitter, instagram)
              social.value = data.social[platform];
            }
          }
        });
      }
      
      setContactFields(fields);
      setSocialLinks(socials);
    } else {
      // If no data, set default fields
      setContactFields([
        { id: 1, type: 'email', label: 'Email', value: '', icon: 'email', required: true, customIcon: null }
      ]);
    }
  }, [data]);

  // Function to refresh contact data from API
  const refreshContactData = async () => {
    try {
      console.log('🔄 Refreshing contact data from API...');
      const response = await fetch('/api/contact');
      if (response.ok) {
        const result = await response.json();
        console.log('📊 Fresh contact data:', result.contact);
        if (result.contact) {
          setContactData(result.contact);
          // Rebuild fields with fresh data
          const fields = buildContactFields(result.contact);
          setContactFields(fields);
          
          // Also update social links
          const socials = [...socialLinks];
          if (result.contact.social) {
            Object.keys(result.contact.social).forEach(platform => {
              const social = socials.find(s => s.platform === platform);
              if (social && typeof result.contact.social[platform] === 'string') {
                social.value = result.contact.social[platform];
              }
            });
          }
          setSocialLinks(socials);
          
          toast.success('Contact data refreshed successfully!');
        }
      } else {
        console.error('❌ Failed to refresh contact data:', response.status);
        toast.error('Failed to refresh contact data');
      }
    } catch (error) {
      console.error('Error refreshing contact data:', error);
      toast.error('Error refreshing contact data');
    }
  };

  // Load draft data when editing (only if we don't have current data)
  useEffect(() => {
    if (isAdmin && editMode && !contactData) {
      loadDraftData();
    }
  }, [isAdmin, editMode, contactData]);

  const loadDraftData = async () => {
    try {
      const response = await fetch('/api/contact?includeDraft=true', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (response.ok) {
        const result = await response.json();
        if (result.draft) {
          // Load draft data into form
          const draftData = result.draft.draftData || result.draft;
          const fields = buildContactFields(draftData);
          const socials = [...socialLinks];
          
          if (draftData.social) {
            Object.keys(draftData.social).forEach(platform => {
              const social = socials.find(s => s.platform === platform);
              if (social) {
                if (typeof draftData.social[platform] === 'string') {
                  // Main social platforms
                  social.value = draftData.social[platform];
                }
              }
            });
          }
          
          setContactFields(fields);
          setSocialLinks(socials);
          setIsDraft(true);
        }
      }
    } catch (error) {
      console.error('Error loading draft data:', error);
    }
  };

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, [prefersReducedMotion]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFieldChange = (id, value) => {
    setContactFields(prev => 
      prev.map(field => 
        field.id === id ? { ...field, value } : field
      )
    );
  };

  const addField = (type) => {
    const newField = {
      id: Math.max(...contactFields.map(f => f.id), 0) + 1,
      type,
      label: type === 'phone' ? 'Phone' : 
              type === 'location' ? 'Location' : 'Custom Field',
      value: '',
      icon: type === 'phone' ? 'phone' : 
            type === 'location' ? 'location' : 'portfolio',
      required: false,
      customIcon: null
    };
    
    setContactFields(prev => [...prev, newField]);
  };

  const removeField = (id) => {
    setContactFields(prev => prev.filter(field => field.id !== id));
  };

  const handleSocialChange = (id, value) => {
    setSocialLinks(prev => 
      prev.map(social => 
        social.id === id ? { ...social, value } : social
      )
    );
  };

  const addCustomField = () => {
    const newField = {
      id: Date.now(),
      type: 'text',
      label: 'Custom Field',
      value: '',
      icon: 'portfolio',
      required: false,
      customIcon: null
    };
    console.log('➕ Adding custom field:', newField);
    setContactFields(prev => {
      const updated = [...prev, newField];
      console.log('📝 Updated contact fields:', updated);
      return updated;
    });
    toast.success('Custom field added! Fill in the details and save.');
  };

  const moveField = (id, direction) => {
    setContactFields(prev => {
      const index = prev.findIndex(field => field.id === id);
      if (index === -1) return prev;
      
      const newFields = [...prev];
      if (direction === 'up' && index > 0) {
        [newFields[index], newFields[index - 1]] = [newFields[index - 1], newFields[index]];
      } else if (direction === 'down' && index < newFields.length - 1) {
        [newFields[index], newFields[index + 1]] = [newFields[index + 1], newFields[index]];
      }
      return newFields;
    });
  };

  const handleIconUpload = async (fieldId, file) => {
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
        
        // Update the field with the custom icon
        setContactFields(prev => 
          prev.map(field => 
            field.id === fieldId 
              ? { ...field, customIcon: result.url, icon: null }
              : field
          )
        );
        
        toast.success('Icon uploaded successfully!');
      } else {
        toast.error('Failed to upload icon');
      }
    } catch (error) {
      console.error('Error uploading icon:', error);
      toast.error('An error occurred while uploading the icon');
    } finally {
      setIsUploading(false);
    }
  };

  const removeCustomIcon = (fieldId) => {
    setContactFields(prev => 
      prev.map(field => 
        field.id === fieldId 
          ? { ...field, customIcon: null, icon: 'portfolio' }
          : field
      )
    );
  };

  const resetToPublished = () => {
    if (contactData) {
      const fields = [...contactFields];
      const socials = [...socialLinks];
      
      // Only set values for fields that exist in the current data
      if (contactData.email) {
        const emailField = fields.find(f => f.type === 'email');
        if (emailField) emailField.value = contactData.email;
      }
      if (contactData.phone) {
        const phoneField = fields.find(f => f.type === 'phone');
        if (phoneField) phoneField.value = contactData.phone;
      }
      if (contactData.address) {
        const locationField = fields.find(f => f.type === 'location');
        if (locationField) locationField.value = contactData.address;
      }
      
      // Reset icons to defaults
      fields.forEach(field => {
        if (field.type === 'email') field.icon = 'email';
        else if (field.type === 'phone') field.icon = 'phone';
        else if (field.type === 'location') field.icon = 'location';
        else field.icon = 'portfolio';
        field.customIcon = null;
      });
      
      // Reset social icons to defaults
      socials.forEach(social => {
        if (social.platform === 'github') social.icon = 'github';
        else if (social.platform === 'linkedin') social.icon = 'linkedin';
        else if (social.platform === 'twitter') social.icon = 'twitter';
        else if (social.platform === 'instagram') social.icon = 'instagram';
        else social.icon = 'web';
        social.customIcon = null;
      });
      
      if (contactData.social) {
        Object.keys(contactData.social).forEach(platform => {
          const social = socials.find(s => s.platform === platform);
          if (social) {
            if (typeof contactData.social[platform] === 'string') {
              // Main social platforms
              social.value = contactData.social[platform];
            }
          }
        });
      }
      
      setContactFields(fields);
      setSocialLinks(socials);
      setIsDraft(false);
      toast.success('Form reset to published data');
    }
  };

  const addSocialPlatform = () => {
    const newSocial = {
      id: Date.now(),
      platform: 'custom',
      label: 'Custom Platform',
      value: '',
      icon: 'web',
      customIcon: null
    };
    setSocialLinks(prev => [...prev, newSocial]);
  };

  const removeSocial = (id) => {
    setSocialLinks(prev => prev.filter(social => social.id !== id));
  };

  const handleSocialIconUpload = async (socialId, file) => {
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
        
        // Update the social with the custom icon
        setSocialLinks(prev => 
          prev.map(social => 
            social.id === socialId 
              ? { ...social, customIcon: result.url, icon: null }
              : social
          )
        );
        
        toast.success('Icon uploaded successfully!');
      } else {
        toast.error('Failed to upload icon');
      }
    } catch (error) {
      console.error('Error uploading icon:', error);
      toast.error('An error occurred while uploading the icon');
    } finally {
      setIsUploading(false);
    }
  };

  const removeSocialCustomIcon = (socialId) => {
    setSocialLinks(prev => 
      prev.map(social => 
        social.id === socialId 
          ? { ...social, customIcon: null, icon: 'web' }
          : social
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically send the form data to your backend
      // For now, we'll just simulate a submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      setFormData({ name: '', email: '', message: '' });
      toast.success('Message sent successfully! (This is a demo)');
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveContactInfo = async (publish = false) => {
    try {
      // Convert form data to API format
      const apiData = {};
      
      // Map contact fields to API format
      const customFields = [];
      
      contactFields.forEach(field => {
        if (field.value.trim()) {
          // Handle standard fields
          if (['email', 'phone', 'location'].includes(field.type)) {
            let dbFieldName = field.type;
            if (field.type === 'location') {
              dbFieldName = 'address';
            }
            apiData[dbFieldName] = field.value.trim();
          } else {
            // Handle custom fields
            customFields.push({
              type: field.type,
              label: field.label,
              value: field.value.trim(),
              icon: field.icon,
              customIcon: field.customIcon
            });
          }
        }
      });
      
      // Add custom fields to API data if any exist
      if (customFields.length > 0) {
        apiData.customFields = customFields;
        console.log('📦 Custom fields being saved:', customFields);
      }
      
      // Add social links (only the main ones for now)
      const socialData = {};
      socialLinks.forEach(social => {
        if (social.value.trim() && ['github', 'linkedin', 'twitter', 'instagram'].includes(social.platform)) {
          socialData[social.platform] = social.value.trim();
        }
      });
      if (Object.keys(socialData).length > 0) {
        apiData.social = socialData;
      }
      
      // Add draft status
      apiData.isDraft = !publish;
      apiData.isActive = publish;
      
      console.log('Sending contact data:', apiData); // Debug log
      
      const response = await fetch('/api/contact', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(apiData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Contact API response:', result); // Debug log
        
        // Update the contact data state
        setContactData(result.contact);
        setIsDraft(!publish);
        
        // Force a refresh of the component by updating the fields
        if (result.contact) {
          try {
            const fields = buildContactFields(result.contact);
            const socials = [...socialLinks];
            
            // Update social links
            if (result.contact.social) {
              Object.keys(result.contact.social).forEach(platform => {
                const social = socials.find(s => s.platform === platform);
                if (social && typeof result.contact.social[platform] === 'string') {
                  social.value = result.contact.social[platform];
                }
              });
            }
            
            setContactFields(fields);
            setSocialLinks(socials);
            
            // Also update the main contact data to trigger re-render
            setContactData(result.contact);
          } catch (refreshError) {
            console.error('Error updating form fields:', refreshError);
            // Don't fail the whole operation if refresh fails
          }
        }
        
        if (publish) {
          toast.success('Contact information published successfully!');
        } else {
          toast.success('Contact information saved as draft!');
        }
        
        setIsModalOpen(false);
      } else {
        const errorData = await response.json();
        console.error('Contact API error:', errorData); // Debug log
        toast.error(errorData.error || 'Failed to update contact information');
      }
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error('An error occurred while updating contact information');
    }
  };

  const handleEdit = () => {
    setIsModalOpen(true);
  };

  // SVG Icon components
  const getSvgIcon = (iconName, size = 20) => {
    const iconProps = { width: size, height: size, fill: 'currentColor' };
    
    switch (iconName) {
      case 'email':
        return (
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
        );
      case 'phone':
        return (
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
          </svg>
        );
      case 'location':
        return (
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        );

      case 'github':
        return (
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        );
      case 'linkedin':
        return (
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        );
      case 'twitter':
        return (
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.665 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.058 1.644-.07 4.849-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'portfolio':
        return (
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z"/>
          </svg>
        );
      case 'resume':
        return (
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zM16 18H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
          </svg>
        );
      case 'blog':
        return (
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
          </svg>
        );
      case 'calendar':
        return (
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
          </svg>
        );
      case 'code':
        return (
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
          </svg>
        );
      case 'web':
        return (
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
          </svg>
        );
      case 'mobile':
        return (
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z"/>
          </svg>
        );
      case 'download':
        return (
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
          </svg>
        );
      case 'star':
        return (
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        );
      case 'heart':
        return (
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        );
      case 'target':
        return (
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        );
      case 'lightbulb':
        return (
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M12 2A7 7 0 0 0 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zM9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1z"/>
          </svg>
        );
      case 'rocket':
        return (
          <svg viewBox="0 0 24 24" {...iconProps}>
            <path d="M13.13 22.19l-1.63.96c-.4.24-.89.24-1.29 0l-1.63-.96c-.4-.24-.64-.67-.64-1.12V3.93c0-.45.24-.88.64-1.12l1.63-.96c.4-.24.89-.24 1.29 0l1.63.96c.4.24.64.67.64 1.12v17.14c0 .45-.24.88-.64 1.12z"/>
          </svg>
        );
      default:
        return <span style={{ fontSize: size }}>📝</span>;
    }
  };

  const getIconLabel = (iconName) => {
    const labels = {
      email: 'Email',
      phone: 'Phone',
      location: 'Location',
      clock: 'Clock',
      status: 'Status',
      portfolio: 'Portfolio',
      resume: 'Resume',
      blog: 'Blog',
      calendar: 'Calendar',
      code: 'Code',
      web: 'Web',
      mobile: 'Mobile',
      download: 'Download',
      star: 'Star',
      heart: 'Heart',
      target: 'Target',
      lightbulb: 'Lightbulb',
      rocket: 'Rocket'
    };
    return labels[iconName] || iconName;
  };

  // Extract contact information for display - build from actual data
  const displayFields = contactData ? buildContactFields(contactData).filter(field => field.value.trim()) : [];
  const displaySocials = socialLinks.filter(social => social.value.trim());
  
  // Debug logging
  console.log('🔍 Contact Debug:', {
    contactData: contactData,
    displayFields: displayFields,
    displayFieldsCount: displayFields.length,
    hasAddress: !!contactData?.address,
    addressValue: contactData?.address
  });

  return (
    <>
      <StyledContactSection id="contact" ref={revealContainer}>
        <p className="overline">What&apos;s Next?</p>
                        <h2 className="title">{formatTextWithBackticks(contactData?.title || 'Get In Touch')}</h2>
                  <p className="description">
            {formatTextWithBackticks(contactData?.description || '')}
          </p>

        {isAdmin && editMode && (
          <div className="admin-controls">
            <button className="edit-button" onClick={handleEdit}>
              Edit Contact Information
            </button>
            <button className="edit-button" onClick={refreshContactData} style={{ background: 'var(--light-slate)', color: 'var(--navy)' }}>
              🔄 Refresh Data
            </button>
            <button className="edit-button" onClick={() => {
              console.log('🔍 Current Contact Data:', contactData);
              console.log('🔍 Display Fields:', displayFields);
              console.log('🔍 Contact Fields:', contactFields);
              console.log('🔍 Custom Fields in DB:', contactData?.customFields);
            }} style={{ background: 'var(--light-navy)', color: 'var(--lightest-slate)' }}>
              🐛 Debug Data
            </button>
            {isDraft && (
              <button className="edit-button publish" onClick={() => saveContactInfo(true)}>
                Publish Changes
              </button>
            )}
          </div>
        )}

        <div className="contact-container">
          <div className="contact-info">
            <h3>Contact Me</h3>
            
            {displayFields.map((field) => (
              <div key={field.id} className="info-item">
                <span className="icon">
                  {field.customIcon ? (
                    <img 
                      src={field.customIcon} 
                      alt={field.label}
                      style={{ width: '20px', height: '20px', objectFit: 'contain' }}
                    />
                  ) : (
                    getSvgIcon(field.icon)
                  )}
                </span>
                {field.type === 'email' ? (
                  <a href={`mailto:${field.value}`}>{field.value}</a>
                ) : field.type === 'phone' ? (
                  <a href={`tel:${field.value}`}>{field.value}</a>
                ) : (
                  <span>{field.value}</span>
                )}
              </div>
            ))}

            {displaySocials.length > 0 && (
              <div className="social-links">
                <h4>Check my profiles</h4>
                <div className="social-icons">
                  {displaySocials.map((social) => (
                    <a 
                      key={social.id}
                      href={social.value} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      aria-label={social.label}
                    >
                      {social.customIcon ? (
                        <img 
                          src={social.customIcon} 
                          alt="Custom Social Icon" 
                          style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                        />
                      ) : social.icon ? (
                        getSvgIcon(social.icon)
                      ) : (
                        '🔗'
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="contact-form">
            <h3>Get In Touch</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your full name..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Your email address..."
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="Your message..."
                  required
                />
              </div>

              <button 
                type="submit" 
                className="submit-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
                {!isSubmitting && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                  </svg>
                )}
              </button>
            </form>
          </div>
        </div>
      </StyledContactSection>

      {isModalOpen && (
        <StyledModal onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div className="modal-content">
            <h3>Edit Contact Information</h3>
            
            <div className="form-tabs">
              <button 
                className={`tab ${activeTab === 'basic' ? 'active' : ''}`}
                onClick={() => setActiveTab('basic')}
              >
                Basic Info
              </button>
              <button 
                className={`tab ${activeTab === 'social' ? 'active' : ''}`}
                onClick={() => setActiveTab('social')}
              >
                Social Links
              </button>
              <button 
                className={`tab ${activeTab === 'preview' ? 'active' : ''}`}
                onClick={() => setActiveTab('preview')}
              >
                Preview
              </button>
            </div>

            {activeTab === 'basic' && (
              <div>
                <h4>Contact Fields</h4>
                
                {/* Field Addition Controls */}
                <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
                  <h5 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Add New Fields</h5>
                  <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666' }}>
                    💡 <strong>Tip:</strong> Add custom fields for additional contact info like Portfolio URL, Resume, Blog, etc.
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {!contactFields.find(f => f.type === 'phone') && (
                      <button
                        type="button"
                        onClick={() => addField('phone')}
                        style={{
                          background: 'var(--green)',
                          color: 'var(--navy)',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        + Phone
                      </button>
                    )}
                    {!contactFields.find(f => f.type === 'location') && (
                      <button
                        type="button"
                        onClick={() => addField('location')}
                        style={{
                          background: 'var(--green)',
                          color: 'var(--navy)',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        + Location
                      </button>
                    )}

                  </div>
                </div>
                
                {contactFields.map((field) => (
                  <div key={field.id} className="form-group">
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '5px' }}>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => {
                          setContactFields(prev => 
                            prev.map(f => 
                              f.id === field.id ? { ...f, label: e.target.value } : f
                            )
                          );
                        }}
                        placeholder="Field Label"
                        style={{ flex: 1, fontSize: 'var(--fz-sm)' }}
                      />
                      {field.customIcon ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <img 
                            src={field.customIcon} 
                            alt="Custom Icon" 
                            style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                          />
                          <button
                            type="button"
                            onClick={() => removeCustomIcon(field.id)}
                            style={{ 
                              background: '#ff6b6b', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '3px', 
                              padding: '2px 6px', 
                              fontSize: '10px',
                              cursor: 'pointer'
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <select
                          value={field.icon}
                          onChange={(e) => {
                            setContactFields(prev => 
                              prev.map(f => 
                                f.id === field.id ? { ...f, icon: e.target.value } : f
                              )
                            );
                          }}
                          style={{ width: '120px' }}
                        >
                          <option value="email">📧 Email</option>
                          <option value="phone">📞 Phone</option>
                          <option value="location">📍 Location</option>

                          <option value="portfolio">📁 Portfolio</option>
                          <option value="resume">📄 Resume</option>
                          <option value="blog">✍️ Blog</option>
                          <option value="calendar">📅 Calendar</option>
                          <option value="code">💻 Code</option>
                          <option value="web">🌐 Web</option>
                          <option value="mobile">📱 Mobile</option>
                          <option value="download">⬇️ Download</option>
                          <option value="star">⭐ Star</option>
                          <option value="heart">❤️ Heart</option>
                          <option value="target">🎯 Target</option>
                          <option value="lightbulb">💡 Lightbulb</option>
                          <option value="rocket">🚀 Rocket</option>
                        </select>
                      )}
                    </div>
                    <input
                      type="text"
                      value={field.value}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                    <div className="field-controls">
                      <button 
                        type="button" 
                        className="move-up"
                        onClick={() => moveField(field.id, 'up')}
                        disabled={contactFields.indexOf(field) === 0}
                      >
                        ↑
                      </button>
                      <button 
                        type="button" 
                        className="move-down"
                        onClick={() => moveField(field.id, 'down')}
                        disabled={contactFields.indexOf(field) === contactFields.length - 1}
                      >
                        ↓
                      </button>
                      {!field.required && (
                        <button 
                          type="button" 
                          className="remove-field"
                          onClick={() => removeField(field.id)}
                        >
                          Remove
                        </button>
                      )}
                      <label 
                        htmlFor={`icon-upload-${field.id}`}
                        style={{ 
                          background: 'var(--green)', 
                          color: 'var(--navy)', 
                          padding: '4px 8px', 
                          borderRadius: '3px', 
                          fontSize: '10px',
                          cursor: 'pointer',
                          display: 'inline-block'
                        }}
                      >
                        {isUploading ? 'Uploading...' : 'Upload Icon'}
                      </label>
                      <input
                        id={`icon-upload-${field.id}`}
                        type="file"
                        accept="image/*,.svg"
                        onChange={(e) => handleIconUpload(field.id, e.target.files[0])}
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>
                ))}
                
                <button 
                  type="button" 
                  className="add-field"
                  onClick={addCustomField}
                  style={{
                    background: 'var(--green)',
                    color: 'var(--navy)',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginTop: '20px',
                    width: '100%'
                  }}
                >
                  ➕ Add Custom Field
                </button>
              </div>
            )}

            {activeTab === 'social' && (
              <div>
                <h4>Social Media Links</h4>
                {socialLinks.map((social) => (
                  <div key={social.id} className="form-group">
                    <label>{social.label}</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <input
                        type="url"
                        value={social.value}
                        onChange={(e) => handleSocialChange(social.id, e.target.value)}
                        placeholder={`Enter ${social.label} URL`}
                      />
                      <span style={{ fontSize: '20px' }}>{social.icon}</span>
                      {social.customIcon ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <img 
                            src={social.customIcon} 
                            alt="Custom Social Icon" 
                            style={{ width: '24px', height: '24px', objectFit: 'contain' }}
                          />
                          <button
                            type="button"
                            onClick={() => removeSocialCustomIcon(social.id)}
                            style={{ 
                              background: '#ff6b6b', 
                              color: 'white', 
                              border: 'none', 
                              borderRadius: '3px', 
                              padding: '2px 6px', 
                              fontSize: '10px',
                              cursor: 'pointer'
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ) : (
                        <label 
                          htmlFor={`social-icon-upload-${social.id}`}
                          style={{ 
                            background: 'var(--green)', 
                            color: 'var(--navy)', 
                            padding: '4px 8px', 
                            borderRadius: '3px', 
                            fontSize: '10px',
                            cursor: 'pointer',
                            display: 'inline-block'
                          }}
                        >
                          {isUploading ? 'Uploading...' : 'Upload Icon'}
                        </label>
                      )}
                      <input
                        id={`social-icon-upload-${social.id}`}
                        type="file"
                        accept="image/*,.svg"
                        onChange={(e) => handleSocialIconUpload(social.id, e.target.files[0])}
                        style={{ display: 'none' }}
                      />
                    </div>
                    <button 
                      type="button" 
                      className="remove-field"
                      onClick={() => removeSocial(social.id)}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <button 
                  type="button" 
                  className="add-field"
                  onClick={addSocialPlatform}
                >
                  + Add Social Platform
                </button>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="preview-section">
                <h4>Preview</h4>
                {displayFields.map((field) => (
                  <div key={field.id} className="preview-item">
                    <span className="icon">{field.icon}</span>
                    <span>{field.label}: {field.value}</span>
                  </div>
                ))}
                {displaySocials.length > 0 && (
                  <>
                    <h4 style={{ marginTop: '20px' }}>Social Links</h4>
                    {displaySocials.map((social) => (
                      <div key={social.id} className="preview-item">
                        <span className="icon">{social.icon}</span>
                        <span>{social.label}: {social.value}</span>
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}

            <div className="form-actions">
              <button type="button" className="cancel" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button 
                type="button" 
                className="save-draft" 
                onClick={resetToPublished}
                style={{ background: 'var(--light-navy)', color: 'var(--lightest-slate)' }}
              >
                Reset to Published
              </button>
              <button 
                type="button" 
                className="save-draft" 
                onClick={() => saveContactInfo(false)}
              >
                Save as Draft
              </button>
              <button 
                type="button" 
                className="publish" 
                onClick={() => saveContactInfo(true)}
              >
                Publish
              </button>
            </div>
          </div>
        </StyledModal>
      )}
    </>
  );
};

Contact.propTypes = {
  data: PropTypes.object,
};

export default Contact;
