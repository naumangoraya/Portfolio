'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';
import { useAuth } from '../../contexts/AuthContext';

const StyledAboutSection = styled.section`
  max-width: 900px;

  .inner {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-gap: 50px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;

const StyledText = styled.div`
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    grid-gap: 0 10px;
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }
`;

const StyledPic = styled.div`
  position: relative;
  max-width: 300px;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 70%;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: transparent;

    &:hover,
    &:focus {
      outline: 0;
      transform: translate(-4px, -4px);

      &:after {
        transform: translate(8px, 8px);
      }

      .img {
        filter: none;
      }
    }

    .img {
      position: relative;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
      border: 2px solid var(--green);
      top: 14px;
      left: 14px;
      z-index: -1;
    }
  }

  .image-upload {
    position: absolute;
    top: 10px;
    right: 10px;
    background: var(--green);
    color: var(--navy);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    z-index: 10;

    &:hover {
      background: var(--light-green);
    }
  }

  &:hover .image-upload {
    opacity: 1;
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
    z-index: 10;
    
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

const EditableAbout = ({ data, onUpdate }) => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const { isAdmin } = useAuth();
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, [prefersReducedMotion]);

  // Use dynamic data or fallback to defaults
  const title = data?.title || "About Me";
  const description = data?.description || "I'm a software engineer who specializes in building (and occasionally designing) exceptional digital experiences.";
  const longDescription = data?.longDescription || "Currently, I'm an engineer at Upstatement focused on building accessible, inclusive products and digital experiences for a variety of clients.";
  const skills = data?.skills?.map(skill => skill.name) || ['JavaScript (ES6+)', 'Python', 'React', 'Node.js', 'Machine Learning', 'Deep Learning', 'Data Science', 'Generative AI', 'RAGs', 'Automation'];
  const imageUrl = data?.image?.url || "/images/me.jpg";
  const imageAlt = data?.image?.alt || "Headshot";

  const startEditing = (field, currentValue) => {
    setEditingField(field);
    setEditValues({ [field]: currentValue });
  };

  const saveEdit = async (field) => {
    try {
      const response = await fetch('/api/about', {
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
        if (onUpdate) {
          onUpdate({ [field]: editValues[field] });
        }
        setEditingField(null);
        setEditValues({});
      }
    } catch (error) {
      console.error('Error updating about:', error);
    }
  };

  const cancelEdit = () => {
    setEditingField(null);
    setEditValues({});
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
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
        // Update the about section with new image
        await fetch('/api/about', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          },
          body: JSON.stringify({
            image: {
              url: result.url,
              alt: imageAlt
            }
          }),
        });

        if (onUpdate) {
          onUpdate({ image: { url: result.url, alt: imageAlt } });
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
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

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">{renderEditableText('title', title, title)}</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>{renderEditableText('description', description, description)}</p>
            {longDescription && <p>{renderEditableText('longDescription', longDescription, longDescription)}</p>}
          </div>

          <ul className="skills-list">
            {skills && skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <Image
              className="img"
              src={imageUrl}
              width={500}
              height={500}
              quality={95}
              alt={imageAlt}
            />
            {isAdmin && (
              <>
                <button
                  className="image-upload"
                  onClick={() => document.getElementById('image-upload').click()}
                  title="Upload new image"
                >
                  📷
                </button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </>
            )}
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default EditableAbout;
