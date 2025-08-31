# GTD Processing Loop Specification - Speed Optimized

## User Context
- **Location**: 25/11 rue de Fragnée, 4000 Liège, Belgique
- **Country**: Belgique (pas de préfecture, utiliser DIV pour véhicules)
- **Important**: Pour les procédures administratives, toujours considérer le contexte belge

## Overview
A rapid-fire GTD processing system optimized for speed through automation and delegation. Claude acts as the GTD processor with a focus on immediate action decisions.

## Core Process Flow

### 1. Rapid Processing Loop
```
For each item in IN folder:
    1. Quick scan and present item
    2. Immediate triage: DO IT NOW / POSTPONE / DELEGATE / AUTOMATE
    3. Execute decision immediately
    4. Next item (no dwelling)
```

### 2. Primary Decision Matrix

```
ACTIONABLE ITEM?
├── DO IT NOW (< 5 minutes)
│   ├── Can Claude do it? → AUTOMATE (execute script/command)
│   ├── Manual task → User does it immediately
│   └── Mark complete → Next item
│
├── DELEGATE
│   ├── To person → Create delegation record + notification
│   ├── To AI/script → Create automation task
│   └── To service → Queue for external processing
│
├── POSTPONE
│   ├── Scheduled (has deadline) → Calendar + reminder
│   ├── Project (multiple steps) → Break down + schedule first action
│   └── Someday/Maybe → Low priority queue
│
└── NOT ACTIONABLE
    ├── Reference → Auto-file by type/tags
    ├── Trash → Delete immediately
    └── Waiting → Track with auto-follow-up
```

### 3. Speed Rules
- **2-Second Decision Rule**: Categorize within 2 seconds
- **No Double Handling**: Touch once, decide, move on
- **Batch Similar Items**: Group and process in batches
- **Automate Recurring**: If seen before, auto-process

## Helper Scripts Structure

### 1. `gtd_inbox.py`
- Lightning-fast inbox scanner
- Pattern recognition for auto-categorization
- Batch processing support

### 2. `gtd_automator.py`
- Execution engine for automated tasks
- Script runner for common actions
- API integrations for delegation

### 3. `gtd_data.py`
- Lightweight data store (JSON)
- Quick access caching
- Auto-archival of completed items

### 4. `gtd_patterns.py`
- Learning system for recurring items
- Auto-response templates
- Decision history for speed optimization

## Core Principle: Everything Must Be Linked

**RÈGLE ABSOLUE**: Aucun document orphelin. Tout doit être rattaché à:
- Une catégorie (organisation thématique)
- Un contact (qui est concerné)
- Une ou plusieurs tâches (si actionnable)

## Data Structure

```json
{
  "inbox": [
    {
      "id": "unique_id",
      "name": "item_name",
      "content_preview": "first_100_chars",
      "date_added": "timestamp",
      "category": "Finance/Luminus",
      "contact": "service@luminus.be",
      "auto_category": "predicted_category",
      "pattern_match": "known_pattern_id"
    }
  ],
  "do_now": [
    {
      "id": "action_id",
      "action": "specific_action",
      "automation_possible": true,
      "script": "script_to_run",
      "time_estimate": "minutes",
      "completed": "timestamp"
    }
  ],
  "delegated": [
    {
      "id": "delegation_id",
      "task": "task_description",
      "delegated_to": "person|service|ai",
      "method": "email|api|script",
      "status": "sent|acknowledged|completed",
      "follow_up": "timestamp",
      "auto_reminder": true
    }
  ],
  "postponed": [
    {
      "id": "postponed_id",
      "item": "description",
      "reason": "waiting|scheduled|low_priority",
      "next_review": "timestamp",
      "energy_required": "high|medium|low",
      "context": "@computer|@phone|@thinking|@errands",
      "batch_group": "group_id"
    }
  ],
  "patterns": [
    {
      "id": "pattern_id",
      "trigger": "regex_or_keywords",
      "auto_decision": "do_now|delegate|postpone|trash",
      "auto_action": "script_or_template",
      "confidence": 0.95,
      "times_used": 42
    }
  ],
  "automation_templates": [
    {
      "id": "template_id",
      "name": "template_name",
      "trigger_type": "file_type|content|sender",
      "actions": ["step1", "step2"],
      "last_used": "timestamp"
    }
  ]
}
```

## Rapid Processing Conversation Flow

### Lightning Round Format
```
Claude: "[ITEM]: meeting_notes.txt"
Claude: "DO NOW / POSTPONE / DELEGATE / TRASH?"
User: "postpone"
Claude: "When?" 
User: "friday"
Claude: "✓ Scheduled. NEXT: [ITEM]: invoice.pdf"
```

### Automation Detection
```
Claude: "[ITEM]: weekly_report.doc - I can auto-generate this"
Claude: "AUTOMATE?"
User: "yes"
Claude: "✓ Running script... Done. NEXT: [ITEM]"
```

### Batch Processing
```
Claude: "Found 5 similar emails about [topic]"
Claude: "BATCH PROCESS: Archive all?"
User: "delegate to sarah"
Claude: "✓ All 5 delegated. NEXT: [ITEM]"
```

### Quick Decisions via Shortcuts
```
User inputs:
- "1" or "now" = DO IT NOW
- "2" or "later" = POSTPONE  
- "3" or "delegate" = DELEGATE
- "4" or "trash" = DELETE
- "5" or "ref" = REFERENCE
- "batch" = process similar items together
- "auto" = let Claude decide based on patterns
```

## Folder Structure - Category Based
```
E:\MOI-GTD\
├── IN\                    # Inbox - unprocessed items
├── Categories\            # All organized content
│   ├── Finance\
│   │   ├── Luminus\      # Emails, docs, tasks about Luminus
│   │   ├── Banque\
│   │   └── Impots\
│   ├── Famille\
│   │   ├── Ecole\
│   │   └── Sante\
│   ├── Travail\
│   │   ├── Qwanyx\
│   │   └── Pixanima\
│   └── Maison\
│       ├── Utilities\
│       └── Travaux\
├── Contacts\              # All contacts with their emails
│   └── [email]\
│       ├── contact.json
│       ├── emails\
│       └── attachments\
├── Archive\               # Completed items
├── scripts\               # Python helper scripts
└── data\                 # JSON data files
```

## Implementation Approach

1. **No UI Required**: All interaction happens through Claude-user conversation
2. **Script-Assisted**: Claude uses Python scripts to:
   - Scan and list inbox items
   - Store processed decisions
   - Track actions and projects
   - Generate reports

3. **Conversation-Driven**: User provides input through natural language, Claude interprets and executes GTD methodology

## Inbox Processing with Deduplication

### First Step: Check for Existing Items

Before adding any item from IN/ to the database, ALWAYS check if it already exists somewhere in the system.

```python
def scan_inbox_with_deduplication():
    """
    Scan IN folder but check for existing items first
    """
    items_to_add = []
    
    for file_path in Path("E:\\MOI-GTD\\IN").iterdir():
        if file_path.is_file():
            # Step 1: Check if file already exists in database
            existing = check_if_exists(file_path)
            
            if existing:
                # File already has a task/entry
                print(f"⚠️ {file_path.name} already exists in {existing['collection']}")
                
                # Check if it should be in IN/
                if existing['collection'] != 'inbox':
                    # This is an orphan! File should have been moved
                    print(f"  → Orphan detected! Should be in {existing.get('category', 'unknown')}")
                    recover_orphan_document(existing)
            else:
                # New item, add to inbox
                items_to_add.append(create_inbox_item(file_path))
    
    return items_to_add

def check_if_exists(file_path):
    """
    Check all collections for this file
    """
    filename = file_path.name
    filepath_str = str(file_path)
    
    # Check all collections
    for collection in ["inbox", "do_now", "postponed", "delegated", "projects", "reference"]:
        items = db.list_items(collection)
        
        for item in items:
            # Match by multiple criteria
            if (item.get("name") == filename or 
                item.get("file_path") == filepath_str or
                item.get("source_file") == filepath_str or
                item.get("linked_document", {}).get("source_file") == filepath_str):
                
                return {
                    "item": item,
                    "collection": collection,
                    "id": item["id"]
                }
    
    return None
```

## Document Orphan Recovery Process

### Problem: Document with Task but Not Properly Filed

When a task exists in the database but its associated document is still in IN/ or missing category/links, the system must recover and properly file the document.

### Recovery Algorithm

#### 1. Detection Phase
```python
def detect_orphan_documents():
    """
    Identify documents that have tasks but aren't properly filed
    """
    orphans = []
    
    # Check all collections (do_now, postponed, projects, delegated)
    for collection in ["do_now", "postponed", "projects", "delegated"]:
        items = db.list_items(collection)
        for item in items:
            # Document is orphan if:
            # - No archived_path OR
            # - archived_path doesn't exist OR
            # - File still in IN/ folder
            if not item.get("archived_path") or \
               not Path(item.get("archived_path", "")).exists() or \
               "\\IN\\" in item.get("file_path", ""):
                orphans.append({
                    "item": item,
                    "collection": collection,
                    "reason": determine_orphan_reason(item)
                })
    
    return orphans
```

#### 2. Category Determination
```python
def determine_category_for_orphan(item, task_info):
    """
    Smart category detection for orphan documents
    Priority order:
    1. Existing category in task
    2. Linked_document category
    3. Analysis of task action/description
    4. Analysis of filename
    5. Default fallback
    """
    
    # Priority 1: Explicit category
    if item.get("category"):
        return item["category"]
    
    # Priority 2: From linked_document
    if item.get("linked_document", {}).get("category"):
        return item["linked_document"]["category"]
    
    # Priority 3: Analyze task action
    action = item.get("action", "").lower()
    
    # Medical/Health
    if any(word in action for word in ["ordonnance", "médecin", "medikinet", "pharmacie"]):
        return "Famille/Sante"
    
    # Transport
    if any(word in action for word in ["tec", "sncb", "voiture", "véhicule", "permis"]):
        return "Transport/General"
    
    # Finance
    if any(word in action for word in ["facture", "payer", "€", "invoice", "payment"]):
        # Try to extract company name
        if "luminus" in action: return "Finance/Luminus"
        if "proximus" in action: return "Finance/Proximus"
        return "Finance/General"
    
    # Work/Business
    if any(word in action for word in ["qwanyx", "pixanima", "pitch", "business"]):
        if "qwanyx" in action: return "Travail/Qwanyx"
        if "pixanima" in action: return "Travail/Pixanima"
        return "Travail/General"
    
    # Priority 4: Analyze filename
    if item.get("name"):
        name = item["name"].lower()
        if "carte tec" in name: return "Transport/TEC"
        if "ordonnance" in name: return "Sante/Ordonnances"
        if "facture" in name or "invoice" in name: return "Finance/Factures"
        if "contrat" in name: return "Travail/Contrats"
    
    # Priority 5: Default
    return "Divers/NonClasse"
```

#### 3. File Recovery Process
```python
def recover_orphan_document(orphan_info):
    """
    Complete recovery process for an orphan document
    """
    item = orphan_info["item"]
    collection = orphan_info["collection"]
    
    # Step 1: Find the actual file
    file_path = find_document_file(item)
    if not file_path:
        log_error(f"Cannot find file for {item['id']}")
        return False
    
    # Step 2: Determine category
    category = determine_category_for_orphan(item, task_info)
    
    # Step 3: Extract/determine contact
    contact = item.get("contact") or \
              item.get("linked_document", {}).get("contact") or \
              extract_contact_from_action(item.get("action", "")) or \
              "unknown"
    
    # Step 4: Create category folder if needed
    category_path = ensure_category(category)
    
    # Step 5: Move file to category
    archived_path = archive_file(file_path, category)
    
    # Step 6: Update task with complete linkage
    updates = {
        "archived_path": archived_path,
        "category": category,
        "contact": contact,
        "linked_document": {
            "source_file": file_path,
            "source_name": Path(file_path).name,
            "source_id": item["id"],
            "category": category,
            "contact": contact,
            "archived_at": datetime.now().isoformat()
        }
    }
    
    db.update_item(collection, item["id"], updates)
    
    # Step 7: Create .links.json in category folder
    create_category_links(category, item["id"], contact, archived_path)
    
    # Step 8: Log recovery
    log_recovery(f"Recovered: {item['name']} → {category}")
    
    return True
```

#### 4. Contact Extraction Helper
```python
def extract_contact_from_action(action):
    """
    Try to extract contact name from action description
    """
    action_lower = action.lower()
    
    # Look for patterns like "à Alain", "with Sarah", "pour Dr Martin"
    patterns = [
        r"à (\w+)",           # French: à Alain
        r"pour (\w+)",        # French: pour Marie
        r"avec (\w+)",        # French: avec Pierre
        r"dr\.? (\w+)",       # Doctor names
        r"chez (\w+)",        # French: chez le médecin
    ]
    
    for pattern in patterns:
        match = re.search(pattern, action_lower)
        if match:
            return match.group(1).capitalize()
    
    return None
```

### Automated Recovery Execution

#### Run Recovery on Startup
```python
def gtd_startup_check():
    """
    Run this check every time GTD system starts
    """
    print("🔍 Checking for orphan documents...")
    
    orphans = detect_orphan_documents()
    
    if orphans:
        print(f"⚠️ Found {len(orphans)} orphan documents")
        
        for orphan in orphans:
            print(f"  Recovering: {orphan['item']['name']}")
            success = recover_orphan_document(orphan)
            if success:
                print(f"  ✅ Recovered successfully")
            else:
                print(f"  ❌ Recovery failed - manual intervention needed")
    else:
        print("✅ No orphan documents found")
```

### Complete Processing Workflow

```python
def process_inbox_complete():
    """
    Complete inbox processing with deduplication and orphan recovery
    """
    print("🔍 Starting complete inbox processing...")
    
    # Phase 1: Check for orphans in existing database
    print("\n📋 Phase 1: Checking for orphaned documents...")
    orphans = detect_orphan_documents()
    if orphans:
        print(f"Found {len(orphans)} orphans to recover")
        for orphan in orphans:
            recover_orphan_document(orphan)
    
    # Phase 2: Scan IN/ folder with deduplication
    print("\n📥 Phase 2: Scanning IN folder...")
    files_in_inbox = list(Path("E:\\MOI-GTD\\IN").glob("*"))
    
    for file_path in files_in_inbox:
        if file_path.is_file():
            # Check if already processed
            existing = check_if_exists(file_path)
            
            if existing:
                print(f"\n⚠️ {file_path.name} already has task in {existing['collection']}")
                
                if existing['collection'] != 'inbox':
                    # File should have been moved!
                    print(f"  → Moving to {existing['item'].get('category', 'Divers/NonClasse')}")
                    
                    # Move the file now
                    category = existing['item'].get('category', 'Divers/NonClasse')
                    archived_path = archive_file(str(file_path), category)
                    
                    # Update the task
                    db.update_item(existing['collection'], existing['id'], {
                        'archived_path': archived_path
                    })
            else:
                # New item - add to inbox for processing
                print(f"\n✨ New item: {file_path.name}")
                add_to_inbox(file_path)
    
    # Phase 3: Process inbox items
    print("\n⚡ Phase 3: Processing inbox items...")
    process_all_inbox_items()
    
    # Phase 4: Verify IN/ is empty
    print("\n✅ Phase 4: Final verification...")
    remaining = list(Path("E:\\MOI-GTD\\IN").glob("*"))
    if remaining:
        print(f"⚠️ Warning: {len(remaining)} files still in IN/")
        for f in remaining:
            print(f"  - {f.name}")
    else:
        print("✅ IN folder is empty - Inbox Zero achieved!")
```

### Manual Recovery Commands

```python
# Check for orphans
python gtd_loop.py check-orphans

# Recover all orphans automatically
python gtd_loop.py recover-orphans

# Recover specific item
python gtd_loop.py recover-item [item_id]

# Verify all links are valid
python gtd_loop.py verify-links

# Complete processing with deduplication
python gtd_loop.py process-complete
```

### Edge Cases Handled

1. **File moved manually**: System searches all folders to find it
2. **Duplicate filenames**: Adds timestamp to avoid conflicts
3. **Category doesn't exist**: Creates full path automatically
4. **Contact unknown**: Uses "unknown" but keeps task functional
5. **File deleted**: Logs error but keeps task with note "FILE_MISSING"

### Prevention Strategy

To prevent orphans from occurring:

1. **Never create task without filing document** - Atomic operation
2. **Validate links on every access** - Self-healing system
3. **Background job** - Runs every hour to check consistency
4. **Pre-commit hook** - Verify no orphans before processing new items

## Next Steps
1. Create folder structure
2. Implement helper scripts with recovery functions
3. Initialize data storage
4. Run orphan recovery check
5. Begin processing items from IN folder

## Usage Examples

### Speed Run
```
User: "Process inbox - speed mode"
Claude: "12 items found. Starting rapid fire:"
Claude: "[1/12] Budget.xlsx"
User: "2" (postpone)
Claude: "When?"
User: "monday"
Claude: "[2/12] Team update email"
User: "3 john" (delegate to john)
Claude: "[3/12] API docs.pdf"  
User: "5" (reference)
Claude: "[4-8/12] 5 newsletter emails - BATCH?"
User: "4" (trash all)
...
Claude: "DONE! 12 items in 47 seconds"
```

### Automation Example
```
User: "Process"
Claude: "[AUTO] Recognized pattern: Monthly report → Generating..."
Claude: "[AUTO] 3 receipts → Filed to Finance/2024"
Claude: "[DECISION NEEDED] New project proposal.doc"
User: "1" (do now)
Claude: "I'll create a project breakdown. Title?"
User: "Website redesign"
Claude: "✓ Project created with 5 next actions"
```

### Delegation Flow
```
Claude: "Contract review needed"
User: "delegate"
Claude: "To whom? (or 'ai' for Claude to handle)"
User: "ai"
Claude: "I'll review for: 1) Key terms 2) Risks 3) Deadlines. OK?"
User: "yes"
Claude: "✓ Review complete. 3 issues flagged. See summary?"
```