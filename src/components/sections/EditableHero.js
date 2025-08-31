'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';
import { useAuth } from '../../contexts/AuthContext';
import { formatTextWithBackticks } from '../../utils/textFormatting';
import toast from 'react-hot-toast';

const StyledHeroSection = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  padding: 0;
  position: relative;

  .admin-controls {
    position: absolute;
    top: 90px;
    right: 20px;
    z-index: 1000;
    padding: 10px;
    border-radius: 8px;

    .edit-button {
      background: var(--green);
      color: var(--navy);
      border: none;
      padding: 12px 20px;
      cursor: pointer;
      border-radius: 4px;
      font-weight: 600;
      font-size: var(--fz-sm);
      white-space: nowrap;
      min-width: 140px;

      &:hover {
        background: var(--light-green);
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(100, 255, 100, 0.2);
        color: white;
      }
    }
  }



  @media (max-height: 700px) and (min-width: 700px), (max-width: 360px) {
    height: auto;
    padding-top: var(--nav-height);
  }

  h1 {
    margin: 0 0 30px 4px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: clamp(var(--fz-sm), 5vw, var(--fz-md));
    font-weight: 400;

    @media (max-width: 480px) {
      margin: 0 0 20px 2px;
    }
  }

  h3 {
    margin-top: 5px;
    /* margin-bottom: 50px; */
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  .email-link {
    display: inline-block;
    text-decoration: none;
    text-decoration-skip-ink: auto;
    color: var(--green);
    position: relative;
    transition: var(--transition);
    cursor: pointer;
    padding: 0.75rem 1rem;
    border: 1px solid var(--green);
    border-radius: 4px;
    font-size: var(--fz-sm);
    font-family: var(--font-mono);
    line-height: 1;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.645, 0.045, 0.355, 1);
    margin-top: 50px;
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
      margin-bottom: 25px;

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
        transition: border-color 0.2s ease;

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

      small {
        display: block;
        margin-top: 8px;
        line-height: 1.4;
      }
    }

    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
      margin-top: 35px;
      padding-top: 25px;
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

  .preview-section {
    border-top: 1px solid var(--lightest-navy);
    padding-top: 25px;
    margin-top: 30px;

    h4 {
      color: var(--lightest-slate);
      font-size: var(--fz-md);
      margin-bottom: 20px;
    }

    .preview-content {
      background: var(--light-navy);
      padding: 20px;
      border-radius: 8px;
      border: 1px solid var(--lightest-navy);

      h1 {
        margin: 0 0 20px 4px;
        color: var(--green);
        font-family: var(--font-mono);
        font-size: var(--fz-sm);
        font-weight: 400;
      }

      h2 {
        margin: 0 0 10px 0;
        color: var(--lightest-slate);
        font-size: var(--fz-xxl);
        font-weight: 600;
      }

      h3 {
        margin: 0 0 20px 0;
        color: var(--slate);
        font-size: var(--fz-xl);
        font-weight: 400;
      }

      p {
        margin: 0 0 30px 0;
        color: var(--light-slate);
        font-size: var(--fz-lg);
        line-height: 1.6;
        max-width: 500px;
      }

      .cta-button {
        background: transparent;
        color: var(--green);
        border: 1px solid var(--green);
        border-radius: 4px;
        padding: 12px 24px;
        font-size: var(--fz-sm);
        font-family: var(--font-mono);
        cursor: default;
      }

      .preview-note {
        color: var(--slate);
        font-size: 12px;
        margin-top: 10px;
        font-style: italic;
        margin-bottom: 0;
      }
    }
  }
`;

const EditableHero = ({ data, onUpdate }) => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { isAdmin, editMode } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heroData, setHeroData] = useState(data);
  const [formData, setFormData] = useState({
    greeting: '',
    name: '',
    tagline: '',
    description: '',
    ctaText: '',
    email: '',
    isActive: true,
    order: 0
  });

  // Smooth scroll utility function
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ 
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  };

  useEffect(() => {
    console.log('EditableHero received data:', data);
    setHeroData(data);
    
    // Initialize form data with current values
    if (data) {
      const initialFormData = {
        greeting: data.title || "Hi, my name is",
        name: data.subtitle || "Nauman Noor.",
        tagline: data.description || "I build things for the web.",
        description: data.longDescription || "I'm a full stack developer specializing in building and exploring AI, ML, deep learning, data science, generative AI, and RAGs automation. Currently, I'm focused on building accessible, human-centered products and innovative AI solutions.",
        ctaText: data.ctaText || "Get In Touch",
        email: data.email || "naumanjaat@gmail.com",
        isActive: data.isActive !== false,
        order: data.order || 0
      };
      console.log('Initializing form data with:', initialFormData);
      setFormData(initialFormData);
    }
  }, [data]);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, [prefersReducedMotion]);

  // Use dynamic data or fallback to defaults
  const greeting = heroData?.title || "Hi, my name is";
  const name = heroData?.subtitle || "Nauman Noor.";
  const tagline = heroData?.description || "I build things for the web.";
  const description = heroData?.longDescription || "I'm a full stack developer specializing in building and exploring AI, ML, deep learning, data science, generative AI, and RAGs automation. Currently, I'm focused on building accessible, human-centered products and innovative AI solutions.";
  const ctaText = heroData?.ctaText || "Get In Touch";
  const email = heroData?.email || "naumanjaat@gmail.com";

  console.log('Current hero data state:', heroData);
  console.log('Mapped values:', { greeting, name, tagline, description, ctaText, email });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Submitting form data:', formData);
    
    try {
      const response = await fetch('/api/hero', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        const updatedHero = responseData.hero;
        console.log('Updated hero data:', updatedHero);
        setHeroData(updatedHero);
        if (onUpdate) {
          onUpdate(updatedHero);
        }
        toast.success('Hero section updated successfully!');
        setIsModalOpen(false);
      } else {
        console.error('API error:', responseData);
        toast.error(`Failed to update hero section: ${responseData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating hero section:', error);
      toast.error('An error occurred while updating the hero section');
    }
  };

  const handleEdit = () => {
    console.log('Current hero data for form:', heroData);
    
    // Use current displayed values as fallback if heroData is empty
    const currentValues = {
      greeting: heroData?.title || greeting,
      name: heroData?.subtitle || name,
      tagline: heroData?.description || tagline,
      description: heroData?.longDescription || description,
      ctaText: heroData?.ctaText || ctaText,
      email: heroData?.email || email,
      isActive: heroData?.isActive !== false,
      order: heroData?.order || 0
    };
    
    console.log('Setting form data to:', currentValues);
    setFormData(currentValues);
    setIsModalOpen(true);
  };

  const one = <h1>{greeting}</h1>;
  const two = <h2 className="big-heading">{name}</h2>;
  const three = <h3 className="big-heading">{formatTextWithBackticks(tagline)}</h3>;
  const four = (
    <p>{formatTextWithBackticks(description)}</p>
  );
  const five = (
    <a
      className="email-link"
      href="#contact"
      onClick={(e) => {
        e.preventDefault();
        scrollToContact();
      }}>
      {ctaText}
    </a>
  );

  const items = [one, two, three, four, five];

  return (
    <>
      <StyledHeroSection>
        {isAdmin && editMode && (
          <div className="admin-controls">
            <button className="edit-button" onClick={handleEdit}>
              Edit Hero Section
            </button>
          </div>
        )}



        {prefersReducedMotion ? (
          <>
            {items.map((item, i) => (
              <div key={i}>{item}</div>
            ))}
          </>
        ) : (
          <TransitionGroup component={null}>
            {isMounted &&
              items.map((item, i) => (
                <CSSTransition key={i} classNames="fadeup" timeout={loaderDelay}>
                  <div style={{ transitionDelay: `${i + 1}00ms` }}>{item}</div>
                </CSSTransition>
              ))}
          </TransitionGroup>
        )}
      </StyledHeroSection>

      {isModalOpen && (
        <StyledModal onClick={(e) => e.target === e.currentTarget && setIsModalOpen(false)}>
          <div className="modal-content">
            <h3>Edit Hero Section</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="greeting">Greeting</label>
                <input
                  type="text"
                  id="greeting"
                  name="greeting"
                  value={formData.greeting}
                  onChange={handleInputChange}
                  placeholder="Hi, my name is"
                />
                <small style={{ color: 'var(--slate)', fontSize: '12px', marginTop: '5px' }}>
                  The small text that appears above your name
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                />
                <small style={{ color: 'var(--slate)', fontSize: '12px', marginTop: '5px' }}>
                  Your full name (will appear in large text)
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="tagline">Tagline</label>
                <input
                  type="text"
                  id="tagline"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  placeholder="I build things for the web"
                />
                <small style={{ color: 'var(--slate)', fontSize: '12px', marginTop: '5px' }}>
                  A short, catchy description of what you do
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Detailed description about yourself..."
                  rows="4"
                />
                <small style={{ color: 'var(--slate)', fontSize: '12px', marginTop: '5px' }}>
                  A detailed paragraph about your expertise and focus areas
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="naumanjaat@gmail.com"
                />
                <small style={{ color: 'var(--slate)', fontSize: '12px', marginTop: '5px' }}>
                  Your email address (appears on the right sidebar)
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="ctaText">Call to Action Text</label>
                <input
                  type="text"
                  id="ctaText"
                  name="ctaText"
                  value={formData.ctaText}
                  onChange={handleInputChange}
                  placeholder="Get In Touch"
                />
                <small style={{ color: 'var(--slate)', fontSize: '12px', marginTop: '5px' }}>
                  The text on your main action button (will scroll to contact section)
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="order">Display Order</label>
                <input
                  type="number"
                  id="order"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  min="0"
                />
                <small style={{ color: 'var(--slate)', fontSize: '12px', marginTop: '5px' }}>
                  The order this hero section should appear (lower numbers first)
                </small>
              </div>

              {/* Preview Section */}
              <div className="preview-section">
                <h4>Preview:</h4>
                <div className="preview-content">
                  <h1>{formData.greeting || 'Hi, my name is'}</h1>
                  <h2 className="big-heading">{formData.name || 'Your Name'}</h2>
                  <h3 className="big-heading">{formatTextWithBackticks(formData.tagline || 'Your tagline')}</h3>
                  <p>{formatTextWithBackticks(formData.description || 'Your description will appear here...')}</p>
                  <button className="cta-button">{formData.ctaText || 'Get In Touch'}</button>
                  <p className="preview-note">This button will scroll to the contact section</p>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="cancel" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="save">
                  Update Hero Section
                </button>
              </div>
            </form>
          </div>
        </StyledModal>
      )}
    </>
  );
};

EditableHero.propTypes = {
  data: PropTypes.object,
  onUpdate: PropTypes.func
};

export default EditableHero;