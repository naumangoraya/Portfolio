'use client';

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  padding: 20px;
`;

const DashboardTitle = styled.h2`
  color: #2c3e50;
  margin-bottom: 30px;
  font-size: 28px;
  font-weight: 600;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-left: 4px solid ${props => props.color || '#3498db'};
`;

const StatNumber = styled.div`
  font-size: 32px;
  font-weight: 700;
  color: ${props => props.color || '#3498db'};
  margin-bottom: 8px;
`;

const StatLabel = styled.div`
  color: #7f8c8d;
  font-size: 14px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RecentActivity = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ActivityTitle = styled.h3`
  color: #2c3e50;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 600;
`;

const ActivityItem = styled.div`
  padding: 16px 0;
  border-bottom: 1px solid #ecf0f1;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:last-child {
    border-bottom: none;
  }
`;

const ActivityText = styled.div`
  color: #2c3e50;
  font-size: 14px;
`;

const ActivityTime = styled.div`
  color: #7f8c8d;
  font-size: 12px;
`;

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    jobs: 0,
    services: 0,
    posts: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Fetch dashboard data
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch projects count
      const projectsResponse = await fetch('/api/projects');
      const projectsData = await projectsResponse.json();
      
      // Fetch other counts (you'll need to create these API routes)
      // For now, using mock data
      setStats({
        projects: projectsData.projects?.length || 0,
        jobs: 5, // Mock data
        services: 4, // Mock data
        posts: 3, // Mock data
      });

      // Mock recent activity
      setRecentActivity([
        { text: 'Updated Hero Section', time: '2 hours ago' },
        { text: 'Added new project: E-commerce App', time: '1 day ago' },
        { text: 'Updated contact information', time: '3 days ago' },
        { text: 'Published new blog post', time: '1 week ago' },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <DashboardContainer>
      <DashboardTitle>Dashboard Overview</DashboardTitle>
      
      <StatsGrid>
        <StatCard color="#3498db">
          <StatNumber color="#3498db">{stats.projects}</StatNumber>
          <StatLabel>Total Projects</StatLabel>
        </StatCard>
        
        <StatCard color="#e74c3c">
          <StatNumber color="#e74c3c">{stats.jobs}</StatNumber>
          <StatLabel>Work Experience</StatLabel>
        </StatCard>
        
        <StatCard color="#f39c12">
          <StatNumber color="#f39c12">{stats.services}</StatNumber>
          <StatLabel>Services Offered</StatLabel>
        </StatCard>
        
        <StatCard color="#27ae60">
          <StatNumber color="#27ae60">{stats.posts}</StatNumber>
          <StatLabel>Blog Posts</StatLabel>
        </StatCard>
      </StatsGrid>

      <RecentActivity>
        <ActivityTitle>Recent Activity</ActivityTitle>
        {recentActivity.map((activity, index) => (
          <ActivityItem key={index}>
            <ActivityText>{activity.text}</ActivityText>
            <ActivityTime>{activity.time}</ActivityTime>
          </ActivityItem>
        ))}
      </RecentActivity>
    </DashboardContainer>
  );
};

export default Dashboard;
