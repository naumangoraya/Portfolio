'use client';

import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledServicesSection = styled.section`
  max-width: 1200px;
  margin: 0 auto 100px;

  .services-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px;
    margin-top: 50px;

    @media (max-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
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
    padding: 20px;
    position: relative;
    transition: var(--transition);
    min-height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    &:hover {
      transform: translateY(-3px);
      border-color: var(--green);
      box-shadow: 0 8px 25px -8px var(--green);
    }

    .service-icon {
      width: 40px;
      height: 40px;
      margin-bottom: 15px;
      color: var(--green);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .service-title {
      color: var(--lightest-slate);
      font-size: var(--fz-lg);
      font-weight: 600;
      margin-bottom: 10px;
    }

    .service-description {
      color: var(--slate);
      font-size: var(--fz-xs);
      line-height: 1.5;
    }
  }
`;

const Services = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, []);

  const servicesData = [
    {
      title: 'Web Development',
      description: 'Full-stack development with React, Node.js, and database integration. Focused on performance and user experience.',
      icon: '🌐',
      animation: 'fade-left'
    },
    {
      title: 'AI & ML',
      description: 'Designing and training machine learning models using Python, scikit-learn, and TensorFlow for predictive and intelligent systems.',
      icon: '🤖',
      animation: 'fade-right'
    },
    {
      title: 'NLP',
      description: 'Natural Language Processing using transformers, embeddings, and TensorFlow for text classification, sentiment analysis, and more.',
      icon: '💬',
      animation: 'fade-up'
    },
    {
      title: 'Business Automation',
      description: 'Building efficient workflow automation using n8n, Make.com, and Zapier. Streamlining business processes and integrating various platforms for seamless operations.',
      icon: '⚙️',
      animation: 'fade-down'
    },
    {
      title: 'LLM Integration',
      description: 'Building intelligent systems by integrating Large Language Models like GPT with web apps and data pipelines (RAG, agents, APIs).',
      icon: '🧠',
      animation: 'zoom-in'
    }
  ];

  return (
    <StyledServicesSection id="services" ref={revealContainer}>
      <h2 className="numbered-heading">My Services</h2>

      <div className="services-grid">
        {servicesData.map((service, index) => (
          <div 
            key={index} 
            className="service-card"
            data-aos={service.animation}
            data-aos-delay={index * 100}
            data-aos-duration="800"
          >
            <div>
              <div className="service-icon">{service.icon}</div>
              <h3 className="service-title">{service.title}</h3>
            </div>
            <p className="service-description">{service.description}</p>
          </div>
        ))}
      </div>
    </StyledServicesSection>
  );
};

export default Services; 