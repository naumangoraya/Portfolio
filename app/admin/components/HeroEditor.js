'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import toast from 'react-hot-toast';

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h2`
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
`;

const Form = styled.form`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 800px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  min-height: 100px;
  resize: vertical;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Button = styled.button`
  background: #3498db;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.3s ease;

  &:hover {
    background: #2980b9;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const PreviewSection = styled.div`
  margin-top: 40px;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 2px dashed #dee2e6;
`;

const PreviewTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
`;

const PreviewContent = styled.div`
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const HeroEditor = () => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    ctaText: '',
    ctaLink: '',
    image: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    try {
      const response = await fetch('/api/hero');
      if (response.ok) {
        const data = await response.json();
        setFormData(data.hero || {});
      }
    } catch (error) {
      console.error('Error fetching hero data:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Hero section updated successfully!');
      } else {
        toast.error('Failed to update hero section');
      }
    } catch (error) {
      console.error('Error updating hero:', error);
      toast.error('Failed to update hero section');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Title>Edit Hero Section</Title>
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">Main Title *</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="e.g., Hi, I'm Nauman Noor"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="subtitle">Subtitle *</Label>
          <Input
            id="subtitle"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleInputChange}
            placeholder="e.g., I build things for the web"
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="A brief description about yourself and what you do..."
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="ctaText">Call-to-Action Text</Label>
          <Input
            id="ctaText"
            name="ctaText"
            value={formData.ctaText}
            onChange={handleInputChange}
            placeholder="e.g., Get In Touch"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="ctaLink">Call-to-Action Link</Label>
          <Input
            id="ctaLink"
            name="ctaLink"
            value={formData.ctaLink}
            onChange={handleInputChange}
            placeholder="e.g., #contact or https://example.com"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="image">Hero Image URL</Label>
          <Input
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            placeholder="https://example.com/image.jpg"
          />
        </FormGroup>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Hero Section'}
        </Button>
      </Form>

      <PreviewSection>
        <PreviewTitle>Live Preview</PreviewTitle>
        <PreviewContent>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', color: '#2c3e50' }}>
            {formData.title || 'Your Title Here'}
          </h1>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#7f8c8d' }}>
            {formData.subtitle || 'Your Subtitle Here'}
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#555', marginBottom: '2rem' }}>
            {formData.description || 'Your description will appear here...'}
          </p>
          {formData.ctaText && (
            <button style={{
              background: '#3498db',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              fontSize: '16px',
              cursor: 'pointer'
            }}>
              {formData.ctaText}
            </button>
          )}
        </PreviewContent>
      </PreviewSection>
    </Container>
  );
};

export default HeroEditor;
