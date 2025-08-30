'use client';

import { useState, useEffect, useCallback } from 'react';

export const useProjects = (initialData = []) => {
  const [projects, setProjects] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch projects from API
  const fetchProjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        // Extract projects array from the response object
        const projectsArray = data?.projects || data || [];
        setProjects(projectsArray);
      } else {
        throw new Error('Failed to fetch projects');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error fetching projects:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh data
  const refreshData = useCallback(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Initialize with data from props and fetch fresh data
  useEffect(() => {
    if (initialData && Array.isArray(initialData) && initialData.length > 0) {
      setProjects(initialData);
    }
    fetchProjects();
  }, [initialData, fetchProjects]);

  // Ensure projects is always an array before using filter
  const safeProjects = Array.isArray(projects) ? projects : [];

  // Get featured projects
  const featuredProjects = safeProjects.filter(project => project.featured);
  
  // Get regular projects
  const regularProjects = safeProjects.filter(project => !project.featured);

  return {
    projects: safeProjects,
    featuredProjects,
    regularProjects,
    isLoading,
    error,
    refreshData,
    setProjects
  };
};
