chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request.action);
  
  if (request.action === 'openSidePanel') {
    const tabId = sender.tab.id;
    console.log('Opening side panel for tab:', tabId);
    
    chrome.sidePanel.open({ tabId }).then(() => {
      console.log('Side panel opened successfully');
      chrome.storage.local.set({
        'currentRowData': request.data,
        'tabId': tabId
      });
    }).catch((error) => {
      console.error('Failed to open side panel:', error);
    });
  }
  
  return true;
});

chrome.runtime.onStartup.addListener(() => {
  console.log('ShellAgent background script started');
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('ShellAgent extension installed');
});