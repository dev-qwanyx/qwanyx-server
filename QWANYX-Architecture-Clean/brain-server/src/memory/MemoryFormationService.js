/**
 * Memory Formation Service
 * Handles creation of properly structured memories based on templates
 */

const { ObjectId } = require('mongodb');
const { MongoClient } = require('mongodb');

class MemoryFormationService {
  constructor(database = 'autodin', collection = 'memories') {
    this.database = database;
    this.collection = collection;
    this.client = null;
    this.db = null;
    this.col = null;
  }

  /**
   * Connect to MongoDB
   */
  async connect() {
    if (this.client) return; // Already connected
    
    this.client = new MongoClient('mongodb://localhost:27017');
    await this.client.connect();
    this.db = this.client.db(this.database);
    this.col = this.db.collection(this.collection);
    console.log(`✅ MemoryFormationService connected to ${this.database}/${this.collection}`);
  }

  /**
   * Main API: Form a memory from type and raw data
   * @param {string} type - Type of memory (email, contact, task, etc.)
   * @param {object} data - Raw data to process
   * @returns {object} - The formed and saved memory
   */
  async formMemory(type, data) {
    await this.connect();
    
    let memory;
    
    // Dispatch to appropriate formation method
    switch (type) {
      case 'email':
        memory = this.createEmailMemory(data);
        // Future: Check for contact, create edges, etc.
        break;
        
      case 'contact':
        memory = this.createContactMemory(data);
        // Future: Link to emails, update relationships
        break;
        
      case 'task':
        memory = this.createTaskMemory(data);
        // Future: Link to source email, set reminders
        break;
        
      case 'note':
        memory = this.createNoteMemory(data);
        break;
        
      case 'thought':
        memory = this.createThoughtMemory(data);
        break;
        
      default:
        // Generic memory for unknown types
        memory = this.createGenericMemory(type, data);
    }
    
    // Save to MongoDB
    await this.col.insertOne(memory);
    console.log(`✅ Memory formed: ${memory._id} (${type})`);
    
    // Future: This is where compression will happen
    // memory = await this.compressMemory(memory);
    
    return memory;
  }

  /**
   * Create a link between two memories
   * @param {string} sourceId - Source node ID
   * @param {string} targetId - Target node ID
   * @param {string} type - Type of relationship
   */
  async createLink(sourceId, targetId, type) {
    await this.connect();
    
    const edge = {
      _id: new ObjectId(),
      s: new ObjectId(sourceId),
      t: new ObjectId(targetId),
      ty: type
    };
    
    await this.col.insertOne(edge);
    console.log(`✅ Link created: ${sourceId} --[${type}]--> ${targetId}`);
    
    return edge;
  }

  // ============================================
  // Memory Creation Methods (Internal)
  // ============================================

  /**
   * Create email memory structure
   */
  createEmailMemory(data) {
    return {
      _id: new ObjectId(),
      type: 'email',
      updatedAt: new Date(),
      
      // Email fields from template
      messageId: data.messageId || `email_${Date.now()}`,
      from: data.from?.text || data.from || '',
      to: this.normalizeToField(data.to),
      subject: data.subject || '',
      body: data.text || data.body || '',
      html: data.html || '',
      date: data.date || new Date(),
      folder: data.folder || 'INBOX',
      flags: data.flags || [],
      importance: this.determineImportance(data),
      compressed: null
    };
  }

  /**
   * Create contact memory structure
   */
  createContactMemory(data) {
    const email = data.email || data.address || '';
    const fullName = data.name || data.fullName || '';
    const [firstName, ...lastParts] = fullName.split(' ');
    const lastName = lastParts.join(' ');
    
    return {
      _id: new ObjectId(),
      type: 'contact',
      updatedAt: new Date(),
      
      // Contact fields from template
      email: email.toLowerCase(),
      firstName: firstName || '',
      lastName: lastName || '',
      fullName: fullName || email,
      messageCount: data.messageCount || 1,
      lastSeen: data.lastSeen || new Date(),
      tags: data.tags || [],
      notes: data.notes || '',
      data: {}  // Additional non-indexed data
    };
  }

  /**
   * Create task memory structure
   */
  createTaskMemory(data) {
    return {
      _id: new ObjectId(),
      type: 'task',
      updatedAt: new Date(),
      
      // Task fields
      title: data.title || data.subject || '',
      description: data.description || data.body || '',
      status: data.status || 'pending',
      priority: data.priority || 'normal',
      dueDate: data.dueDate || null,
      source: data.source || data.emailId || null,
      completed: false
    };
  }

  /**
   * Create note memory structure
   */
  createNoteMemory(data) {
    return {
      _id: new ObjectId(),
      type: 'note',
      updatedAt: new Date(),
      
      title: data.title || 'Untitled',
      content: data.content || data.text || '',
      tags: data.tags || [],
      source: data.source || 'manual',
      references: data.references || []
    };
  }

  /**
   * Create thought memory structure
   */
  createThoughtMemory(data) {
    return {
      _id: new ObjectId(),
      type: 'thought',
      updatedAt: new Date(),
      
      content: data.content || data.text || '',
      context: data.context || null,
      connections: data.connections || [],
      insights: data.insights || [],
      confidence: data.confidence || 0.5
    };
  }

  /**
   * Create generic memory for unknown types
   */
  createGenericMemory(type, data) {
    return {
      _id: new ObjectId(),
      type: type,
      updatedAt: new Date(),
      ...data
    };
  }

  // ============================================
  // Helper Methods
  // ============================================

  /**
   * Normalize the 'to' field to always be an array
   */
  normalizeToField(to) {
    if (!to) return [];
    if (Array.isArray(to)) return to;
    return [to];
  }

  /**
   * Determine email importance based on content
   */
  determineImportance(data) {
    const text = ((data.subject || '') + ' ' + (data.body || data.text || '')).toLowerCase();
    
    if (text.includes('urgent') || text.includes('asap') || text.includes('critical')) {
      return 'high';
    }
    if (text.includes('fyi') || text.includes('newsletter')) {
      return 'low';
    }
    return 'normal';
  }

  /**
   * Get statistics about memories
   */
  async getStats() {
    await this.connect();
    
    const stats = await this.col.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]).toArray();
    
    return stats;
  }

  /**
   * Disconnect from database
   */
  async disconnect() {
    if (this.client) {
      await this.client.close();
      console.log('MemoryFormationService disconnected');
    }
  }
}

module.exports = MemoryFormationService;