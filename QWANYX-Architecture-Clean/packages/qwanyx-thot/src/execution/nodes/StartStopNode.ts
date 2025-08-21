import { BaseNode } from '../BaseNode';
import { ExecutionContext, NodeResult } from '../types';

export class StartStopNode extends BaseNode {
  static nodeType = 'start-stop';
  type = 'start-stop';
  
  async execute(context: ExecutionContext): Promise<NodeResult> {
    // Get current running state
    const isRunning = await this.getMemory('dh_running') || false;
    
    // Toggle the state based on input (from switch)
    const action = context.input?.action || 'toggle';
    let newState = isRunning;
    
    if (action === 'start') {
      newState = true;
    } else if (action === 'stop') {
      newState = false;
    } else if (action === 'toggle') {
      newState = !isRunning;
    }
    
    await this.updateMemory('dh_running', newState);
    await this.updateMemory('dh_started_at', newState ? new Date().toISOString() : null);
    
    this.log(`DH ${newState ? 'started' : 'stopped'}`);
    
    return {
      success: true,
      output: {
        running: newState,
        avatar: this.data.avatar || '/default-avatar.png',
        dhName: this.data.name || 'Digital Human',
        status: newState ? 'active' : 'inactive'
      }
    };
  }
  
  getDefaultConfig() {
    return {
      avatar: '/avatars/default.png',
      name: 'DH Assistant',
      showSwitch: true,
      autoStart: false
    };
  }
}