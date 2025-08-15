console.log('ShellAgent content script loaded');

function isNotionButton(element) {
  const span = element.querySelector('span');
  return element.getAttribute('role') === 'button' && 
         element.style.cursor === 'pointer' &&
         element.style.display === 'inline-flex' &&
         span?.textContent?.trim() === 'button';
}

function extractRowData(buttonElement) {
  const tableRow = buttonElement.closest('.notion-table-view-row');
  if (!tableRow) return null;
  
  const cells = Array.from(tableRow.querySelectorAll('.notion-table-view-cell'));
  const rowData = {};
  
  cells.forEach((cell, index) => {
    const textContent = cell.textContent?.trim();
    if (textContent && textContent !== 'button') {
      switch(index) {
        case 0:
          rowData.name = textContent;
          break;
        case 1:
          rowData.type = textContent;
          break;
        case 2:
          rowData.description = textContent;
          break;
      }
    }
  });
  
  console.log('Extracted row data:', rowData);
  return Object.keys(rowData).length > 0 ? rowData : null;
}

function handleButtonClick(event) {
  const target = event.target;
  const buttonElement = target.closest('[role="button"]');
  
  if (buttonElement && isNotionButton(buttonElement)) {
    event.preventDefault();
    event.stopPropagation();
    
    const rowData = extractRowData(buttonElement);
    console.log('Button clicked, row data:', rowData);
    
    chrome.runtime.sendMessage({
      action: 'openSidePanel',
      data: rowData
    });
  }
}

document.addEventListener('click', handleButtonClick, true);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageData') {
    sendResponse({ url: window.location.href });
  }
  return true;
});