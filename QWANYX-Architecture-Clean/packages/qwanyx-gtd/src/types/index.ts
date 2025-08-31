// GTD Types
export interface GTDItem {
  id: string;
  name: string;
  content: string;
  contentPreview?: string;
  dateAdded: Date;
  dateModified?: Date;
  
  // Status & categorization
  status: 'inbox' | 'next_action' | 'project' | 'waiting' | 'someday' | 'reference' | 'done' | 'trash';
  priority: 'critical' | 'high' | 'normal' | 'low';
  energy: 'high' | 'medium' | 'low';
  timeEstimate?: number; // minutes
  
  // Context & relationships
  contexts: string[]; // @computer, @phone, @errands, @home, @office
  projectId?: string;
  delegatedTo?: string;
  category?: string;
  
  // Email related
  emailSource?: {
    from: string;
    subject: string;
    date: Date;
    hasAttachments: boolean;
  };
  
  // SPU suggestions (will be populated by SPU later)
  spuSuggestion?: {
    action: 'do_now' | 'delegate' | 'defer' | 'delete';
    confidence: number;
    reasoning?: string;
  };
}

export interface GTDProject {
  id: string;
  name: string;
  description: string;
  outcome: string;
  status: 'active' | 'on_hold' | 'completed' | 'cancelled';
  createdAt: Date;
  dueDate?: Date;
  nextActions: string[]; // Item IDs
  reviewFrequency: 'daily' | 'weekly' | 'monthly';
  lastReview?: Date;
}

export interface ProcessingDecision {
  itemId: string;
  decision: 'do_now' | 'delegate' | 'defer' | 'delete';
  context?: string;
  delegateTo?: string;
  deferUntil?: Date;
  projectId?: string;
  timeEstimate?: number;
}

export interface EmailVerificationStatus {
  email: string;
  verified: boolean;
  verifiedAt?: Date;
  canSend: boolean;
  canReceive: boolean;
}

export interface GTDStats {
  inbox: number;
  nextActions: number;
  waiting: number;
  projects: number;
  completed: number;
  delegated: number;
}

export interface GTDConfig {
  apiUrl?: string;
  workspace?: string;
  userEmail?: string;
  enableSPU?: boolean;
  enableEmailIntegration?: boolean;
}