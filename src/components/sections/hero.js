'use client';

import React, { useState, useEffect } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { navDelay, loaderDelay } from '@utils';
import { usePrefersReducedMotion } from '@hooks';
import { formatTextWithBackticks } from '../../utils/textFormatting';

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
   /* margin-bottom: 50px; */
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

const Hero = ({ data }) => {
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

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

  const one = <h1>{title}</h1>;
  const two = <h2 className="big-heading">{name}</h2>;
  const three = <h3 className="big-heading">{formatTextWithBackticks(tagline)}</h3>;
  const four = (
    <>
      <p>{formatTextWithBackticks(description)}</p>
    </>
  );
  const five = (
    <a
      className="email-link"
      href={ctaLink}
      target={ctaLink.startsWith('mailto:') ? undefined : "_blank"}
      rel={ctaLink.startsWith('mailto:') ? undefined : "noreferrer"}>
      {ctaText}
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

export default Hero;
