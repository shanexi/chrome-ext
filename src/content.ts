import { FloatingBallRoot } from './content/floating-ball-root';
import { NotionHandler } from './content/notion-handler';

console.log('ShellAgent content script loaded');

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

const notionHandler = new NotionHandler();
const floatingBallRoot = new FloatingBallRoot();