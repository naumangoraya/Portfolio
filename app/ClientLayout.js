'use client';

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from 'styled-components';
import { AuthProvider } from '../src/contexts/AuthContext';
import AdminControls from '../src/components/AdminControls';
// Dynamically import GlobalStyle and theme to avoid server-side issues
// This ensures they are only loaded on the client
// This was the final fix for the createContext error
export default function ClientLayout({ children }) {
  const [theme, setTheme] = useState(null);
  const [GlobalStyle, setGlobalStyle] = useState(null);

  useEffect(() => {
    const loadStyledComponents = async () => {
      const { theme: importedTheme, GlobalStyle: importedGlobalStyle } = await import('../src/styles');
      setTheme(importedTheme);
      setGlobalStyle(importedGlobalStyle);
    };
    loadStyledComponents();
  }, []);

  if (!theme || !GlobalStyle) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AuthProvider>
        <AdminControls />
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
