import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './sidepanel.css';

const SidePanel = () => {
  const [status, setStatus] = useState({ message: '', type: '', visible: false });
  const [pageInfo, setPageInfo] = useState('正在加载页面信息...');
  const [beautifyEnabled, setBeautifyEnabled] = useState(false);

  const showStatus = (message, type = 'info') => {
    setStatus({ message, type, visible: true });
    setTimeout(() => {
      setStatus(prev => ({ ...prev, visible: false }));
    }, 3000);
  };

  const getCurrentTab = (callback) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0]) {
        callback(tabs[0]);
      }
    });
  };

  const executeScript = (func, args = []) => {
    getCurrentTab(function(tab) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
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

  const updatePageInfo = () => {
    getCurrentTab(function(tab) {
      const url = new URL(tab.url);
      const domain = url.hostname;
      const protocol = url.protocol;
      
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: function() {
          return {
            title: document.title,
            elements: document.querySelectorAll('*').length,
            images: document.querySelectorAll('img').length,
            links: document.querySelectorAll('a').length,
            forms: document.querySelectorAll('form').length,
            scripts: document.querySelectorAll('script').length,
            paragraphs: document.querySelectorAll('p').length,
            loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart
          };
        }
      }, function(results) {
        if (results && results[0] && results[0].result) {
          const stats = results[0].result;
          setPageInfo(`
            标题: ${stats.title || 'N/A'}
            域名: ${domain}
            协议: ${protocol}
            总元素: ${stats.elements}
            图片: ${stats.images} | 链接: ${stats.links}
            表单: ${stats.forms} | 脚本: ${stats.scripts}
            段落: ${stats.paragraphs}
            ${stats.loadTime ? `加载时间: ${stats.loadTime}ms` : ''}
          `);
        } else {
          setPageInfo(`
            标题: ${tab.title}
            URL: ${domain}
            协议: ${protocol}
            无法获取详细页面信息
          `);
        }
      });
    });
  };

  const checkBeautifyStatus = () => {
    getCurrentTab(function(tab) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: function() {
          return !!document.getElementById('demo-extension-styles');
        }
      }, function(results) {
        if (results && results[0]) {
          setBeautifyEnabled(results[0].result);
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
      
      let count = 0;
      textNodes.forEach(node => {
        if (node.parentElement.tagName !== 'SCRIPT' && 
            node.parentElement.tagName !== 'STYLE' &&
            !node.parentElement.querySelector('span[data-extension-highlight]')) {
          const span = document.createElement('span');
          span.setAttribute('data-extension-highlight', 'true');
          span.style.backgroundColor = 'yellow';
          span.style.padding = '2px';
          span.textContent = node.textContent;
          node.parentElement.replaceChild(span, node);
          count++;
        }
      });
      
      return `已高亮 ${count} 个文本节点`;
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
        '输入框 (input)': document.querySelectorAll('input').length,
        '表格 (table)': document.querySelectorAll('table').length,
        '列表 (ul/ol)': document.querySelectorAll('ul,ol').length
      };
      
      const total = Object.values(elements).reduce((sum, count) => sum + count, 0);
      const details = Object.entries(elements)
        .filter(([, count]) => count > 0)
        .map(([type, count]) => `${type}: ${count}`)
        .join(', ');
      
      return `总计 ${total} 个主要元素\n${details}`;
    });
  };

  const handleChangeColor = () => {
    const colors = ['#ffebcd', '#e6f3ff', '#f0fff0', '#fff0f5', '#f5f5dc', '#ffe4e1', '#e0ffff'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    executeScript(function(color) {
      document.body.style.backgroundColor = color;
      return `背景颜色已改为 ${color}`;
    }, [randomColor]);
  };

  const handleClear = () => {
    executeScript(function() {
      document.body.style.backgroundColor = '';
      
      const highlightedElements = document.querySelectorAll('span[data-extension-highlight]');
      highlightedElements.forEach(span => {
        const textNode = document.createTextNode(span.textContent);
        span.parentElement.replaceChild(textNode, span);
      });
      
      const extensionStyles = document.querySelectorAll('#demo-extension-styles, #demo-extension-animations');
      extensionStyles.forEach(style => style.remove());
      
      return `已清除所有效果 (${highlightedElements.length + extensionStyles.length} 项)`;
    });
  };

  const handleBeautifyToggle = (checked) => {
    setBeautifyEnabled(checked);
    
    if (checked) {
      executeScript(function() {
        if (document.getElementById('demo-extension-styles')) {
          return '页面美化已经启用';
        }
        
        const style = document.createElement('style');
        style.id = 'demo-extension-styles';
        style.textContent = `
          * {
            transition: all 0.3s ease !important;
          }
          
          img {
            filter: brightness(1.1) contrast(1.05) !important;
            border-radius: 8px !important;
          }
          
          a {
            text-decoration: underline !important;
            color: #0066cc !important;
          }
          
          a:hover {
            background-color: rgba(0, 102, 204, 0.1) !important;
            padding: 2px 4px !important;
            border-radius: 4px !important;
          }
          
          button {
            background: linear-gradient(45deg, #4CAF50, #45a049) !important;
            color: white !important;
            border: none !important;
            border-radius: 6px !important;
            padding: 8px 16px !important;
            cursor: pointer !important;
          }
          
          button:hover {
            transform: translateY(-1px) !important;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2) !important;
          }
          
          input, textarea {
            border: 2px solid #e0e0e0 !important;
            border-radius: 6px !important;
            padding: 8px 12px !important;
          }
          
          input:focus, textarea:focus {
            border-color: #4CAF50 !important;
            outline: none !important;
            box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1) !important;
          }
        `;
        
        document.head.appendChild(style);
        return '页面美化已启用 ✨';
      });
    } else {
      executeScript(function() {
        const style = document.getElementById('demo-extension-styles');
        if (style) {
          style.remove();
          return '页面美化已关闭';
        }
        return '页面美化未启用';
      });
    }
  };

  useEffect(() => {
    updatePageInfo();
    checkBeautifyStatus();

    const handleTabActivated = () => {
      setTimeout(() => {
        updatePageInfo();
        checkBeautifyStatus();
      }, 100);
    };

    const handleTabUpdated = (tabId, changeInfo) => {
      if (changeInfo.status === 'complete') {
        setTimeout(() => {
          updatePageInfo();
          checkBeautifyStatus();
        }, 100);
      }
    };

    chrome.tabs.onActivated.addListener(handleTabActivated);
    chrome.tabs.onUpdated.addListener(handleTabUpdated);

    return () => {
      chrome.tabs.onActivated.removeListener(handleTabActivated);
      chrome.tabs.onUpdated.removeListener(handleTabUpdated);
    };
  }, []);

  const formatPageInfo = (info) => {
    return info.split('\n').map((line, index) => {
      const [label, value] = line.split(': ');
      return (
        <div key={index}>
          <strong>{label}:</strong> {value}
        </div>
      );
    });
  };

  return (
    <div className="sidepanel-container">
      <div className="header">
        <h1>ShellAgent</h1>
        <p>Side Panel Dashboard</p>
      </div>
      
      <div className="content">
        <div className="section">
          <div className="section-header">页面工具</div>
          <div className="section-body">
            <button className="tool-button" onClick={handleHighlight}>
              <div className="title">🎨 高亮文本</div>
              <div className="desc">高亮页面中的所有文本内容</div>
            </button>
            
            <button className="tool-button" onClick={handleCount}>
              <div className="title">📊 元素统计</div>
              <div className="desc">统计页面HTML元素数量</div>
            </button>
            
            <button className="tool-button" onClick={handleChangeColor}>
              <div className="title">🎨 背景颜色</div>
              <div className="desc">随机改变页面背景颜色</div>
            </button>
            
            <button className="tool-button" onClick={handleClear}>
              <div className="title">🧹 清除效果</div>
              <div className="desc">清除所有应用的页面效果</div>
            </button>
          </div>
        </div>
        
        <div className="section">
          <div className="section-header">
            页面美化
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={beautifyEnabled}
                onChange={(e) => handleBeautifyToggle(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="section-body">
            <div className="page-info">
              自动美化当前页面，包括按钮样式、链接效果和动画过渡。
            </div>
            <div className="shortcuts">
              快捷键: <span className="shortcut-key">Ctrl+Shift+D</span>
            </div>
          </div>
        </div>
        
        <div className="section">
          <div className="section-header">页面信息</div>
          <div className="section-body">
            <div className="page-info">
              {formatPageInfo(pageInfo)}
            </div>
          </div>
        </div>
        
        {status.visible && (
          <div className={`status-panel ${status.type}`}>
            <div>{status.message}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const container = document.getElementById('sidepanel-root');
const root = createRoot(container);
root.render(<SidePanel />);