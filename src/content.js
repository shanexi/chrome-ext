console.log('ShellAgent content script loaded');

let isExtensionActive = false;

function createFloatingButton() {
  if (document.getElementById('demo-extension-float-btn')) {
    return;
  }

  const floatBtn = document.createElement('div');
  floatBtn.id = 'demo-extension-float-btn';
  floatBtn.innerHTML = '🔧';
  floatBtn.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: #4CAF50;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10000;
    font-size: 20px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
  `;

  floatBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
    this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.4)';
  });

  floatBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
    this.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
  });

  floatBtn.addEventListener('click', function() {
    togglePageEffects();
  });

  document.body.appendChild(floatBtn);
}

function togglePageEffects() {
  isExtensionActive = !isExtensionActive;
  const floatBtn = document.getElementById('demo-extension-float-btn');
  
  if (isExtensionActive) {
    floatBtn.innerHTML = '✨';
    floatBtn.style.background = '#ff6b6b';
    applyPageEffects();
  } else {
    floatBtn.innerHTML = '🔧';
    floatBtn.style.background = '#4CAF50';
    removePageEffects();
  }
}

function applyPageEffects() {
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
  `;
  
  document.head.appendChild(style);
  
  const existingElements = document.querySelectorAll('h1, h2, h3');
  existingElements.forEach((el, index) => {
    setTimeout(() => {
      el.style.animation = 'demo-fade-in 0.5s ease-in-out';
    }, index * 100);
  });
  
  const animationStyle = document.createElement('style');
  animationStyle.id = 'demo-extension-animations';
  animationStyle.textContent = `
    @keyframes demo-fade-in {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(animationStyle);
  
  showNotification('页面效果已激活! ✨', 'success');
}

function removePageEffects() {
  const style = document.getElementById('demo-extension-styles');
  const animationStyle = document.getElementById('demo-extension-animations');
  
  if (style) style.remove();
  if (animationStyle) animationStyle.remove();
  
  showNotification('页面效果已关闭', 'info');
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 80px;
    right: 20px;
    padding: 12px 20px;
    background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
    color: white;
    border-radius: 6px;
    z-index: 10001;
    font-family: Arial, sans-serif;
    font-size: 14px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    animation: slideIn 0.3s ease-out;
  `;
  
  notification.textContent = message;
  
  const slideInStyle = document.createElement('style');
  slideInStyle.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `;
  document.head.appendChild(slideInStyle);
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-in';
    slideInStyle.textContent += `
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    setTimeout(() => {
      notification.remove();
      slideInStyle.remove();
    }, 300);
  }, 3000);
}

document.addEventListener('keydown', function(e) {
  if (e.ctrlKey && e.shiftKey && e.key === 'D') {
    e.preventDefault();
    togglePageEffects();
  }
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createFloatingButton);
} else {
  createFloatingButton();
}

window.addEventListener('beforeunload', function() {
  removePageEffects();
});