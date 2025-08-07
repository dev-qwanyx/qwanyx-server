# Personal-Cash MongoDB Migration Plan

## Overview
Migrate Personal-Cash from SQLite to MongoDB using the existing MongoDB API infrastructure.

## Current State
- SQLite database with SQLAlchemy ORM
- Flask application on local development
- Models: Creditor, Debt, Payment, Income, Transaction, PlannedPayment

## Target State
- MongoDB database (port 27017)
- Flask API wrapper (port 5001 or new port)
- Enhanced financial management system with new features

## MongoDB Schema Design

### 1. accounts Collection
- Track multiple bank accounts, cash, credit cards
- Real-time balance tracking
- Support for multiple currencies

### 2. counterparties Collection
- Unified vendors, customers, and personal contacts
- Replaces current Creditor model
- Enhanced with tags and contact info

### 3. transactions Collection
- Unified income/expense/transfer tracking
- VAT calculation support
- Attachment support for invoices/receipts
- Status workflow (pending → completed)

### 4. categories Collection
- Hierarchical expense/income categorization
- Budget tracking per category
- Visual representation with colors/icons

### 5. budgets Collection
- Monthly/yearly budget planning
- Category-wise budget allocation
- Actual vs planned tracking

### 6. recurring_templates Collection
- Automated recurring transaction creation
- Flexible frequency options
- Template-based approach

## Migration Steps

### Phase 1: Database Setup
1. Create new MongoDB database: `personal_cash_db`
2. Design and create collections with indexes
3. Set up MongoDB API endpoints

### Phase 2: Data Migration
1. Export existing SQLite data
2. Transform data to new MongoDB schema:
   - Creditor → counterparties
   - Debt + Payment → transactions
   - Income → transactions (type: income)
   - PlannedPayment → recurring_templates
3. Import transformed data to MongoDB

### Phase 3: Application Update
1. Create MongoDB data access layer
2. Replace SQLAlchemy models with MongoDB queries
3. Update Flask routes to use new data layer
4. Maintain backward compatibility during transition

### Phase 4: New Features
1. Implement multi-account support
2. Add budget tracking
3. Create category management
4. Build recurring transaction engine

### Phase 5: Testing & Deployment
1. Unit tests for data access layer
2. Integration tests for API endpoints
3. UI testing for all workflows
4. Performance testing
5. Deployment with rollback plan

## Benefits of New Architecture
- Scalability: MongoDB handles large transaction volumes
- Flexibility: Schema-less design for easy feature additions
- Performance: Better query performance for analytics
- Integration: Follows Digital Human architecture patterns
- Future-proof: Ready for AI-powered financial insights

## Risk Mitigation
- Keep SQLite backup for rollback
- Parallel run period with data validation
- Comprehensive testing at each phase
- User acceptance testing before full migration