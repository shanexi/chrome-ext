import React from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';

const Popup: React.FC = () => {
  const handleOpenSidePanel = (): void => {
    chrome.windows.getCurrent((window: chrome.windows.Window) => {
      chrome.sidePanel.open({ windowId: window.id }, () => {
        if (chrome.runtime.lastError) {
          console.error('无法打开侧边栏:', chrome.runtime.lastError.message);
        } else {
          chrome.windows.update(window.id!, { focused: true });
          window.close();
        }
      });
    });
  };

  return (
    <div className="popup-container">
      <div className="header">
        <h2>ShellAgent</h2>
      </div>
      
      <button onClick={handleOpenSidePanel} className="button side-panel-btn">
        🔧 打开侧边栏面板
      </button>
    </div>
  );
};

const container = document.getElementById('popup-root') as HTMLElement;
const root = createRoot(container);
root.render(<Popup />);