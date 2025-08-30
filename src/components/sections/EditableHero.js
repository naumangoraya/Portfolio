'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';
import { useAuth } from '../../contexts/AuthContext';

const StyledHeroSection = styled.section`
  ${({ theme }) => theme.mixins.flexCenter};
  flex-direction: column;
  align-items: flex-start;
  min-height: 100vh;
  height: 100vh;
  padding: 0;

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
    color: var(--slate);
    line-height: 0.9;
  }

  p {
    margin: 20px 0 0;
    max-width: 540px;
  }

  .email-link {
    ${({ theme }) => theme.mixins.bigButton};
    margin-top: 50px;
  }
`;

const EditableText = styled.div`
  position: relative;
  display: inline-block;
  
  .edit-button {
    position: absolute;
    top: -20px;
    right: -20px;
    background: var(--green);
    color: var(--navy);
    border: none;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    font-size: 12px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background: var(--light-green);
    }
  }
  
  &:hover .edit-button {
    opacity: 1;
  }
  
  .editable-input {
    background: transparent;
    border: 1px solid var(--green);
    border-radius: 4px;
    padding: 4px 8px;
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    width: 100%;
    min-width: 200px;
    
    &:focus {
      outline: none;
      border-color: var(--light-green);
      background: var(--light-navy);
    }
  }
  
  .save-cancel {
    position: absolute;
    top: -30px;
    right: 0;
    display: flex;
    gap: 8px;
    
    button {
      background: var(--green);
      color: var(--navy);
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 12px;
      cursor: pointer;
      
      &.cancel {
        background: var(--light-slate);
      }
    }
  }
`;

const EditableHero = ({ data, onUpdate }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});
  const prefersReducedMotion = usePrefersReducedMotion();
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeout = setTimeout(() => setIsMounted(true), navDelay);
    return () => clearTimeout(timeout);
  }, []);

  // Use dynamic data or fallback to defaults
  const title = data?.title || "Hi, my name is";
  const name = data?.subtitle || "Nauman Noor.";
  const tagline = data?.description || "I build things for the web.";
  const description = data?.longDescription || "I'm a full stack developer specializing in building and exploring AI, ML, deep learning, data science, generative AI, and RAGs automation. Currently, I'm focused on building accessible, human-centered products and innovative AI solutions.";
  const ctaText = data?.ctaText || "Get In Touch";
  const ctaLink = data?.ctaLink || "mailto:nauman.noor@gmail.com";

  const startEditing = (field, currentValue) => {
    setEditingField(field);
    setEditValues({ [field]: currentValue });
  };

  const saveEdit = async (field) => {
    try {
      const response = await fetch('/api/hero', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
        body: JSON.stringify({
          [field]: editValues[field],
        }),
      });

      if (response.ok) {
        // Update local state
        if (onUpdate) {
          onUpdate({ [field]: editValues[field] });
        }
        setEditingField(null);
        setEditValues({});
      }
    } catch (error) {
      console.error('Error updating hero:', error);
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValues({});
  };

  const renderEditableText = (field, value, element) => {
    if (!isAdmin) {
      return element;
    }

    if (editingField === field) {
      return (
        <EditableText>
          <input
            type="text"
            className="editable-input"
            value={editValues[field] || ''}
            onChange={(e) => setEditValues({ [field]: e.target.value })}
            autoFocus
          />
          <div className="save-cancel">
            <button onClick={() => saveEdit(field)}>Save</button>
            <button className="cancel" onClick={cancelEdit}>Cancel</button>
          </div>
        </EditableText>
      );
    }

    return (
      <EditableText>
        {element}
        <button
          className="edit-button"
          onClick={() => startEditing(field, value)}
          title={`Edit ${field}`}
        >
          ✏️
        </button>
      </EditableText>
    );
  };

  const one = <h1>{renderEditableText('title', title, title)}</h1>;
  const two = <h2 className="big-heading">{renderEditableText('name', name, name)}</h2>;
  const three = <h3 className="big-heading">{renderEditableText('tagline', tagline, tagline)}</h3>;
  const four = (
    <>
      <p>{renderEditableText('description', description, description)}</p>
    </>
  );
  const five = (
    <a
      className="email-link"
      href={ctaLink}
      target={ctaLink.startsWith('mailto:') ? undefined : "_blank"}
      rel={ctaLink.startsWith('mailto:') ? undefined : "noreferrer"}>
      {renderEditableText('ctaText', ctaText, ctaText)}
    </a>
  );

  const items = [one, two, three, four, five];

  return (
    <StyledHeroSection>
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
  );
};

export default EditableHero;
