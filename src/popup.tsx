import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const Popup: React.FC = () => {
  const handleOpenSidePanel = (): void => {
    chrome.windows.getCurrent((window: chrome.windows.Window) => {
      if (window.id) {
        chrome.sidePanel.open({ windowId: window.id }, () => {
          if (chrome.runtime.lastError) {
            console.error('无法打开侧边栏:', chrome.runtime.lastError.message);
          } else {
            chrome.windows.update(window.id!, { focused: true });
          }
        });
      }
    });
  };

  return (
    <div className="w-80 p-6 bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">ShellAgent</h2>
      </div>
      
      <button 
        onClick={handleOpenSidePanel} 
        className="w-full bg-Cr-Bg-normal-secondary-alt-v2 hover:bg-Cr-Bg-normal-tertiary-active-v2 text-Cr-Fg-subtle-v2 font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
      >
        🔧 打开侧边栏面板
      </button>
    </div>
  );
};

const container = document.getElementById('popup-root') as HTMLElement;
const root = createRoot(container);
root.render(<Popup />);