/**
 * Chinese Semantic Encoder
 * Ultra-dense semantic encoding using Chinese characters
 * Each character represents a complete concept
 */
export class ChineseSemanticEncoder {
  // Semantic vocabulary with categories
  private static readonly VOCABULARY = {
    // Urgency & Priority
    urgent: '急',      // jí - urgent/emergency
    important: '重',   // zhòng - important/heavy
    critical: '危',    // wēi - critical/danger
    priority: '先',    // xiān - priority/first
    
    // Communication
    question: '问',    // wèn - question/ask
    answer: '答',      // dá - answer/reply
    request: '请',     // qǐng - request/please
    confirm: '确',     // què - confirm/certain
    invite: '邀',      // yāo - invite
    remind: '醒',      // xǐng - remind/wake
    announce: '告',    // gào - announce/tell
    discuss: '论',     // lùn - discuss/theory
    
    // Business & Finance
    money: '钱',       // qián - money
    payment: '付',     // fù - payment/pay
    invoice: '票',     // piào - invoice/ticket
    contract: '约',    // yuē - contract/agreement
    budget: '预',      // yù - budget/forecast
    price: '价',       // jià - price/value
    profit: '利',      // lì - profit/benefit
    cost: '费',        // fèi - cost/expense
    
    // Project & Work
    project: '项',     // xiàng - project/item
    task: '务',        // wù - task/business
    deadline: '限',    // xiàn - deadline/limit
    milestone: '标',   // biāo - milestone/marker
    deliver: '交',     // jiāo - deliver/hand over
    complete: '完',    // wán - complete/finish
    progress: '进',    // jìn - progress/advance
    
    // Time
    today: '今',       // jīn - today/now
    tomorrow: '明',    // míng - tomorrow/bright
    yesterday: '昨',   // zuó - yesterday
    week: '周',        // zhōu - week/cycle
    month: '月',       // yuè - month/moon
    year: '年',        // nián - year
    time: '时',        // shí - time/hour
    
    // Actions
    review: '查',      // chá - review/check
    approve: '批',     // pī - approve/batch
    send: '送',        // sòng - send/deliver
    receive: '收',     // shōu - receive/collect
    create: '创',      // chuàng - create/start
    change: '改',      // gǎi - change/modify
    delete: '删',      // shān - delete/remove
    save: '存',        // cún - save/store
    
    // People & Relations
    person: '人',      // rén - person/human
    team: '队',        // duì - team/group
    client: '客',      // kè - client/guest
    manager: '管',     // guǎn - manager/manage
    employee: '员',    // yuán - employee/member
    partner: '伴',     // bàn - partner/companion
    
    // States & Conditions
    new: '新',         // xīn - new/fresh
    old: '旧',         // jiù - old/former
    good: '好',        // hǎo - good/well
    bad: '坏',         // huài - bad/broken
    success: '成',     // chéng - success/become
    fail: '败',        // bài - fail/defeat
    wait: '等',        // děng - wait/equal
    ready: '备',       // bèi - ready/prepare
    
    // Objects & Concepts
    document: '文',    // wén - document/text
    data: '数',        // shù - data/number
    report: '报',      // bào - report/news
    meeting: '会',     // huì - meeting/can
    email: '邮',       // yóu - email/mail
    file: '档',        // dàng - file/record
    system: '系',      // xì - system/series
    
    // Logical & Abstract
    think: '思',       // sī - think/thought
    decide: '定',      // dìng - decide/fixed
    plan: '计',        // jì - plan/calculate
    strategy: '策',    // cè - strategy/policy
    goal: '标',        // biāo - goal/target
    problem: '题',     // tí - problem/topic
    solution: '解',    // jiě - solution/solve
    idea: '意',        // yì - idea/meaning
    
    // Generic fallback
    memory: '忆',      // yì - memory/remember
    thing: '物',       // wù - thing/object
    matter: '事'       // shì - matter/affair
  }
  
  // Reverse mapping for decoding
  private static readonly REVERSE_MAP = Object.entries(ChineseSemanticEncoder.VOCABULARY)
    .reduce((acc, [key, value]) => {
      acc[value] = key
      return acc
    }, {} as Record<string, string>)
  
  /**
   * Encode concepts to Chinese characters
   */
  static encode(concepts: string[]): string {
    const encoded = concepts
      .map(concept => {
        const normalized = concept.toLowerCase().trim()
        return this.VOCABULARY[normalized as keyof typeof this.VOCABULARY] || 
               this.findClosestMatch(normalized)
      })
      .filter(Boolean)
      .slice(0, 5)  // Maximum 5 characters
    
    return encoded.join('')
  }
  
  /**
   * Decode Chinese characters back to concepts
   */
  static decode(characters: string): string[] {
    return characters.split('').map(char => 
      this.REVERSE_MAP[char] || char
    )
  }
  
  /**
   * Find closest semantic match
   */
  private static findClosestMatch(concept: string): string {
    // Check for partial matches
    for (const [key, value] of Object.entries(this.VOCABULARY)) {
      if (key.includes(concept) || concept.includes(key)) {
        return value
      }
    }
    
    // Check for semantic similarity
    const semanticGroups: Record<string, string> = {
      // Money-related
      finance: '钱', cash: '钱', dollar: '钱', euro: '钱',
      // Time-related  
      now: '今', soon: '急', later: '后', before: '前',
      // Action-related
      make: '创', build: '创', write: '文', read: '查',
      // People-related
      user: '人', customer: '客', boss: '管', colleague: '员',
      // State-related
      pending: '等', done: '完', active: '进', blocked: '阻'
    }
    
    return semanticGroups[concept] || '事'  // Default to "matter/affair"
  }
  
  /**
   * Extract key concepts from text using GPT-5 Nano
   */
  static async extractConcepts(text: string, client: any): Promise<string[]> {
    try {
      const response = await client.responses.create({
        model: 'gpt-5-nano',
        reasoning: { effort: 'low' },
        max_tokens: 20,
        instructions: 'Extract 3-5 key concepts as single words',
        input: text
      })
      
      return response.output_text.split(/[,\s]+/).filter(Boolean)
    } catch {
      // Fallback to simple keyword extraction
      return this.simpleConceptExtraction(text)
    }
  }
  
  /**
   * Simple concept extraction without AI
   */
  private static simpleConceptExtraction(text: string): string[] {
    const concepts: string[] = []
    const lowerText = text.toLowerCase()
    
    // Check for known concepts
    for (const concept of Object.keys(this.VOCABULARY)) {
      if (lowerText.includes(concept)) {
        concepts.push(concept)
      }
    }
    
    // Check for urgency indicators
    if (lowerText.includes('asap') || lowerText.includes('urgent')) {
      concepts.push('urgent')
    }
    
    // Check for questions
    if (lowerText.includes('?')) {
      concepts.push('question')
    }
    
    return concepts.slice(0, 5)
  }
  
  /**
   * Calculate semantic density
   */
  static calculateDensity(original: string, encoded: string): number {
    const originalBytes = new TextEncoder().encode(original).length
    const encodedBytes = new TextEncoder().encode(encoded).length
    return 1 - (encodedBytes / originalBytes)
  }
  
  /**
   * Generate semantic fingerprint
   */
  static fingerprint(text: string): string {
    // Extract top concepts and encode
    const concepts = this.simpleConceptExtraction(text)
    return this.encode(concepts)
  }
  
  /**
   * Compare semantic similarity using Chinese encoding
   */
  static similarity(text1: string, text2: string): number {
    const fp1 = new Set(this.fingerprint(text1).split(''))
    const fp2 = new Set(this.fingerprint(text2).split(''))
    
    const intersection = new Set([...fp1].filter(x => fp2.has(x)))
    const union = new Set([...fp1, ...fp2])
    
    return intersection.size / union.size
  }
}

// Export for use in other modules
export const semanticEncode = ChineseSemanticEncoder.encode.bind(ChineseSemanticEncoder)
export const semanticDecode = ChineseSemanticEncoder.decode.bind(ChineseSemanticEncoder)
export const semanticFingerprint = ChineseSemanticEncoder.fingerprint.bind(ChineseSemanticEncoder)