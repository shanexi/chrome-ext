import React from 'react';
import { createRoot } from 'react-dom/client';

const SidePanel: React.FC = () => {
  return (
    <h1>ShellAgent</h1>
  );
};

const container = document.getElementById('sidepanel-root') as HTMLElement;
const root = createRoot(container);
root.render(<SidePanel />);