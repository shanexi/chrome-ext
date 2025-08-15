import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './popup.css';

const Popup = () => {
  const [status, setStatus] = useState({ message: '', type: '' });

  const showStatus = (message, type = 'info') => {
    setStatus({ message, type });
    setTimeout(() => {
      setStatus({ message: '', type: '' });
    }, 3000);
  };

  const executeScript = (func, args = []) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        function: func,
        args: args
      }, function(results) {
        if (chrome.runtime.lastError) {
          showStatus('执行失败: ' + chrome.runtime.lastError.message, 'error');
        } else if (results && results[0] && results[0].result) {
          showStatus(results[0].result, 'success');
        }
      });
    });
  };

  const handleHighlight = () => {
    executeScript(function() {
      const textNodes = [];
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      
      let node;
      while (node = walker.nextNode()) {
        if (node.textContent.trim().length > 0) {
          textNodes.push(node);
        }
      }
      
      textNodes.forEach(node => {
        if (node.parentElement.tagName !== 'SCRIPT' && node.parentElement.tagName !== 'STYLE') {
          const span = document.createElement('span');
          span.style.backgroundColor = 'yellow';
          span.style.padding = '2px';
          span.textContent = node.textContent;
          node.parentElement.replaceChild(span, node);
        }
      });
      
      return `已高亮 ${textNodes.length} 个文本节点`;
    });
  };

  const handleCount = () => {
    executeScript(function() {
      const elements = {
        '段落 (p)': document.querySelectorAll('p').length,
        '标题 (h1-h6)': document.querySelectorAll('h1,h2,h3,h4,h5,h6').length,
        '链接 (a)': document.querySelectorAll('a').length,
        '图片 (img)': document.querySelectorAll('img').length,
        '按钮 (button)': document.querySelectorAll('button').length,
        '输入框 (input)': document.querySelectorAll('input').length
      };
      
      const total = Object.values(elements).reduce((sum, count) => sum + count, 0);
      const details = Object.entries(elements)
        .filter(([, count]) => count > 0)
        .map(([type, count]) => `${type}: ${count}`)
        .join(', ');
      
      return `总计 ${total} 个元素 (${details})`;
    });
  };

  const handleChangeColor = () => {
    const colors = ['#ffebcd', '#e6f3ff', '#f0fff0', '#fff0f5', '#f5f5dc'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    executeScript(function(color) {
      document.body.style.backgroundColor = color;
      return `背景颜色已改为 ${color}`;
    }, [randomColor]);
  };

  const handleClear = () => {
    executeScript(function() {
      document.body.style.backgroundColor = '';
      
      const highlightedElements = document.querySelectorAll('span[style*="background-color: yellow"]');
      highlightedElements.forEach(span => {
        const textNode = document.createTextNode(span.textContent);
        span.parentElement.replaceChild(textNode, span);
      });
      
      return `已清除所有效果 (${highlightedElements.length} 个高亮)`;
    });
  };

  const handleOpenSidePanel = () => {
    chrome.windows.getCurrent(function(window) {
      chrome.sidePanel.open({ windowId: window.id }, function() {
        if (chrome.runtime.lastError) {
          showStatus('无法打开侧边栏: ' + chrome.runtime.lastError.message, 'error');
        } else {
          showStatus('侧边栏已打开', 'success');
          chrome.windows.update(window.id, { focused: true });
        }
      });
    });
  };

  return (
    <div className="popup-container">
      <div className="header">
        <h2>ShellAgent</h2>
        <p>一个简单的 Chrome 扩展示例</p>
      </div>
      
      <button onClick={handleHighlight} className="button">
        高亮当前页面文本
      </button>
      <button onClick={handleCount} className="button">
        统计页面元素
      </button>
      <button onClick={handleChangeColor} className="button">
        改变背景颜色
      </button>
      <button onClick={handleClear} className="button">
        清除所有效果
      </button>
      
      <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #eee' }} />
      
      <button onClick={handleOpenSidePanel} className="button side-panel-btn">
        🔧 打开侧边栏面板
      </button>

      <button onClick={() => window.close()} className="button close-btn">
        ✕ 关闭
      </button>
      
      {status.message && (
        <div className={`status ${status.type}`}>
          {status.message}
        </div>
      )}
    </div>
  );
};

const container = document.getElementById('popup-root');
const root = createRoot(container);
root.render(<Popup />);