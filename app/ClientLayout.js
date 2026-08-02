'use client';

import React from 'react';
import { ThemeProvider } from 'styled-components';
import { Toaster } from 'react-hot-toast';
import { theme, GlobalStyle } from '../src/styles';
import { AuthProvider } from '../src/contexts/AuthContext';
import AdminControls from '../src/components/AdminControls';

// theme/GlobalStyle are imported statically so they are part of the server
// render. Loading them via `await import()` in an effect (as this file used to)
// meant the server emitted a bare "Loading..." div for every page, which
// silently disabled SSR, ISR, revalidatePath and the styled-components registry.
export default function ClientLayout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AuthProvider>
        <AdminControls />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--navy)',
              color: 'var(--lightest-slate)',
              border: '1px solid var(--green)',
            },
          }}
        />
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
