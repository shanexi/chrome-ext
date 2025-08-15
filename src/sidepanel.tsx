import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const SidePanel: React.FC = () => {
  return (
    <div className="p-6 h-full bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">ShellAgent</h1>
      <p className="text-gray-600">侧边栏面板已打开</p>
    </div>
  );
};

const container = document.getElementById('sidepanel-root') as HTMLElement;
const root = createRoot(container);
root.render(<SidePanel />);