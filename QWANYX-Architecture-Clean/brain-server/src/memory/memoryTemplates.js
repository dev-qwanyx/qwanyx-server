/**
 * Memory Templates and Schemas
 * Defines the structure for different types of memory nodes
 */

const { ObjectId } = require('mongodb');

// ============================================
// BASE SCHEMAS
// ============================================

/**
 * Base Node Schema - All nodes inherit from this
 */
const BaseNodeSchema = {
  _id: ObjectId,           // MongoDB ObjectId (contains timestamp)
  type: String,            // 'contact', 'email', 'task', 'note', etc.
  updatedAt: Date,
  data: Object             // Type-specific data
};

/**
 * Base Edge Schema - All relationships
 */
const BaseEdgeSchema = {
  _id: ObjectId,              // MongoDB ObjectId (contains timestamp)
  s: ObjectId,          // Source node ID
  t: ObjectId,          // Target node ID
  ty: String             // 'sent', 'received', 'tagged', 'references', etc.
};

// ============================================
// NODE TEMPLATES
// ============================================

/**
 * Contact Node Template
 */
const ContactNodeTemplate = {
  _id: () => new ObjectId(),
  type: 'contact',
  updatedAt: () => new Date(),

  email: String,         // Required: email address
  firstName: String,     // First name
  lastName: String,      // Last name  
  fullName: String,      // Full display name
  messageCount: Number,  // Number of emails exchanged
  lastSeen: Date,        // Most recent interaction
  tags: Array,           // ['client', 'friend', 'colleague']
  notes: String,          // Free text notes
  data: Object

};

/**
 * Email Node Template
 */
const EmailNodeTemplate = {
  _id: () => new ObjectId(),
  type: 'email',
  updatedAt: () => new Date(),

  messageId: String,     // Email message ID
  from: String,          // Sender email
  to: Array,             // Recipients
  subject: String,       // Email subject
  body: String,          // Email body (plain text)
  html: String,          // Email body (plain text)
  date: Date,            // Email date
  folder: String,        // 'INBOX', 'Sent', etc.
  flags: Array,          // ['\\Seen', '\\Flagged']
  importance: String,    // 'high', 'normal', 'low'
  compressed: Object     // Compression data if processed

};

