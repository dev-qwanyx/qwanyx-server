/**
 * Mock DH API - Temporary placeholder
 * 
 * This is a temporary mock implementation to prevent dashboard errors
 * while the proper canvas-SPU integration is being designed.
 * 
 * TODO: Replace with real SPU integration when canvas architecture is ready
 */

export class DhApi {
  constructor() {
    console.log('Using Mock DH API - Canvas in placeholder mode')
  }
  
  /**
   * Mock toggle - just returns success
   */
  async toggle(dhId: string, enabled: boolean): Promise<{ success: boolean; data?: any; error?: string }> {
    console.log(`Mock: DH toggle ${dhId} -> ${enabled}`)
    return { 
      success: true, 
      data: { 
        message: 'Mock mode - Canvas visualization pending',
        dhId,
        enabled 
      } 
    }
  }
  
  /**
   * Mock status - returns static data
   */
  async getStatus(dhId: string): Promise<{ success: boolean; data?: any; error?: string }> {
    console.log(`Mock: DH status check for ${dhId}`)
    return { 
      success: true, 
      data: { 
        status: { 
          running: false,
          uptime: 0
        } 
      }
    }
  }
}

export default DhApi