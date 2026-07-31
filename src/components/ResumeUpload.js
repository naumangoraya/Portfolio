'use client';

import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import toast from 'react-hot-toast';

const StyledResumeUpload = styled.div`
  position: relative;
  display: inline-block;

  .upload-button {
    background: transparent;
    color: var(--green);
    border: 1px solid var(--green);
    border-radius: 4px;
    padding: 8px 16px;
    font-size: var(--fz-sm);
    font-family: var(--font-mono);
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;

    &:hover {
      background: var(--green);
      color: var(--navy);
      transform: translateY(-1px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .file-input {
    display: none;
  }

  .uploading {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .success {
    background: var(--green);
    color: var(--navy);
  }
`;

const ResumeUpload = () => {
  const inputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file');
      return;
    }

    // Matches the server limit in lib/api/fileValidation.js
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    await uploadResume(file);

    // Without this, re-selecting the same file fires no change event.
    event.target.value = '';
  };

  const uploadResume = async (file) => {
    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        toast.error('Admin session expired. Please login again.');
        return;
      }

      const body = new FormData();
      body.append('resume', file);

      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        // Sent as a header like every other route, so the server can reject
        // before buffering the upload.
        headers: { Authorization: `Bearer ${adminToken}` },
        body,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Resume uploaded successfully!');
        setUploadSuccess(true);

        // Reset success state after 3 seconds
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        toast.error(result.error?.message || result.message || 'Failed to upload resume');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('An error occurred while uploading');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClick = () => {
    if (!isUploading) {
      inputRef.current?.click();
    }
  };

  return (
    <StyledResumeUpload>
      <button
        className={`upload-button ${isUploading ? 'uploading' : ''} ${uploadSuccess ? 'success' : ''}`}
        onClick={handleClick}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : uploadSuccess ? '✓ Uploaded' : 'Upload Resume'}
      </button>
      
      <input
        ref={inputRef}
        id="resume-file-input"
        type="file"
        accept="application/pdf"
        onChange={handleFileSelect}
        className="file-input"
      />
    </StyledResumeUpload>
  );
};

export default ResumeUpload;
