from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import os

app = Flask(__name__)
CORS(app)

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
DB_NAME = os.getenv('DB_NAME', 'digital_human_cash')

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

# Collections
accounts = db.accounts
counterparties = db.counterparties
transactions = db.transactions
categories = db.categories
budgets = db.budgets
recurring_templates = db.recurring_templates

# Helper function to serialize MongoDB documents
def serialize_doc(doc):
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(d) for d in doc]
    if isinstance(doc, dict):
        for key in doc:
            if isinstance(doc[key], ObjectId):
                doc[key] = str(doc[key])
            elif isinstance(doc[key], datetime):
                doc[key] = doc[key].isoformat()
            elif isinstance(doc[key], dict) or isinstance(doc[key], list):
                doc[key] = serialize_doc(doc[key])
    return doc

# Generic CRUD endpoints
@app.route('/api/<collection>', methods=['GET'])
def get_all(collection):
    try:
        coll = db[collection]
        docs = list(coll.find())
        return jsonify(serialize_doc(docs))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/<collection>/<id>', methods=['GET'])
def get_one(collection, id):
    try:
        coll = db[collection]
        doc = coll.find_one({'_id': ObjectId(id)})
        if doc:
            return jsonify(serialize_doc(doc))
        return jsonify({'error': 'Not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/<collection>', methods=['POST'])
def create(collection):
    try:
        coll = db[collection]
        data = request.json
        
        # Add timestamps
        data['created_at'] = datetime.utcnow()
        data['updated_at'] = datetime.utcnow()
        
        result = coll.insert_one(data)
        return jsonify({'id': str(result.inserted_id)}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/<collection>/<id>', methods=['PUT'])
def update(collection, id):
    try:
        coll = db[collection]
        data = request.json
        data['updated_at'] = datetime.utcnow()
        
        result = coll.update_one(
            {'_id': ObjectId(id)},
            {'$set': data}
        )
        
        if result.matched_count:
            return jsonify({'message': 'Updated successfully'})
        return jsonify({'error': 'Not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/<collection>/<id>', methods=['DELETE'])
def delete(collection, id):
    try:
        coll = db[collection]
        result = coll.delete_one({'_id': ObjectId(id)})
        
        if result.deleted_count:
            return jsonify({'message': 'Deleted successfully'})
        return jsonify({'error': 'Not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Specialized endpoints for Personal-Cash functionality

@app.route('/api/accounts/balance/<account_id>', methods=['GET'])
def get_account_balance(account_id):
    """Calculate current balance based on transactions"""
    try:
        account = accounts.find_one({'_id': ObjectId(account_id)})
        if not account:
            return jsonify({'error': 'Account not found'}), 404
        
        # Calculate balance from transactions
        pipeline = [
            {'$match': {'account_id': ObjectId(account_id), 'status': 'completed'}},
            {'$group': {
                '_id': '$type',
                'total': {'$sum': '$amount'}
            }}
        ]
        
        results = list(transactions.aggregate(pipeline))
        
        income = 0
        expenses = 0
        for result in results:
            if result['_id'] == 'income':
                income = result['total']
            elif result['_id'] == 'expense':
                expenses = result['total']
        
        balance = account.get('initial_balance', 0) + income - expenses
        
        return jsonify({
            'account_id': account_id,
            'balance': balance,
            'income': income,
            'expenses': expenses
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/transactions/pending', methods=['GET'])
def get_pending_transactions():
    """Get all pending transactions"""
    try:
        pending = list(transactions.find({'status': 'pending'}))
        return jsonify(serialize_doc(pending))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/budgets/current', methods=['GET'])
def get_current_budget():
    """Get current month's budget with actual vs planned"""
    try:
        now = datetime.utcnow()
        current_budget = budgets.find_one({
            'start_date': {'$lte': now},
            'end_date': {'$gte': now}
        })
        
        if not current_budget:
            return jsonify({'error': 'No active budget found'}), 404
        
        # Calculate actual amounts per category
        start = current_budget['start_date']
        end = current_budget['end_date']
        
        pipeline = [
            {
                '$match': {
                    'status': 'completed',
                    'dates.completed': {'$gte': start, '$lte': end}
                }
            },
            {
                '$group': {
                    '_id': '$category_id',
                    'actual_amount': {'$sum': '$amount'}
                }
            }
        ]
        
        actuals = {str(r['_id']): r['actual_amount'] for r in transactions.aggregate(pipeline)}
        
        # Update budget with actuals
        for cat in current_budget.get('categories', []):
            cat_id = str(cat['category_id'])
            cat['actual_amount'] = actuals.get(cat_id, 0)
        
        return jsonify(serialize_doc(current_budget))
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/recurring/process', methods=['POST'])
def process_recurring():
    """Process due recurring transactions"""
    try:
        now = datetime.utcnow()
        due_templates = list(recurring_templates.find({
            'active': True,
            'next_due': {'$lte': now}
        }))
        
        created = []
        for template in due_templates:
            # Create transaction from template
            transaction = template['template_transaction'].copy()
            transaction['created_at'] = now
            transaction['status'] = 'pending'
            
            result = transactions.insert_one(transaction)
            created.append(str(result.inserted_id))
            
            # Update next due date
            if template['frequency'] == 'monthly':
                next_due = template['next_due']
                next_due = datetime(next_due.year, next_due.month + 1, next_due.day)
            elif template['frequency'] == 'weekly':
                next_due = template['next_due'] + timedelta(days=7)
            elif template['frequency'] == 'yearly':
                next_due = template['next_due'].replace(year=template['next_due'].year + 1)
            
            recurring_templates.update_one(
                {'_id': template['_id']},
                {'$set': {'next_due': next_due}}
            )
        
        return jsonify({
            'message': f'Created {len(created)} recurring transactions',
            'transaction_ids': created
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/init-collections', methods=['POST'])
def init_collections():
    """Initialize collections with indexes"""
    try:
        # Create indexes
        accounts.create_index('name', unique=True)
        counterparties.create_index('name')
        transactions.create_index([('status', 1), ('dates.due', 1)])
        transactions.create_index('account_id')
        transactions.create_index('category_id')
        categories.create_index('name')
        budgets.create_index([('start_date', 1), ('end_date', 1)])
        recurring_templates.create_index([('active', 1), ('next_due', 1)])
        
        return jsonify({'message': 'Collections initialized successfully'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5011))
    app.run(debug=True, port=port)