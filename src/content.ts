console.log('ShellAgent content script loaded');

interface RowData {
  name?: string;
  type?: string;
  description?: string;
}

function isNotionButton(element: Element): boolean {
  const span = element.querySelector('span');
  return element.getAttribute('role') === 'button' && 
         (element as HTMLElement).style.cursor === 'pointer' &&
         (element as HTMLElement).style.display === 'inline-flex' &&
         span?.textContent?.trim() === 'button';
}

function extractRowData(buttonElement: Element): RowData | null {
  const tableRow = buttonElement.closest('.notion-table-view-row');
  if (!tableRow) return null;
  
  const cells = Array.from(tableRow.querySelectorAll('.notion-table-view-cell'));
  const rowData: RowData = {};
  
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

function handleButtonClick(event: Event): void {
  const target = event.target as Element;
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

interface ContentMessageRequest {
  action: string;
}

interface PageDataResponse {
  url: string;
}

chrome.runtime.onMessage.addListener((request: ContentMessageRequest, _sender: chrome.runtime.MessageSender, sendResponse: (response?: PageDataResponse) => void) => {
  if (request.action === 'getPageData') {
    sendResponse({ url: window.location.href });
  }
  return true;
});