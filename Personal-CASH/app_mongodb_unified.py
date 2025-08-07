from flask import Flask, render_template, request, redirect, url_for, jsonify, flash, Response
from pymongo import MongoClient, DESCENDING
from bson import ObjectId
from datetime import datetime, timedelta
from dateutil.relativedelta import relativedelta
from decimal import Decimal
import os
import re
import pdfplumber
from pathlib import Path
import qrcode
from io import BytesIO
import base64
import shutil

app = Flask(__name__)
app.config['SECRET_KEY'] = 'dev-secret-key'

# MongoDB connection
client = MongoClient('mongodb://localhost:27017/')
db = client['personal_cash']

# Collections
creditors = db.creditors
debts = db.debts
payments = db.payments
income = db.income
transactions = db.transactions
planned_payments = db.planned_payments

# Helper functions
def get_remaining_amount(debt_id):
    """Calculate remaining amount for a debt"""
    debt = debts.find_one({'_id': ObjectId(debt_id)})
    if not debt:
        return 0
    
    paid = 0
    for payment in payments.find({'debt_id': ObjectId(debt_id)}):
        paid += payment['amount']
    
    return debt['amount'] - paid

def is_debt_paid_off(debt_id):
    """Check if debt is paid off"""
    return get_remaining_amount(debt_id) <= 0

# Routes - keeping all existing routes but using MongoDB

@app.route('/')
def index():
    return redirect(url_for('unified_dashboard'))

@app.route('/creditors')
def creditors_list():
    all_creditors = list(creditors.find())
    return render_template('creditors.html', creditors=all_creditors)

@app.route('/add_creditor', methods=['GET', 'POST'])
def add_creditor():
    if request.method == 'POST':
        creditor_data = {
            'name': request.form['name'],
            'bank_name': request.form.get('bank_name'),
            'account_number': request.form.get('account_number'),
            'routing_number': request.form.get('routing_number'),
            'notes': request.form.get('notes'),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        creditors.insert_one(creditor_data)
        flash('Creditor added successfully!')
        return redirect(url_for('creditors_list'))
    return render_template('add_creditor.html')

@app.route('/unified')
def unified_dashboard():
    # Get all transactions ordered by display_order
    all_transactions = list(transactions.find().sort([('display_order', 1), ('due_date', 1)]))
    
    # Process transactions for display
    for trans in all_transactions:
        trans['id'] = str(trans['_id'])
        trans['remaining_amount'] = trans['amount']  # Simplified - assuming no partial payments
        trans['is_completed'] = trans['status'] == 'completed'
        trans['priority_payment'] = trans.get('priority_payment', False)
        trans['is_recurring'] = trans.get('is_recurring', False)
        trans['vat_percentage'] = trans.get('vat_percentage', 0)
    
    # Calculate totals
    payables = [t for t in all_transactions if t['type'] == 'payable']
    receivables = [t for t in all_transactions if t['type'] == 'receivable']
    
    # Pending transactions
    pending_payables = [t for t in payables if t['status'] == 'pending']
    pending_receivables = [t for t in receivables if t['status'] == 'pending']
    
    # Calculate amounts
    remaining_payables = sum(t['remaining_amount'] for t in pending_payables)
    remaining_receivables = sum(t['remaining_amount'] for t in pending_receivables)
    
    # Calculate current balance (completed receivables - completed payables)
    completed_receivables = sum(t['amount'] for t in receivables if t['status'] == 'completed')
    completed_payables = sum(t['amount'] for t in payables if t['status'] == 'completed')
    completed_balance = completed_receivables - completed_payables
    
    # Net position (what you'll have after all pending transactions)
    net_position = remaining_receivables - remaining_payables
    
    # Current balance (what you have now after completed transactions)
    current_balance = completed_balance
    
    # Get all creditors
    all_creditors = list(creditors.find())
    for cred in all_creditors:
        cred['id'] = str(cred['_id'])
    
    return render_template('unified_dashboard_modal.html',
                         transactions=all_transactions,
                         remaining_payables=remaining_payables,
                         remaining_receivables=remaining_receivables,
                         pending_payables_count=len(pending_payables),
                         pending_receivables_count=len(pending_receivables),
                         completed_balance=completed_balance,
                         net_position=net_position,
                         current_balance=current_balance,
                         creditors=all_creditors,
                         datetime=datetime,
                         timedelta=timedelta)

@app.route('/add_transaction', methods=['POST'])
def add_transaction():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('type'):
            return jsonify({'success': False, 'error': 'Transaction type is required'})
        if not data.get('amount'):
            return jsonify({'success': False, 'error': 'Amount is required'})
        if not data.get('counterparty_id'):
            return jsonify({'success': False, 'error': 'Counterparty is required'})
        
        # Handle new creditor if needed
        creditor_id = data.get('counterparty_id')
        if creditor_id == 'new':
            if not data.get('new_counterparty_name'):
                return jsonify({'success': False, 'error': 'New counterparty name is required'})
            creditor = {
                'name': data['new_counterparty_name'],
                'bank_name': '',
                'account_number': '',
                'routing_number': '',
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
            result = creditors.insert_one(creditor)
            creditor_id = str(result.inserted_id)
            creditor_name = data['new_counterparty_name']
        else:
            creditor = creditors.find_one({'_id': ObjectId(creditor_id)})
            if not creditor:
                return jsonify({'success': False, 'error': 'Creditor not found'})
            creditor_name = creditor['name']
        
        # Create transaction
        vat_percentage = float(data.get('vat_percentage', 0)) if data.get('vat_percentage') else 0
        is_recurring = data.get('is_recurring') == 'on'
        
        # Calculate total amount including VAT
        net_amount = float(data['amount'])
        vat_amount = net_amount * (vat_percentage / 100)
        total_amount = net_amount + vat_amount
        
        # For recurring transactions, set the first due date based on recurring day
        due_date = None
        if is_recurring and data.get('recurring_day'):
            today = datetime.now()
            recurring_day = int(data.get('recurring_day', 1))
            
            # Set to this month if day hasn't passed, otherwise next month
            if today.day <= recurring_day:
                due_date = today.replace(day=recurring_day)
            else:
                if today.month == 12:
                    due_date = datetime(today.year + 1, 1, recurring_day)
                else:
                    due_date = datetime(today.year, today.month + 1, recurring_day)
        elif data.get('due_date'):
            due_date = datetime.strptime(data['due_date'], '%Y-%m-%d')
        
        # Get the highest display_order
        highest_order = transactions.find_one(sort=[('display_order', -1)])
        next_order = (highest_order['display_order'] + 1) if highest_order and 'display_order' in highest_order else 0
        
        transaction = {
            'type': data['type'],
            'counterparty_id': ObjectId(creditor_id),
            'counterparty_name': creditor_name,
            'amount': total_amount,  # Store total amount including VAT
            'net_amount': net_amount,
            'description': data.get('description', ''),
            'due_date': due_date,
            'vat_percentage': vat_percentage,
            'structured_communication': data.get('structured_communication', ''),
            'free_communication': data.get('free_communication', ''),
            'bank_account': data.get('bank_account', ''),
            'is_recurring': is_recurring,
            'recurring_frequency': data.get('recurring_frequency') if is_recurring else None,
            'recurring_day': int(data.get('recurring_day')) if is_recurring and data.get('recurring_day') else None,
            'status': 'pending',
            'display_order': next_order,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        result = transactions.insert_one(transaction)
        
        return jsonify({
            'success': True,
            'transaction_id': str(result.inserted_id)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        })

@app.route('/update_transaction_order', methods=['POST'])
def update_transaction_order():
    """Update display order for transactions after drag-and-drop"""
    try:
        data = request.json
        order_updates = data.get('order', [])
        
        for update in order_updates:
            transactions.update_one(
                {'_id': ObjectId(update['id'])},
                {'$set': {'display_order': update['order'], 'updated_at': datetime.utcnow()}}
            )
        
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/get_transaction/<trans_id>')
def get_transaction(trans_id):
    """Get transaction details for editing"""
    try:
        trans = transactions.find_one({'_id': ObjectId(trans_id)})
        if not trans:
            return jsonify({'success': False, 'error': 'Transaction not found'})
        
        # Convert ObjectId to string
        trans['_id'] = str(trans['_id'])
        trans['counterparty_id'] = str(trans['counterparty_id'])
        
        # Format dates
        if trans.get('due_date'):
            trans['due_date'] = trans['due_date'].strftime('%Y-%m-%d')
        
        return jsonify({
            'success': True,
            'transaction': trans
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/update_transaction', methods=['POST'])
def update_transaction():
    """Update an existing transaction"""
    try:
        data = request.get_json()
        trans_id = data.get('transaction_id')
        
        if not trans_id:
            return jsonify({'success': False, 'error': 'Transaction ID is required'})
        
        # Handle creditor
        creditor_id = data.get('counterparty_id')
        if creditor_id == 'new':
            if not data.get('new_counterparty_name'):
                return jsonify({'success': False, 'error': 'New counterparty name is required'})
            creditor = {
                'name': data['new_counterparty_name'],
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }
            result = creditors.insert_one(creditor)
            creditor_id = str(result.inserted_id)
            creditor_name = data['new_counterparty_name']
        else:
            creditor = creditors.find_one({'_id': ObjectId(creditor_id)})
            if not creditor:
                return jsonify({'success': False, 'error': 'Creditor not found'})
            creditor_name = creditor['name']
        
        # Calculate amounts
        vat_percentage = float(data.get('vat_percentage', 0))
        net_amount = float(data['amount'])
        vat_amount = net_amount * (vat_percentage / 100)
        total_amount = net_amount + vat_amount
        
        # Prepare update
        update_data = {
            'type': data['type'],
            'counterparty_id': ObjectId(creditor_id),
            'counterparty_name': creditor_name,
            'amount': total_amount,
            'net_amount': net_amount,
            'vat_percentage': vat_percentage,
            'description': data.get('description', ''),
            'structured_communication': data.get('structured_communication', ''),
            'free_communication': data.get('free_communication', ''),
            'bank_account': data.get('bank_account', ''),
            'is_recurring': data.get('is_recurring') == 'on',
            'updated_at': datetime.utcnow()
        }
        
        if data.get('due_date'):
            update_data['due_date'] = datetime.strptime(data['due_date'], '%Y-%m-%d')
        
        transactions.update_one(
            {'_id': ObjectId(trans_id)},
            {'$set': update_data}
        )
        
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/delete_transaction/<trans_id>', methods=['DELETE'])
def delete_transaction(trans_id):
    """Delete a transaction"""
    try:
        result = transactions.delete_one({'_id': ObjectId(trans_id)})
        
        if result.deleted_count:
            return jsonify({'success': True})
        else:
            return jsonify({'success': False, 'error': 'Transaction not found'})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/mark_transaction_complete/<trans_id>', methods=['POST'])
def mark_transaction_complete(trans_id):
    """Mark a transaction as completed"""
    try:
        transactions.update_one(
            {'_id': ObjectId(trans_id)},
            {'$set': {
                'status': 'completed',
                'completed_date': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            }}
        )
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/update_transaction_field', methods=['POST'])
def update_transaction_field():
    """Update a specific field of a transaction"""
    try:
        data = request.json
        trans_id = data.get('transaction_id')
        field = data.get('field')
        value = data.get('value')
        
        # Handle different field types
        if field == 'amount':
            value = float(value)
        elif field == 'due_date':
            value = datetime.strptime(value, '%Y-%m-%d') if value else None
        elif field == 'priority_payment':
            value = bool(value)
        
        transactions.update_one(
            {'_id': ObjectId(trans_id)},
            {'$set': {field: value, 'updated_at': datetime.utcnow()}}
        )
        
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/get_bank_accounts_for_counterparty/<creditor_id>')
def get_bank_accounts_for_counterparty(creditor_id):
    """Get previously used bank accounts for a counterparty"""
    try:
        # Find all transactions with this counterparty that have bank accounts
        trans_with_accounts = list(transactions.find({
            'counterparty_id': ObjectId(creditor_id),
            'bank_account': {'$exists': True, '$ne': ''}
        }))
        
        # Get unique bank accounts
        bank_accounts = list(set(t['bank_account'] for t in trans_with_accounts if t.get('bank_account')))
        
        return jsonify({
            'success': True,
            'bank_accounts': bank_accounts
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

@app.route('/generate_qr_code/<trans_id>')
def generate_qr_code(trans_id):
    """Generate QR code for payment"""
    try:
        trans = transactions.find_one({'_id': ObjectId(trans_id)})
        if not trans:
            return jsonify({'success': False, 'error': 'Transaction not found'})
        
        # Create SEPA payment QR code
        # Format: BCD\n002\n1\nSCT\n\nBeneficiary\nIBAN\nEURamount\n\n\nCommunication
        qr_data = f"BCD\n002\n1\nSCT\n\n{trans['counterparty_name']}\n{trans.get('bank_account', '')}\nEUR{trans['amount']:.2f}\n\n\n{trans.get('structured_communication', trans.get('free_communication', ''))}"
        
        # Generate QR code
        qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=10, border=4)
        qr.add_data(qr_data)
        qr.make(fit=True)
        
        # Create image
        img = qr.make_image(fill_color="black", back_color="white")
        
        # Convert to base64
        buffered = BytesIO()
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        
        return jsonify({
            'success': True,
            'qr_image': f"data:image/png;base64,{img_str}",
            'transaction': {
                'counterparty': trans['counterparty_name'],
                'amount': trans['amount'],
                'bank_account': trans.get('bank_account', ''),
                'communication': trans.get('structured_communication') or trans.get('free_communication', '')
            }
        })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})

# API endpoints for AJAX operations
@app.route('/api/payment/add', methods=['POST'])
def add_payment():
    data = request.json
    
    payment_data = {
        'debt_id': ObjectId(data['debt_id']),
        'amount': float(data['amount']),
        'payment_date': datetime.utcnow(),
        'payment_method': data.get('payment_method', 'cash'),
        'reference_number': data.get('reference_number'),
        'note': data.get('note'),
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow()
    }
    
    result = payments.insert_one(payment_data)
    
    # Update debt status if paid off
    if is_debt_paid_off(data['debt_id']):
        debts.update_one({'_id': ObjectId(data['debt_id'])}, {'$set': {'status': 'paid'}})
    
    return jsonify({'success': True, 'payment_id': str(result.inserted_id)})

@app.route('/api/transaction/complete/<trans_id>', methods=['POST'])
def complete_transaction(trans_id):
    transactions.update_one(
        {'_id': ObjectId(trans_id)},
        {'$set': {
            'status': 'completed',
            'effective_date': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }}
    )
    return jsonify({'success': True})

# Initialize database indexes
def initialize_database():
    # Create indexes for better performance
    creditors.create_index('name')
    debts.create_index('creditor_id')
    debts.create_index('status')
    payments.create_index('debt_id')
    income.create_index('date_received')
    transactions.create_index([('type', 1), ('status', 1)])
    transactions.create_index('due_date')
    transactions.create_index('display_order')

# Initialize on startup
with app.app_context():
    initialize_database()

if __name__ == '__main__':
    print("Personal-Cash running with MongoDB (Modal version)")
    print("Database: personal_cash")
    print("Make sure MongoDB is running on localhost:27017")
    app.run(debug=True, port=5000)