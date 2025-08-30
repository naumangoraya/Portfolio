'use client';

import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { srConfig, email, phone } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledContactSection = styled.section`
  max-width: 1000px;
  margin: 0 auto 100px;
  padding: 0 20px;

  @media (max-width: 768px) {
    margin: 0 auto 50px;
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

const Contact = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Here you would typically send the form data to your backend
    // For now, we'll just simulate a submission
    setTimeout(() => {
      alert('Thank you for your message! I&apos;ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <StyledContactSection id="contact" ref={revealContainer}>
      <h2 className="numbered-heading overline">What&apos;s Next?</h2>

      <h2 className="title">Get In Touch</h2>

      <div className="contact-container">
        <div className="contact-info">
          <h3>Contact Me</h3>
          
          <div className="info-item">
            <span className="icon">📍</span>
            <span>Lahore, Pakistan</span>
          </div>
          
          <div className="info-item">
            <span className="icon">📞</span>
            <a href={`tel:${phone}`}>{phone}</a>
          </div>
          
          <div className="info-item">
            <span className="icon">✉️</span>
            <a href={`mailto:${email}`}>{email}</a>
          </div>

          <div className="social-links">
            <h4>Check my profiles</h4>
            <div className="social-icons">
              <a href="https://github.com/nauman-noor-goraya" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/in/nauman-noor-goraya" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
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
  );
};

export default Contact;
