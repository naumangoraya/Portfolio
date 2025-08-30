'use client';

import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { usePathname } from 'next/navigation';

const HeadComponent = ({ title = null, description = null, image = null }) => {
  const pathname = usePathname();
  
  const defaultTitle = 'Nauman Noor';
  const defaultDescription = 'Nauman Noor is a software engineer who specializes in building (and occasionally designing) exceptional digital experiences.';
  const siteUrl = 'https://naumannoor.com';
  const defaultImage = '/og.png';
  const twitterUsername = '@naumannoor';

  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}${pathname}`,
  };

  return (
    <Head>
      <title>{title ? `${title} | ${defaultTitle}` : defaultTitle}</title>
      <meta name="description" content={seo.description} />
      <meta name="image" content={seo.image} />

      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:type" content="website" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content={twitterUsername} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
    </Head>
  );
};

export default HeadComponent;

HeadComponent.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
};


