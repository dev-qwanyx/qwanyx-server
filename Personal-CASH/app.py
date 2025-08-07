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
    return render_template('index.html')

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

@app.route('/creditor/<creditor_id>')
def creditor_detail(creditor_id):
    creditor = creditors.find_one({'_id': ObjectId(creditor_id)})
    if not creditor:
        flash('Creditor not found!')
        return redirect(url_for('creditors_list'))
    
    # Get all debts for this creditor
    creditor_debts = list(debts.find({'creditor_id': ObjectId(creditor_id)}))
    
    # Add remaining amount to each debt
    for debt in creditor_debts:
        debt['remaining_amount'] = get_remaining_amount(debt['_id'])
        debt['is_paid_off'] = debt['remaining_amount'] <= 0
    
    return render_template('creditor_detail.html', creditor=creditor, debts=creditor_debts)

@app.route('/edit_creditor/<creditor_id>', methods=['GET', 'POST'])
def edit_creditor(creditor_id):
    creditor = creditors.find_one({'_id': ObjectId(creditor_id)})
    if not creditor:
        flash('Creditor not found!')
        return redirect(url_for('creditors_list'))
    
    if request.method == 'POST':
        update_data = {
            'name': request.form['name'],
            'bank_name': request.form.get('bank_name'),
            'account_number': request.form.get('account_number'),
            'routing_number': request.form.get('routing_number'),
            'notes': request.form.get('notes'),
            'updated_at': datetime.utcnow()
        }
        creditors.update_one({'_id': ObjectId(creditor_id)}, {'$set': update_data})
        flash('Creditor updated successfully!')
        return redirect(url_for('creditor_detail', creditor_id=creditor_id))
    
    return render_template('edit_creditor.html', creditor=creditor)

@app.route('/add_debt/<creditor_id>', methods=['GET', 'POST'])
def add_debt(creditor_id):
    creditor = creditors.find_one({'_id': ObjectId(creditor_id)})
    if not creditor:
        flash('Creditor not found!')
        return redirect(url_for('creditors_list'))
    
    if request.method == 'POST':
        debt_data = {
            'creditor_id': ObjectId(creditor_id),
            'creditor_name': creditor['name'],
            'amount': float(request.form['amount']),
            'description': request.form.get('description'),
            'structured_communication': request.form.get('structured_communication'),
            'created_date': datetime.utcnow(),
            'due_date': datetime.strptime(request.form['due_date'], '%Y-%m-%d') if request.form.get('due_date') else None,
            'planned_pay_date': datetime.strptime(request.form['planned_pay_date'], '%Y-%m-%d') if request.form.get('planned_pay_date') else None,
            'status': 'pending',
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        debts.insert_one(debt_data)
        flash('Debt added successfully!')
        return redirect(url_for('creditor_detail', creditor_id=creditor_id))
    
    return render_template('add_debt.html', creditor=creditor)

@app.route('/debt/<debt_id>')
def debt_detail(debt_id):
    debt = debts.find_one({'_id': ObjectId(debt_id)})
    if not debt:
        flash('Debt not found!')
        return redirect(url_for('index'))
    
    debt['remaining_amount'] = get_remaining_amount(debt_id)
    debt['is_paid_off'] = debt['remaining_amount'] <= 0
    
    # Get all payments for this debt
    debt_payments = list(payments.find({'debt_id': ObjectId(debt_id)}))
    
    return render_template('debt_detail.html', debt=debt, payments=debt_payments)

@app.route('/income')
def income_list():
    all_income = list(income.find().sort('date_received', DESCENDING))
    
    # Calculate totals
    total_income = sum(inc['amount'] for inc in all_income)
    monthly_income = 0
    now = datetime.utcnow()
    for inc in all_income:
        if inc['date_received'].year == now.year and inc['date_received'].month == now.month:
            monthly_income += inc['amount']
    
    return render_template('income.html', 
                         income=all_income, 
                         total_income=total_income,
                         monthly_income=monthly_income)

@app.route('/add_income', methods=['GET', 'POST'])
def add_income():
    if request.method == 'POST':
        income_data = {
            'source': request.form['source'],
            'amount': float(request.form['amount']),
            'date_received': datetime.strptime(request.form['date_received'], '%Y-%m-%d') if request.form.get('date_received') else datetime.utcnow(),
            'expected_date': datetime.strptime(request.form['expected_date'], '%Y-%m-%d') if request.form.get('expected_date') else None,
            'recurring': request.form.get('recurring') == 'on',
            'frequency': request.form.get('frequency'),
            'description': request.form.get('description'),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        income.insert_one(income_data)
        flash('Income added successfully!')
        return redirect(url_for('income_list'))
    
    return render_template('add_income.html')

@app.route('/cash_flow')
def cash_flow():
    # Get all transactions
    all_transactions = list(transactions.find().sort('created_date', DESCENDING))
    
    # Calculate totals
    total_payables = sum(t['amount'] for t in all_transactions if t['type'] == 'payable')
    total_receivables = sum(t['amount'] for t in all_transactions if t['type'] == 'receivable')
    
    # Get pending amounts
    pending_payables = sum(t['amount'] for t in all_transactions if t['type'] == 'payable' and t['status'] == 'pending')
    pending_receivables = sum(t['amount'] for t in all_transactions if t['type'] == 'receivable' and t['status'] == 'pending')
    
    return render_template('cash_flow.html',
                         transactions=all_transactions,
                         total_payables=total_payables,
                         total_receivables=total_receivables,
                         pending_payables=pending_payables,
                         pending_receivables=pending_receivables)

@app.route('/unified_dashboard')
def unified_dashboard():
    # Get all creditors with their debts and payment status
    all_creditors = list(creditors.find())
    
    dashboard_data = []
    for creditor in all_creditors:
        creditor_debts = list(debts.find({'creditor_id': creditor['_id']}))
        
        total_debt = 0
        total_paid = 0
        pending_debts = []
        
        for debt in creditor_debts:
            remaining = get_remaining_amount(debt['_id'])
            paid = debt['amount'] - remaining
            
            total_debt += debt['amount']
            total_paid += paid
            
            if remaining > 0:
                pending_debts.append({
                    'id': str(debt['_id']),
                    'amount': debt['amount'],
                    'remaining': remaining,
                    'due_date': debt.get('due_date'),
                    'description': debt.get('description', '')
                })
        
        if total_debt > 0:  # Only include creditors with debts
            dashboard_data.append({
                'creditor': creditor,
                'total_debt': total_debt,
                'total_paid': total_paid,
                'total_remaining': total_debt - total_paid,
                'pending_debts': pending_debts,
                'payment_progress': (total_paid / total_debt * 100) if total_debt > 0 else 0
            })
    
    # Sort by total remaining (highest first)
    dashboard_data.sort(key=lambda x: x['total_remaining'], reverse=True)
    
    # Calculate overall totals
    overall_debt = sum(d['total_debt'] for d in dashboard_data)
    overall_paid = sum(d['total_paid'] for d in dashboard_data)
    overall_remaining = overall_debt - overall_paid
    
    return render_template('unified_dashboard_modal.html',
                         dashboard_data=dashboard_data,
                         overall_debt=overall_debt,
                         overall_paid=overall_paid,
                         overall_remaining=overall_remaining)

@app.route('/payment_planner')
def payment_planner():
    # Get all pending transactions
    pending_trans = list(transactions.find({'status': 'pending', 'type': 'payable'}).sort('due_date', 1))
    
    # Get available balance (simplified - you'd calculate from accounts)
    available_balance = 1000  # Placeholder
    
    # Create payment suggestions
    suggestions = []
    remaining = available_balance
    
    for trans in pending_trans:
        if trans['amount'] <= remaining:
            suggestions.append(trans)
            remaining -= trans['amount']
    
    return render_template('payment_planner.html',
                         pending_transactions=pending_trans,
                         available_balance=available_balance,
                         suggestions=suggestions,
                         total_suggested=available_balance - remaining)

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

# Initialize on startup
with app.app_context():
    initialize_database()

if __name__ == '__main__':
    print("Personal-Cash running with MongoDB")
    print("Database: personal_cash")
    print("Make sure MongoDB is running on localhost:27017")
    app.run(debug=True, port=5000)