interface FloatingBallState {
  isDragging: boolean;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  isOnLeft: boolean;
}

export class FloatingBall {
  private element: HTMLElement;
  private state: FloatingBallState;
  private animationFrame?: number;

  constructor() {
    this.state = {
      isDragging: false,
      startX: 0,
      startY: 0,
      currentX: window.innerWidth - 70,
      currentY: window.innerHeight / 2 - 30,
      isOnLeft: false
    };
    this.element = this.createElement();
    this.attachEventListeners();
    this.render();
  }

  private createElement(): HTMLElement {
    const ball = document.createElement('div');
    ball.id = 'shell-agent-floating-ball';
    ball.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" fill="#ff6b8a"/>
        <path d="M8 12h8M12 8v8" stroke="white" stroke-width="2" stroke-linecap="round"/>
      </svg>
    `;
    
    Object.assign(ball.style, {
      position: 'fixed',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: '#ff6b8a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'grab',
      zIndex: '10000',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      transition: 'transform 0.3s ease, box-shadow 0.2s ease',
      userSelect: 'none',
      touchAction: 'none'
    });

    document.body.appendChild(ball);
    return ball;
  }

  private attachEventListeners(): void {
    this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    document.addEventListener('touchend', this.handleTouchEnd.bind(this));
    
    window.addEventListener('resize', this.handleResize.bind(this));
    
    this.element.addEventListener('click', this.handleClick.bind(this));
  }

  private handleMouseDown(e: MouseEvent): void {
    e.preventDefault();
    this.startDrag(e.clientX, e.clientY);
  }

  private handleTouchStart(e: TouchEvent): void {
    e.preventDefault();
    const touch = e.touches[0];
    this.startDrag(touch.clientX, touch.clientY);
  }

  private startDrag(clientX: number, clientY: number): void {
    this.state.isDragging = true;
    this.state.startX = clientX - this.state.currentX;
    this.state.startY = clientY - this.state.currentY;
    
    this.element.style.cursor = 'grabbing';
    this.element.style.transform = 'scale(1.1)';
    this.element.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.25)';
  }

  private handleMouseMove(e: MouseEvent): void {
    if (!this.state.isDragging) return;
    e.preventDefault();
    this.updatePosition(e.clientX, e.clientY);
  }

  private handleTouchMove(e: TouchEvent): void {
    if (!this.state.isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    this.updatePosition(touch.clientX, touch.clientY);
  }

  private updatePosition(clientX: number, clientY: number): void {
    this.state.currentX = clientX - this.state.startX;
    this.state.currentY = clientY - this.state.startY;
    
    this.state.currentX = Math.max(0, Math.min(window.innerWidth - 60, this.state.currentX));
    this.state.currentY = Math.max(0, Math.min(window.innerHeight - 60, this.state.currentY));
    
    this.render();
  }

  private handleMouseUp(): void {
    if (!this.state.isDragging) return;
    this.endDrag();
  }

  private handleTouchEnd(): void {
    if (!this.state.isDragging) return;
    this.endDrag();
  }

  private endDrag(): void {
    this.state.isDragging = false;
    
    this.element.style.cursor = 'grab';
    this.element.style.transform = 'scale(1)';
    this.element.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    
    this.snapToSide();
  }

  private snapToSide(): void {
    const centerX = this.state.currentX + 30;
    const windowCenter = window.innerWidth / 2;
    
    if (centerX < windowCenter) {
      this.state.currentX = 10;
      this.state.isOnLeft = true;
    } else {
      this.state.currentX = window.innerWidth - 70;
      this.state.isOnLeft = false;
    }
    
    this.element.style.transition = 'left 0.3s ease';
    this.render();
    
    setTimeout(() => {
      this.element.style.transition = 'transform 0.3s ease, box-shadow 0.2s ease';
    }, 300);
  }

  private handleResize(): void {
    if (this.state.isOnLeft) {
      this.state.currentX = 10;
    } else {
      this.state.currentX = window.innerWidth - 70;
    }
    
    this.state.currentY = Math.max(0, Math.min(window.innerHeight - 60, this.state.currentY));
    this.render();
  }

  private handleClick(): void {
    if (!this.state.isDragging) {
      console.log('Floating ball clicked');
      chrome.runtime.sendMessage({
        action: 'openSidePanel',
        data: { source: 'floatingBall' }
      });
    }
  }

  private render(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    this.animationFrame = requestAnimationFrame(() => {
      this.element.style.left = `${this.state.currentX}px`;
      this.element.style.top = `${this.state.currentY}px`;
    });
  }

  public destroy(): void {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}