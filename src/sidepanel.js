document.addEventListener('DOMContentLoaded', function() {
  const highlightBtn = document.getElementById('highlightBtn');
  const countBtn = document.getElementById('countBtn');
  const colorBtn = document.getElementById('colorBtn');
  const clearBtn = document.getElementById('clearBtn');
  const beautifyToggle = document.getElementById('beautifyToggle');
  const statusPanel = document.getElementById('statusPanel');
  const statusMessage = document.getElementById('statusMessage');
  const pageInfo = document.getElementById('pageInfo');

  function showStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusPanel.className = `status-panel ${type}`;
    statusPanel.style.display = 'block';
    
    setTimeout(() => {
      statusPanel.style.display = 'none';
    }, 3000);
  }

  function getCurrentTab(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs[0]) {
        callback(tabs[0]);
      }
    });
  }

  function executeScript(func, args = []) {
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
  }

  function updatePageInfo() {
    getCurrentTab(function(tab) {
      const url = new URL(tab.url);
      const domain = url.hostname;
      const protocol = url.protocol;
      
      executeScript(function() {
        const stats = {
          title: document.title,
          elements: document.querySelectorAll('*').length,
          images: document.querySelectorAll('img').length,
          links: document.querySelectorAll('a').length,
          forms: document.querySelectorAll('form').length,
          scripts: document.querySelectorAll('script').length,
          paragraphs: document.querySelectorAll('p').length
        };
        return stats;
      }, []);
      
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
          pageInfo.innerHTML = `
            <strong>标题:</strong> ${stats.title || 'N/A'}<br>
            <strong>域名:</strong> ${domain}<br>
            <strong>协议:</strong> ${protocol}<br>
            <strong>总元素:</strong> ${stats.elements}<br>
            <strong>图片:</strong> ${stats.images} | <strong>链接:</strong> ${stats.links}<br>
            <strong>表单:</strong> ${stats.forms} | <strong>脚本:</strong> ${stats.scripts}<br>
            <strong>段落:</strong> ${stats.paragraphs}<br>
            ${stats.loadTime ? `<strong>加载时间:</strong> ${stats.loadTime}ms` : ''}
          `;
        } else {
          pageInfo.innerHTML = `
            <strong>标题:</strong> ${tab.title}<br>
            <strong>URL:</strong> ${domain}<br>
            <strong>协议:</strong> ${protocol}<br>
            <em>无法获取详细页面信息</em>
          `;
        }
      });
    });
  }

  // 高亮文本功能
  highlightBtn.addEventListener('click', function() {
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
  });

  // 元素统计功能
  countBtn.addEventListener('click', function() {
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
  });

  // 背景颜色功能
  colorBtn.addEventListener('click', function() {
    const colors = ['#ffebcd', '#e6f3ff', '#f0fff0', '#fff0f5', '#f5f5dc', '#ffe4e1', '#e0ffff'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    executeScript(function(color) {
      document.body.style.backgroundColor = color;
      return `背景颜色已改为 ${color}`;
    }, [randomColor]);
  });

  // 清除效果功能
  clearBtn.addEventListener('click', function() {
    executeScript(function() {
      // 清除背景颜色
      document.body.style.backgroundColor = '';
      
      // 清除高亮
      const highlightedElements = document.querySelectorAll('span[data-extension-highlight]');
      highlightedElements.forEach(span => {
        const textNode = document.createTextNode(span.textContent);
        span.parentElement.replaceChild(textNode, span);
      });
      
      // 清除美化效果
      const extensionStyles = document.querySelectorAll('#demo-extension-styles, #demo-extension-animations');
      extensionStyles.forEach(style => style.remove());
      
      return `已清除所有效果 (${highlightedElements.length + extensionStyles.length} 项)`;
    });
  });

  // 页面美化切换
  beautifyToggle.addEventListener('change', function() {
    const isEnabled = this.checked;
    
    if (isEnabled) {
      executeScript(function() {
        // 检查是否已经有美化样式
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
  });

  // 检查当前页面美化状态
  function checkBeautifyStatus() {
    getCurrentTab(function(tab) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: function() {
          return !!document.getElementById('demo-extension-styles');
        }
      }, function(results) {
        if (results && results[0]) {
          beautifyToggle.checked = results[0].result;
        }
      });
    });
  }

  // 初始化
  updatePageInfo();
  checkBeautifyStatus();

  // 监听标签页变化
  chrome.tabs.onActivated.addListener(function() {
    setTimeout(() => {
      updatePageInfo();
      checkBeautifyStatus();
    }, 100);
  });

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo) {
    if (changeInfo.status === 'complete') {
      setTimeout(() => {
        updatePageInfo();
        checkBeautifyStatus();
      }, 100);
    }
  });
});