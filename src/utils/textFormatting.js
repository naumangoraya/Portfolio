import React from 'react';

// Function to format text with green backtick highlighting and clickable links
export const formatTextWithBackticks = (text) => {
  if (!text) return '';
  
  // Split text by backticks to identify sections
  const parts = text.split(/(`[^`]+`)/);
  
  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      // Extract content between backticks
      const content = part.slice(1, -1);
      
      // Check if it's a link format: `text: url` (handles space after colon)
      const linkMatch = content.match(/^([^:]+):\s*(https?:\/\/.+)$/);
      
      if (linkMatch) {
        const [, linkText, url] = linkMatch;
        return (
          <span key={index} style={{ color: 'var(--green)' }}>
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                color: 'var(--green)', 
                textDecoration: 'none',
                borderBottom: '1px solid transparent',
                transition: 'border-bottom 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderBottom = '1px solid var(--green)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderBottom = '1px solid transparent';
              }}
            >
              {linkText}
            </a>
          </span>
        );
      }
      
      // Regular backtick content (just green text)
      return (
        <span key={index} style={{ color: 'var(--green)' }}>
          {content}
        </span>
      );
    }
    
    // Regular text (return as is)
    return part;
  });
};

// Function to format text with just green backtick highlighting (no links)
export const formatTextWithGreenBackticks = (text) => {
  if (!text) return '';
  
  const parts = text.split(/(`[^`]+`)/);
  
  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      const content = part.slice(1, -1);
      return (
        <span key={index} style={{ color: 'var(--green)' }}>
          {content}
        </span>
      );
    }
    return part;
  });
};

// Function to check if text contains backticks
export const hasBackticks = (text) => {
  return text && text.includes('`');
};
