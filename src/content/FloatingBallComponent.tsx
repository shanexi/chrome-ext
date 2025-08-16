import React, { useState, useRef, useEffect, useCallback } from 'react';

interface FloatingBallState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isOnLeft: boolean;
}

const FloatingBallComponent: React.FC = () => {
  const [state, setState] = useState<FloatingBallState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    currentX: window.innerWidth - 70,
    currentY: window.innerHeight / 2 - 30,
    isOnLeft: false
  });

  const ballRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setState(prev => ({
      ...prev,
      isDragging: true,
      startX: e.clientX - prev.currentX,
      startY: e.clientY - prev.currentY
    }));
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!state.isDragging) return;
    
    const newX = e.clientX - state.startX;
    const newY = e.clientY - state.startY;
    
    setState(prev => ({
      ...prev,
      currentX: Math.max(0, Math.min(window.innerWidth - 60, newX)),
      currentY: Math.max(0, Math.min(window.innerHeight - 60, newY))
    }));
  }, [state.isDragging, state.startX, state.startY]);

  const handleMouseUp = useCallback(() => {
    if (!state.isDragging) return;
    
    setState(prev => {
      const centerX = prev.currentX + 30;
      const windowCenter = window.innerWidth / 2;
      const isLeft = centerX < windowCenter;
      
      return {
        ...prev,
        isDragging: false,
        currentX: isLeft ? 10 : window.innerWidth - 70,
        isOnLeft: isLeft
      };
    });
  }, [state.isDragging]);

  const handleClick = useCallback(() => {
    if (!state.isDragging) {
      console.log('Floating ball clicked');
      chrome.runtime.sendMessage({
        action: 'openSidePanel',
        data: { source: 'floatingBall' }
      });
    }
  }, [state.isDragging]);

  useEffect(() => {
    if (state.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [state.isDragging, handleMouseMove, handleMouseUp]);

  const ballStyle: React.CSSProperties = {
    position: 'fixed',
    left: `${state.currentX}px`,
    top: `${state.currentY}px`,
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#ff6b8a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: state.isDragging ? 'grabbing' : 'grab',
    zIndex: 10000,
    boxShadow: state.isDragging 
      ? '0 8px 24px rgba(0, 0, 0, 0.25)' 
      : '0 4px 12px rgba(0, 0, 0, 0.15)',
    transform: state.isDragging ? 'scale(1.1)' : 'scale(1)',
    transition: state.isDragging ? 'none' : 'all 0.3s ease',
    userSelect: 'none',
    color: 'white',
    fontSize: '24px'
  };

  return (
    <div
      ref={ballRef}
      style={ballStyle}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
    >
      🤖
    </div>
  );
};

export default FloatingBallComponent;