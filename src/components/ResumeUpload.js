import React, { useState } from 'react';
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

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    await uploadResume(file);
  };

  const uploadResume = async (file) => {
    setIsUploading(true);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      // Get admin token from localStorage
      const adminToken = localStorage.getItem('adminToken');
      if (!adminToken) {
        toast.error('Admin session expired. Please login again.');
        return;
      }
      
      formData.append('adminToken', adminToken);

      const response = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Resume uploaded successfully!');
        setUploadSuccess(true);
        
        // Reset success state after 3 seconds
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        toast.error(result.error || 'Failed to upload resume');
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
      document.getElementById('resume-file-input').click();
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
        id="resume-file-input"
        type="file"
        accept=".pdf"
        onChange={handleFileSelect}
        className="file-input"
      />
    </StyledResumeUpload>
  );
};

export default ResumeUpload;
