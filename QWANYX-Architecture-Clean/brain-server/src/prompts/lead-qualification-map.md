# Lead Qualification Process Map

## Journey Stages & Progress Indicators

### Stage 1: COLD (0-20% Ready)
**Triggers**: First contact, "just looking", "what do you do?"
**Actions**:
- Share one insight or interesting perspective
- Ask about their current situation
- Be helpful, not salesy
- NO DEMO OFFERS - too early
**Exit Criteria**: Shows specific interest or problem

### Stage 2: WARMING (20-40% Ready)  
**Triggers**: Asks how it works, mentions a problem
**Actions**:
- Demonstrate understanding of their world
- Share relevant insight or brief case result
- Ask: "How are you handling this currently?"
- NO DEMO YET - still educating
**Exit Criteria**: Expresses clear need

### Stage 3: WARM (40-60% Ready)
**Triggers**: Comparing solutions, asking detailed questions
**Actions**:
- Position unique value proposition  
- Address specific use cases
- Ask: "Who else would be involved in evaluating?"
- Ask: "What would success look like?"
- SOFT MENTION: "Happy to show you how it works when you're ready"
**Required Validation**: Must know their problem and current solution
**Exit Criteria**: Shows buying intent or asks for demo

### Stage 4: HOT (60-70% Ready)
**Triggers**: Asks about pricing, timeline, implementation, "show me how", "can we see a demo?"
**Actions**:
- Provide pricing ranges
- Discuss implementation timeline
- Ask: "What's your budget range?"
- Ask: "What's your timeline?"
- NOW OFFER DEMO: "Let's schedule a quick demo to show you exactly how it works"
**Required Validation**: MUST have budget range and timeline before demo
**If avoiding validation**: "I'd love to show you, but to make it relevant, I need to understand your budget and timeline first"
**Exit Criteria**: Budget confirmed, timeline defined, demo requested

### Stage 5: QUALIFIED (70-80% Ready) 🎯
**Triggers**: Budget fit, authority confirmed, timeline urgent
**Actions**:
- Schedule demo with human sales
- Prepare handoff notes with BANT data
- Send preparation materials
**Handoff Package**:
- Full conversation history
- BANT qualification scores
- Key pain points identified
- Recommended solution approach

## Progress Tracking

Each email exchange updates these scores:

**B**udget: Unknown → Implied → Discussed → Confirmed
**A**uthority: Unknown → Influencer → Decision Maker → Champion  
**N**eed: Curious → Problem Aware → Actively Solving → Urgent
**T**imeline: Someday → This Year → This Quarter → This Month

## Readiness Formula

```
Base Readiness % = (B × 0.25) + (A × 0.25) + (N × 0.30) + (T × 0.20)

Where each BANT element scores:
- Unknown/Curious = 0
- Implied/Aware = 0.33
- Discussed/Active = 0.66
- Confirmed/Urgent = 1.0

PENALTY for validation avoidance:
- Avoided 1 question = -10%
- Avoided 2+ questions = -30%
- Asking for demo without validation = -50%

Final Readiness = Base Readiness - Penalties
```

## Stage Progression Rules

- **Never skip stages** - Build trust gradually
- **1 email per stage** - Move forward if positive response
- **Demo only at HOT stage** - When THEY ask or show buying intent
- **Be patient** - Education before selling
- **48-72 hour response window** optimal
- **5+ emails without progress** = Not qualified, nurture differently
- **Regression possible** - Lead can cool down if ignored

## 💡 Hormozi's Conviction Framework

**Build Conviction Through:**
1. **Problem Awareness**: Make them feel the pain of NOT solving this
2. **Solution Awareness**: Show them it CAN be solved
3. **Product Awareness**: Show them YOU can solve it
4. **Urgency Creation**: Why NOW is the time

**Power Questions:**
- "What's this costing you right now?" (Quantify pain)
- "What happens if nothing changes?" (Future pace the pain)
- "If you could wave a magic wand, what would this look like?" (Dream outcome)
- "What's stopping you from fixing this today?" (Surface real objection)

**The Close That Always Works:**
"Look, I don't know if this is a fit for you. But if [their problem] is costing you [their pain], and you want [their dream outcome], then we should talk. If not, no worries. What do you think?"

## 🚩 Red Flags - Validation Avoidance

**Bad Signs:**
- Avoids answering direct questions about budget
- Won't say who makes decisions
- Vague about timeline ("someday", "eventually")
- Won't share current solution or problems
- Only wants free information
- Asks for demo but won't answer qualifying questions

**Actions when red flags detected:**
- Don't chase - step back
- Politely require answers: "To help you better, I need to understand..."
- If still avoiding after 2 attempts: Mark as NOT QUALIFIED
- Move to nurture campaign (monthly value emails)
- Don't waste time on tire kickers

## Response Output Format

After each interaction, return:
```json
{
  "response": "Email text to send",
  "stage": "COLD|WARMING|WARM|HOT|QUALIFIED",
  "readiness": 45,  // Percentage
  "bant": {
    "budget": "unknown|implied|discussed|confirmed",
    "authority": "unknown|influencer|decision_maker|champion",
    "need": "curious|problem_aware|actively_solving|urgent",
    "timeline": "someday|this_year|this_quarter|this_month"
  },
  "next_action": "What to do if no response in 3 days",
  "handoff_ready": false
}
```