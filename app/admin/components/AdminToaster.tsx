'use client';

import { Toaster } from 'react-hot-toast';

export default function AdminToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 2600,
        style: {
          background: '#FFF7F9',
          color: '#3A1F2E',
          border: '1px solid #EAD9C8',
          borderRadius: '999px',
          padding: '10px 16px',
          fontSize: '14px',
          fontWeight: 600,
          boxShadow: '0 12px 32px -12px rgba(179,68,108,0.35)',
        },
        success: { iconTheme: { primary: '#E8457A', secondary: '#fff' } },
        error: { iconTheme: { primary: '#B3446C', secondary: '#fff' } },
      }}
    />
  );
}
