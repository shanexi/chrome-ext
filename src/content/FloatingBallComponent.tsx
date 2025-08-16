import React from 'react';
import { Bot } from 'lucide-react';

const FloatingBallComponent: React.FC = () => {
  const handleClick = () => {
    console.log('Floating ball clicked');
    chrome.runtime.sendMessage({
      action: 'openSidePanel',
      data: { source: 'floatingBall' }
    });
  };

  return (
    <div
      className="fixed right-[15px] top-1/2 -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-pink-400 flex items-center justify-center cursor-pointer z-[10000] shadow-lg transition-all duration-300 ease-in-out select-none pointer-events-auto opacity-70 hover:opacity-100"
      onClick={handleClick}
    >
      <Bot className="w-6 h-6 text-white" />
    </div>
  );
};

export default FloatingBallComponent;