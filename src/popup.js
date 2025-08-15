document.addEventListener('DOMContentLoaded', function() {
  const highlightBtn = document.getElementById('highlightBtn');
  const countBtn = document.getElementById('countBtn');
  const changeColorBtn = document.getElementById('changeColorBtn');
  const clearBtn = document.getElementById('clearBtn');
  const openSidePanel = document.getElementById('openSidePanel');
  const status = document.getElementById('status');

  function showStatus(message, type = 'info') {
    status.textContent = message;
    status.className = type;
    setTimeout(() => {
      status.textContent = '';
      status.className = '';
    }, 3000);
  }

  function executeScript(func, args = []) {
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
  }

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
  });

  countBtn.addEventListener('click', function() {
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
  });

  changeColorBtn.addEventListener('click', function() {
    const colors = ['#ffebcd', '#e6f3ff', '#f0fff0', '#fff0f5', '#f5f5dc'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    executeScript(function(color) {
      document.body.style.backgroundColor = color;
      return `背景颜色已改为 ${color}`;
    }, [randomColor]);
  });

  clearBtn.addEventListener('click', function() {
    executeScript(function() {
      document.body.style.backgroundColor = '';
      
      const highlightedElements = document.querySelectorAll('span[style*="background-color: yellow"]');
      highlightedElements.forEach(span => {
        const textNode = document.createTextNode(span.textContent);
        span.parentElement.replaceChild(textNode, span);
      });
      
      return `已清除所有效果 (${highlightedElements.length} 个高亮)`;
    });
  });

  openSidePanel.addEventListener('click', function() {
    chrome.windows.getCurrent(function(window) {
      chrome.sidePanel.open({ windowId: window.id }, function() {
        if (chrome.runtime.lastError) {
          showStatus('无法打开侧边栏: ' + chrome.runtime.lastError.message, 'error');
        } else {
          showStatus('侧边栏已打开', 'success');
          setTimeout(() => window.close(), 500);
        }
      });
    });
  });
});