import React from 'react';
import { createRoot } from 'react-dom/client';

const SidePanel = () => {
  return (
    <h1>ShellAgent</h1>
  );
};

const container = document.getElementById('sidepanel-root');
const root = createRoot(container);
root.render(<SidePanel />);