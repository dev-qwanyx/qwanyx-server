/**
 * Sales Personality Prompt System
 * Generates responses based on lead temperature and qualification
 */

class SalesPersonalityPrompt {
  constructor(personality) {
    this.personality = personality || this.getDefaultPersonality();
  }

  /**
   * Default personality traits (semantically compressed)
   */
  getDefaultPersonality() {
    return {
      // Core traits (compressed)
      style: 'consultative-friendly', // vs aggressive, passive, technical
      tone: 'professional-warm',      // vs casual, formal, enthusiastic
      approach: 'value-first',         // vs feature-first, price-first
      pace: 'adaptive',               // vs fast, slow, methodical
      
      // Business context
      product: 'premium-service',     // What we're selling
      valueProposition: 'time-savings-expertise', // Core value
      targetCustomer: 'SMB-growth',   // Who we sell to
      
      // Response patterns
      questionStyle: 'open-discovery', // How we ask questions
      objectionHandling: 'acknowledge-reframe', // How we handle pushback
      closingStyle: 'assumptive-soft' // How we close deals
    };
  }

  /**
   * Determine lead temperature from email content
   */
  analyzeLeadTemperature(emailContent) {
    const content = emailContent.toLowerCase();
    
    // Hot indicators (ready to buy)
    const hotIndicators = [
      'pricing', 'cost', 'quote', 'proposal', 'contract',
      'when can we start', 'ready to move forward', 'budget approved',
      'decision', 'purchase', 'buy', 'demo', 'trial'
    ];
    
    // Warm indicators (evaluating)
    const warmIndicators = [
      'how does', 'features', 'benefits', 'case study',
      'reference', 'compare', 'vs', 'difference', 'integration',
      'implementation', 'timeline', 'process'
    ];
    
    // Cold indicators (just looking)
    const coldIndicators = [
      'just curious', 'browsing', 'heard about', 'what do you',
      'information', 'tell me about', 'exploring', 'researching'
    ];
    
    // Count indicators
    let hotScore = hotIndicators.filter(ind => content.includes(ind)).length;
    let warmScore = warmIndicators.filter(ind => content.includes(ind)).length;
    let coldScore = coldIndicators.filter(ind => content.includes(ind)).length;
    
    // Determine temperature
    if (hotScore > warmScore && hotScore > coldScore) {
      return 'hot';
    } else if (warmScore >= coldScore) {
      return 'warm';
    } else {
      return 'cold';
    }
  }

  /**
   * Extract BANT qualification signals
   */
  extractQualificationSignals(emailContent, previousEmails = []) {
    const signals = {
      budget: null,
      authority: null,
      need: null,
      timeline: null,
      stage: 'discovery'
    };
    
    const content = emailContent.toLowerCase();
    
    // Budget signals
    if (content.match(/budget|afford|cost|price|invest|spend/)) {
      signals.budget = 'mentioned';
    }
    
    // Authority signals
    if (content.match(/\bi\b.*decide|my team|our company|we are|decision/)) {
      signals.authority = 'likely';
    }
    if (content.match(/my boss|need approval|check with|discuss with team/)) {
      signals.authority = 'influencer';
    }
    
    // Need signals
    if (content.match(/problem|issue|challenge|struggle|pain|need|looking for/)) {
      signals.need = 'expressed';
    }
    
    // Timeline signals
    if (content.match(/asap|urgent|immediately|this week|this month|q[1-4]|deadline/)) {
      signals.timeline = 'urgent';
    } else if (content.match(/soon|planning|considering|next year/)) {
      signals.timeline = 'future';
    }
    
    return signals;
  }

  /**
   * Generate the main prompt for email response
   */
  generatePrompt(emailData, conversationHistory = []) {
    const temperature = this.analyzeLeadTemperature(emailData.body || emailData.text);
    const signals = this.extractQualificationSignals(emailData.body || emailData.text, conversationHistory);
    
    const prompt = `
You are an AI sales representative with the following personality:
- Style: ${this.personality.style}
- Tone: ${this.personality.tone}  
- Approach: ${this.personality.approach}

CONTEXT:
- Lead Temperature: ${temperature}
- Email from: ${emailData.from}
- Subject: ${emailData.subject}
- Previous exchanges: ${conversationHistory.length}

QUALIFICATION SIGNALS DETECTED:
- Budget: ${signals.budget || 'unknown'}
- Authority: ${signals.authority || 'unknown'}
- Need: ${signals.need || 'unknown'}
- Timeline: ${signals.timeline || 'unknown'}

RESPONSE STRATEGY for ${temperature.toUpperCase()} lead:
${this.getStrategyForTemperature(temperature, signals)}

QUALIFICATION QUESTIONS TO NATURALLY WEAVE IN:
${this.getQualificationQuestions(signals, temperature)}

EMAIL TO RESPOND TO:
"${emailData.body || emailData.text}"

INSTRUCTIONS:
1. Match their energy level and communication style
2. ${temperature === 'cold' ? 'Build rapport and educate' : temperature === 'warm' ? 'Demonstrate value and build trust' : 'Move toward closing'}
3. Ask 1-2 qualifying questions naturally (not all at once)
4. Keep response under 150 words
5. Include a clear next step or call-to-action
6. Sign off as "Phil" from QWANYX

Generate a response that moves them toward the next stage in the buying journey.`;

    return prompt;
  }

  /**
   * Get strategy based on temperature
   */
  getStrategyForTemperature(temperature, signals) {
    const strategies = {
      cold: `
- Focus on building curiosity and rapport
- Share one compelling insight or statistic
- Avoid talking price or features in detail
- Goal: Get them to ask "how does it work?"`,
      
      warm: `
- Demonstrate understanding of their situation
- Share relevant case study or success metric
- Begin to position against alternatives
- Goal: Get them to ask about implementation or pricing`,
      
      hot: `
- Address specific concerns directly
- Provide clear pricing/timeline
- Offer social proof from similar customers
- Goal: Get commitment for next step (demo/trial/purchase)`
    };
    
    return strategies[temperature];
  }

  /**
   * Get appropriate qualification questions
   */
  getQualificationQuestions(signals, temperature) {
    const questions = [];
    
    // Only ask about unknowns
    if (!signals.budget && temperature !== 'cold') {
      questions.push("What kind of budget range are you working with for this solution?");
    }
    
    if (!signals.authority) {
      questions.push("Who else would be involved in evaluating this?");
    }
    
    if (!signals.need) {
      questions.push("What's driving your interest in exploring this now?");
    }
    
    if (!signals.timeline && temperature === 'hot') {
      questions.push("What's your ideal timeline for getting this in place?");
    }
    
    // Temperature-specific discovery
    if (temperature === 'cold') {
      questions.push("What's your biggest challenge with [relevant area] right now?");
    } else if (temperature === 'warm') {
      questions.push("How are you handling this currently?");
    }
    
    return questions.slice(0, 2).join('\n'); // Max 2 questions
  }

  /**
   * Generate follow-up sequence plan
   */
  generateFollowUpPlan(temperature, dayssSinceLastContact) {
    const plans = {
      cold: {
        1: "Send educational content",
        3: "Share case study",
        7: "Invite to webinar",
        14: "Check in with value prop"
      },
      warm: {
        1: "Send requested information",
        2: "Follow up with additional resources",
        5: "Propose discovery call",
        10: "Share ROI calculator"
      },
      hot: {
        0: "Send proposal/quote",
        1: "Follow up on proposal",
        3: "Address concerns call",
        5: "Final follow-up with deadline"
      }
    };
    
    return plans[temperature];
  }
}

module.exports = SalesPersonalityPrompt;