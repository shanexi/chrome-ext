import { createRoot } from 'react-dom/client';
import FloatingBall from './floating-ball';

export class FloatingBallRoot {
  private root: ReturnType<typeof createRoot> | null = null;
  private container: HTMLElement | null = null;

  constructor() {
    this.createElement();
  }

  private createElement(): void {
    this.container = document.createElement('div');
    this.container.id = 'shell-agent-floating-ball-root';
    document.body.appendChild(this.container);
    
    this.root = createRoot(this.container);
    this.root.render(<FloatingBall />);
  }

  public destroy(): void {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
      this.container = null;
    }
  }
}