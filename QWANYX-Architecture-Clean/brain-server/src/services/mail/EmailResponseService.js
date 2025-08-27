/**
 * Email Response Service with Lead Qualification
 * Uses GPT-5 Nano with two system messages for sales responses
 */

const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');

class EmailResponseService {
  constructor(memoryFormationService) {
    this.memoryFormation = memoryFormationService;
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    // Load prompts
    this.salesPrompt = fs.readFileSync(
      path.join(__dirname, '../../prompts/sales-email-response-simple.md'), 
      'utf-8'
    );
    this.qualificationMap = fs.readFileSync(
      path.join(__dirname, '../../prompts/lead-qualification-map.md'),
      'utf-8'
    );
  }

  /**
   * Generate response and update contact with qualification data
   */
  async processEmailAndRespond(emailMemory, contactMemory) {
    // Get conversation history (up to 10 emails to get 5 exchanges)
    const previousEmails = await this.getConversationHistory(contactMemory.email);
    
    console.log(`📧 Found ${previousEmails.length} previous emails for ${contactMemory.email}`);
    previousEmails.forEach(email => {
      console.log(`  - ${email.type}: ${email.subject || 'No subject'} (${email.date || 'No date'})`);
    });
    
    // Build messages array for GPT
    const messages = [
      // System messages
      {
        role: 'system',
        content: this.qualificationMap // First: Process map
      },
      {
        role: 'system', 
        content: this.salesPrompt // Second: Personality & rules
      }
    ];
    
    // Add conversation history (last 5 exchanges max)
    const exchanges = this.buildConversationExchanges(previousEmails);
    messages.push(...exchanges);
    
    // Add current email as final user message
    messages.push({
      role: 'user',
      content: `New email from ${emailMemory.from}:\nSubject: ${emailMemory.subject}\n\n${emailMemory.body || emailMemory.text}`
    });

    // Call GPT with full conversation context
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o',  // Using GPT-4o for email responses
      messages: messages,
      // temperature: 0.7,  // GPT-5 doesn't support custom temperature either
      response_format: { type: "json_object" } // Force JSON response
    });

    // Parse the AI response
    const aiOutput = JSON.parse(response.choices[0].message.content);
    
    // Update contact with qualification data
    await this.updateContactQualification(contactMemory._id, {
      stage: aiOutput.stage,
      readiness: aiOutput.readiness,
      bant: aiOutput.bant,
      nextAction: aiOutput.next_action,
      handoffReady: aiOutput.handoff_ready,
      aiNotes: this.generateAINotes(aiOutput, emailMemory),
      lastQualificationUpdate: new Date()
    });

    // Store the response as an outbound email memory
    await this.memoryFormation.formMemory('email_outbound', {
      to: emailMemory.from,
      from: 'phil@qwanyx.com',
      subject: `Re: ${emailMemory.subject}`,
      body: aiOutput.response,
      date: new Date(),  // Add date for conversation history sorting
      inReplyTo: emailMemory.messageId,
      stage: aiOutput.stage,
      readiness: aiOutput.readiness
    });

    return {
      emailResponse: aiOutput.response,
      qualification: {
        stage: aiOutput.stage,
        readiness: aiOutput.readiness,
        bant: aiOutput.bant,
        handoffReady: aiOutput.handoff_ready
      },
      recommendation: aiOutput.next_action
    };
  }

  /**
   * Update contact with qualification data
   */
  async updateContactQualification(contactId, qualificationData) {
    await this.memoryFormation.col.updateOne(
      { _id: contactId },
      { 
        $set: {
          // Current qualification state
          'qualification.stage': qualificationData.stage,
          'qualification.readiness': qualificationData.readiness,
          'qualification.bant': qualificationData.bant,
          'qualification.handoffReady': qualificationData.handoffReady,
          
          // AI recommendations for next interaction
          'qualification.nextAction': qualificationData.nextAction,
          'qualification.aiNotes': qualificationData.aiNotes,
          'qualification.lastUpdate': qualificationData.lastQualificationUpdate,
          
          // Update general fields
          updatedAt: new Date()
        },
        $push: {
          // Keep history of qualification changes
          'qualification.history': {
            timestamp: new Date(),
            stage: qualificationData.stage,
            readiness: qualificationData.readiness,
            notes: qualificationData.aiNotes
          }
        }
      }
    );
  }

  /**
   * Generate AI notes for the next interaction
   */
  generateAINotes(aiOutput, emailMemory) {
    const notes = [];
    
    // Stage-specific observations
    if (aiOutput.stage === 'COLD') {
      notes.push(`Prospect is in discovery phase. Focus on education.`);
    } else if (aiOutput.stage === 'WARM') {
      notes.push(`Showing interest. Time to demonstrate specific value.`);
    } else if (aiOutput.stage === 'HOT') {
      notes.push(`Ready to move forward. Address final concerns.`);
    }
    
    // BANT observations
    if (aiOutput.bant.budget === 'unknown') {
      notes.push(`⚠️ Budget not yet discussed - probe gently next time.`);
    }
    if (aiOutput.bant.authority === 'unknown') {
      notes.push(`⚠️ Decision maker not identified - ask about team involvement.`);
    }
    if (aiOutput.bant.need === 'urgent') {
      notes.push(`✅ Urgent need expressed - move quickly.`);
    }
    if (aiOutput.bant.timeline === 'this_month') {
      notes.push(`🔥 Fast timeline - prioritize this lead.`);
    }
    
    // Handoff recommendation
    if (aiOutput.handoff_ready) {
      notes.push(`🎯 READY FOR HANDOFF - Schedule call with human sales.`);
    }
    
    // Next action
    notes.push(`Next: ${aiOutput.next_action}`);
    
    return notes.join(' ');
  }

  /**
   * Get previous email exchanges with this contact
   */
  async getConversationHistory(contactEmail) {
    const emails = await this.memoryFormation.col.find({
      type: { $in: ['email', 'email_outbound'] },
      $or: [
        { from: new RegExp(contactEmail, 'i') },
        { to: new RegExp(contactEmail, 'i') }
      ]
    })
    .sort({ date: -1 })
    .limit(10)
    .toArray();
    
    return emails;
  }

  /**
   * Build conversation exchanges for GPT context
   * Returns array of {role, content} messages
   */
  buildConversationExchanges(emails) {
    const exchanges = [];
    
    // Sort emails by date (oldest first)
    const sorted = emails.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Build exchanges (up to 5 pairs)
    let exchangeCount = 0;
    for (let i = 0; i < sorted.length && exchangeCount < 5; i++) {
      const email = sorted[i];
      
      // Determine role based on email type
      if (email.type === 'email_outbound') {
        // Our previous response
        exchanges.push({
          role: 'assistant',
          content: email.body
        });
      } else {
        // Their email to us
        exchanges.push({
          role: 'user',
          content: email.body || email.text
        });
        exchangeCount++; // Count complete exchanges
      }
    }
    
    // If we have no history, add a context message
    if (exchanges.length === 0) {
      exchanges.push({
        role: 'system',
        content: 'This is the first contact with this prospect.'
      });
    }
    
    return exchanges;
  }
}

module.exports = EmailResponseService;