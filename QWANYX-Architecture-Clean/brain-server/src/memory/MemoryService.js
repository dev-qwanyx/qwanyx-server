/**
 * Memory Service - Abstraction for memory formation
 * Handles all memory creation with future support for compression
 */

const { ObjectId } = require('mongodb');
const { MongoClient } = require('mongodb');
const templates = require('./memoryTemplates');

class MemoryService {
  constructor(database, collection) {
    this.database = database;
    this.collection = collection;
    this.client = null;
    this.db = null;
    this.col = null;
  }

  async connect() {
    this.client = new MongoClient('mongodb://localhost:27017');
    await this.client.connect();
    this.db = this.client.db(this.database);
    this.col = this.db.collection(this.collection);
    console.log(`✅ MemoryService connected to ${this.database}/${this.collection}`);
  }

  /**
   * Form a memory from any document type
   * This is the ONLY method mail processing needs to call
   */
  async formMemory(type, document) {
    console.log(`🧠 Forming ${type} memory...`);

    let memory;
    let edge = null;

    switch (type) {
      case 'email':
        memory = await this.formEmailMemory(document);
        // Check if we need to create/update contact
        const contact = await this.findOrCreateContact(document.from);
        if (contact) {
          edge = this.createEdge(contact._id, memory._id, 'sent');
        }
        break;

      case 'contact':
        memory = await this.formContactMemory(document);
        break;

      case 'task':
        memory = await this.formTaskMemory(document);
        break;

      default:
        // Generic memory formation
        memory = {
          _id: new ObjectId(),
          type: type,
          updatedAt: new Date(),
          ...document
        };
    }

    // Save memory to database
    await this.col.insertOne(memory);
    console.log(`✅ Memory saved: ${memory._id}`);

    // Save edge if exists
    if (edge) {
      await this.col.insertOne(edge);
      console.log(`✅ Edge created: ${edge._id}`);
    }

    // Future: This is where compression would happen
    // const compressed = await this.compress(memory);
    // memory.compressed = compressed;

    return {
      memory,
      edge,
      success: true
    };
  }

  /**
   * Form email memory
   */
  async formEmailMemory(emailData) {
    return {
      _id: new ObjectId(),
      type: 'email',
      updatedAt: new Date(),
      messageId: emailData.messageId,
      from: emailData.from?.text || emailData.from,
      to: emailData.to || [],
      subject: emailData.subject || 'No Subject',
      body: emailData.text || '',
      html: emailData.html || '',
      date: emailData.date || new Date(),
      folder: 'INBOX',
      flags: emailData.flags || [],
      importance: emailData.subject?.toLowerCase().includes('urgent') ? 'high' : 'normal',
      compressed: null
    };
  }

  /**
   * Form contact memory
   */
  async formContactMemory(contactData) {
    const email = contactData.email || contactData.address;
    const name = contactData.name || contactData.fullName || '';
    const [firstName, ...lastParts] = name.split(' ');
    const lastName = lastParts.join(' ');

    return {
      _id: new ObjectId(),
      type: 'contact',
      updatedAt: new Date(),
      email: email.toLowerCase(),
      firstName: firstName || email.split('@')[0],
      lastName: lastName || '',
      fullName: name || email,
      messageCount: 1,
      lastSeen: new Date(),
      tags: [],
      notes: ''
    };
  }

  /**
   * Form task memory (from email)
   */
  async formTaskMemory(taskData) {
    return {
      _id: new ObjectId(),
      type: 'task',
      updatedAt: new Date(),
      title: taskData.title || taskData.subject,
      description: taskData.description || taskData.body,
      status: 'pending',
      priority: taskData.priority || 'normal',
      dueDate: taskData.dueDate || null,
      source: taskData.emailId || null,
      completed: false
    };
  }

  /**
   * Find or create contact
   */
  async findOrCreateContact(emailAddress) {
    if (!emailAddress) return null;

    // Parse email address
    const email = typeof emailAddress === 'string' 
      ? emailAddress.toLowerCase()
      : emailAddress.address?.toLowerCase() || emailAddress.text?.match(/<(.+)>/)?.[1]?.toLowerCase();

    if (!email) return null;

    // Check if contact exists
    let contact = await this.col.findOne({ 
      type: 'contact',
      email: email 
    });

    if (contact) {
      // Update message count and last seen
      await this.col.updateOne(
        { _id: contact._id },
        { 
          $inc: { messageCount: 1 },
          $set: { lastSeen: new Date(), updatedAt: new Date() }
        }
      );
      console.log(`📇 Contact exists: ${email} (messages: ${contact.messageCount + 1})`);
    } else {
      // Create new contact
      const name = typeof emailAddress === 'string' 
        ? '' 
        : emailAddress.name || '';
      
      contact = await this.formContactMemory({
        email,
        name
      });
      
      await this.col.insertOne(contact);
      console.log(`📇 Contact created: ${email}`);
    }

    return contact;
  }

  /**
   * Create edge between nodes
   */
  createEdge(sourceId, targetId, type) {
    return {
      _id: new ObjectId(),
      s: sourceId,
      t: targetId,
      ty: type
    };
  }

  /**
   * Future: Compress memory with AI
   */
  async compress(memory) {
    // Placeholder for GPT-5 Nano compression
    // Will extract: summary, tags, entities, importance
    return null;
  }

  async disconnect() {
    if (this.client) {
      await this.client.close();
      console.log('MemoryService disconnected');
    }
  }
}

module.exports = MemoryService;