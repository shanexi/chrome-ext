import React, { useState, useEffect, useRef } from "react";
import KittyIcon from "../../icons/kitty.svg";

const FloatingBall: React.FC = () => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [hoveredElement, setHoveredElement] = useState<Element | null>(null);
  const originalStylesRef = useRef<Map<Element, {outline: string, boxShadow: string}>>(new Map());
  const isSelectingRef = useRef(false);

  const handleClick = () => {
    console.log("Floating ball clicked");
    if (isSelecting) {
      exitSelectionMode();
    } else {
      enterSelectionMode();
    }
  };

  const enterSelectionMode = () => {
    setIsSelecting(true);
    isSelectingRef.current = true;
    document.body.style.cursor = 'crosshair';
    
    // Add event listeners for element selection
    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('mouseout', handleMouseOut, true);
    document.addEventListener('click', handleElementClick, true);
  };

  const exitSelectionMode = () => {
    setIsSelecting(false);
    isSelectingRef.current = false;
    document.body.style.cursor = '';
    
    // Remove event listeners
    document.removeEventListener('mouseover', handleMouseOver, true);
    document.removeEventListener('mouseout', handleMouseOut, true);
    document.removeEventListener('click', handleElementClick, true);
    
    // Clear any remaining highlight
    clearHighlight();
  };

  const handleMouseOver = (e: Event) => {
    if (!isSelectingRef.current) return;
    
    const target = e.target as Element;
    if (target && target !== document.body && target !== document.documentElement) {
      // Don't highlight the floating ball itself
      if (target.closest('#shell-agent-floating-ball-root')) return;
      
      setHoveredElement(target);
      highlightElement(target);
    }
  };

  const handleMouseOut = (e: Event) => {
    if (!isSelectingRef.current) return;
    
    const target = e.target as Element;
    console.log('Mouse out:', target, 'hoveredElement:', hoveredElement, 'equal:', target === hoveredElement);
    if (target && hoveredElement === target) {
      console.log('Clearing highlight for:', target);
      clearHighlight(target);
      setHoveredElement(null);
    }
  };

  const handleElementClick = (e: Event) => {
    if (!isSelectingRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const target = e.target as Element;
    if (target && target !== document.body && target !== document.documentElement) {
      // Don't select the floating ball itself
      if (target.closest('#shell-agent-floating-ball-root')) return;
      
      replaceElementWithIframe(target);
      exitSelectionMode();
    }
  };

  const highlightElement = (element: Element) => {
    clearHighlight();
    
    // Store original styles
    const htmlElement = element as HTMLElement;
    const originalOutline = htmlElement.style.outline;
    const originalBoxShadow = htmlElement.style.boxShadow;
    
    originalStylesRef.current.set(element, {
      outline: originalOutline,
      boxShadow: originalBoxShadow
    });
    
    // Apply highlight styles
    htmlElement.style.outline = '2px solid #007acc';
    htmlElement.style.boxShadow = '0 0 10px rgba(0, 122, 204, 0.5)';
  };

  const clearHighlight = (element?: Element) => {
    if (element) {
      // Clear specific element
      const originalStyles = originalStylesRef.current.get(element);
      if (originalStyles) {
        const htmlElement = element as HTMLElement;
        htmlElement.style.outline = originalStyles.outline;
        htmlElement.style.boxShadow = originalStyles.boxShadow;
        originalStylesRef.current.delete(element);
      }
    } else {
      // Clear all highlights
      originalStylesRef.current.forEach((originalStyles, el) => {
        const htmlElement = el as HTMLElement;
        htmlElement.style.outline = originalStyles.outline;
        htmlElement.style.boxShadow = originalStyles.boxShadow;
      });
      originalStylesRef.current.clear();
      setHoveredElement(null);
    }
  };

  const replaceElementWithIframe = (element: Element) => {
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    
    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.src = 'https://example.com';
    iframe.style.width = rect.width + 'px';
    iframe.style.height = rect.height + 'px';
    iframe.style.border = 'none';
    iframe.style.margin = computedStyle.margin;
    iframe.style.padding = computedStyle.padding;
    iframe.style.position = computedStyle.position === 'static' ? 'relative' : computedStyle.position;
    
    // Copy positioning if needed
    if (computedStyle.position !== 'static') {
      iframe.style.top = computedStyle.top;
      iframe.style.left = computedStyle.left;
      iframe.style.right = computedStyle.right;
      iframe.style.bottom = computedStyle.bottom;
    }
    
    // Replace the element
    element.parentNode?.replaceChild(iframe, element);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isSelecting) {
        exitSelectionMode();
      }
    };
  }, []);

  return (
    <div
      className={`fixed right-[15px] top-1/2 -translate-y-1/2 w-[36px] h-[36px] cursor-pointer z-[10000] select-none pointer-events-auto transition-all duration-200 ${
        isSelecting ? 'scale-110 rotate-12' : ''
      }`}
      onClick={handleClick}
      title={isSelecting ? '点击退出选择模式' : '点击开始选择元素'}
    >
      <KittyIcon className={`max-w-full max-h-full transition-colors duration-200 ${
        isSelecting ? 'fill-blue-400' : 'fill-white'
      }`} />
    </div>
  );
};

export default FloatingBall;
