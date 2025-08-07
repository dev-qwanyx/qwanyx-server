"""
Digital Human with Personal Cash Management capabilities
This is an example of how a Digital Human integrates various services
"""

from flask import Flask, render_template, request, jsonify, redirect, url_for
from apps.personal_cash_service.cash_manager import CashManager
from datetime import datetime, timedelta
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'digital-human-secret'

# Initialize services
cash_manager = CashManager(api_base_url="http://localhost:5011")

class DigitalHuman:
    """
    Digital Human that can be interacted with through various interfaces
    """
    def __init__(self, name: str):
        self.name = name
        self.capabilities = {
            'cash_management': cash_manager,
            # Other capabilities would be added here:
            # 'gtd': gtd_manager,
            # 'project_management': project_manager,
            # etc.
        }
    
    def process_natural_language(self, message: str) -> str:
        """
        Simple natural language processing for chat interface
        This would be much more sophisticated in production
        """
        message_lower = message.lower()
        
        # Financial queries
        if 'balance' in message_lower:
            accounts = self.capabilities['cash_management'].get_accounts()
            if accounts:
                response = "Here are your account balances:\n"
                for acc in accounts:
                    balance_info = self.capabilities['cash_management'].get_account_balance(acc['_id'])
                    response += f"- {acc['name']}: €{balance_info['balance']:.2f}\n"
                return response
            return "No accounts found. Would you like to create one?"
        
        elif 'spend' in message_lower or 'expense' in message_lower:
            return "To record an expense, please provide: amount, vendor, and category."
        
        elif 'income' in message_lower or 'received' in message_lower:
            return "To record income, please provide: amount and source."
        
        elif 'budget' in message_lower:
            try:
                budget = self.capabilities['cash_management'].get_current_budget_status()
                response = f"Current budget status:\n"
                for cat in budget.get('categories', []):
                    response += f"- {cat['category_id']}: €{cat['actual_amount']:.2f} / €{cat['planned_amount']:.2f}\n"
                return response
            except:
                return "No active budget found. Would you like to create one?"
        
        return f"I'm {self.name}, your digital assistant. I can help with financial management, task planning, and more. What would you like to do?"
    
    def get_dashboard_data(self) -> dict:
        """Get data for web dashboard"""
        try:
            # Get accounts
            accounts = self.capabilities['cash_management'].get_accounts()
            
            # Get recent transactions
            all_transactions = self.capabilities['cash_management']._make_request('GET', 'transactions')
            recent_transactions = sorted(all_transactions, 
                                       key=lambda x: x['dates']['created'], 
                                       reverse=True)[:10]
            
            # Get current month cash flow
            now = datetime.utcnow()
            start_of_month = datetime(now.year, now.month, 1)
            cash_flow = self.capabilities['cash_management'].get_cash_flow_summary(
                start_of_month, now
            )
            
            # Get pending transactions
            pending = self.capabilities['cash_management'].get_pending_transactions()
            
            return {
                'accounts': accounts,
                'recent_transactions': recent_transactions,
                'cash_flow': cash_flow,
                'pending_count': len(pending),
                'pending_total': sum(t['amount'] for t in pending)
            }
        except Exception as e:
            return {'error': str(e)}

# Initialize Digital Human
digital_human = DigitalHuman("Alex")

# Web Interface Routes
@app.route('/')
def index():
    """Main dashboard"""
    return render_template('dashboard.html', 
                         human_name=digital_human.name,
                         data=digital_human.get_dashboard_data())

@app.route('/chat', methods=['GET', 'POST'])
def chat():
    """Chat interface"""
    if request.method == 'POST':
        message = request.json.get('message', '')
        response = digital_human.process_natural_language(message)
        return jsonify({'response': response})
    return render_template('chat.html', human_name=digital_human.name)

# Personal Cash specific routes
@app.route('/cash/accounts')
def accounts():
    """Account management page"""
    accounts = cash_manager.get_accounts()
    return render_template('accounts.html', accounts=accounts)

@app.route('/cash/transactions')
def transactions():
    """Transaction list page"""
    transactions = cash_manager._make_request('GET', 'transactions')
    return render_template('transactions.html', transactions=transactions)

@app.route('/cash/add-transaction', methods=['GET', 'POST'])
def add_transaction():
    """Add new transaction"""
    if request.method == 'POST':
        data = request.form
        
        if data.get('type') == 'income':
            cash_manager.record_income(
                account_id=data['account_id'],
                amount=float(data['amount']),
                source=data['source'],
                description=data.get('description')
            )
        else:
            cash_manager.record_expense(
                account_id=data['account_id'],
                counterparty_id=data['counterparty_id'],
                amount=float(data['amount']),
                category_id=data['category_id'],
                description=data.get('description'),
                vat_rate=float(data.get('vat_rate', 0))
            )
        
        return redirect(url_for('transactions'))
    
    # GET request - show form
    accounts = cash_manager.get_accounts()
    categories = cash_manager.get_categories()
    counterparties = cash_manager._make_request('GET', 'counterparties')
    
    return render_template('add_transaction.html',
                         accounts=accounts,
                         categories=categories,
                         counterparties=counterparties)

@app.route('/cash/budget')
def budget():
    """Budget management page"""
    try:
        current_budget = cash_manager.get_current_budget_status()
        categories = cash_manager.get_categories()
        return render_template('budget.html', 
                             budget=current_budget,
                             categories=categories)
    except:
        return render_template('budget.html', 
                             budget=None,
                             categories=cash_manager.get_categories())

# API endpoints for AJAX calls
@app.route('/api/cash/payment-suggestions', methods=['POST'])
def payment_suggestions():
    """Get payment suggestions based on available funds"""
    data = request.json
    available = float(data.get('available_amount', 0))
    suggestions = cash_manager.suggest_payment_plan(available)
    return jsonify(suggestions)

@app.route('/api/cash/process-recurring', methods=['POST'])
def process_recurring():
    """Process recurring transactions"""
    result = cash_manager.process_recurring_transactions()
    return jsonify(result)

# Initialize database on first run
@app.before_first_request
def initialize():
    """Initialize the database and create default data"""
    try:
        cash_manager.initialize_database()
        
        # Create default account if none exist
        accounts = cash_manager.get_accounts()
        if not accounts:
            cash_manager.create_account(
                name="Main Checking",
                account_type="checking",
                initial_balance=1000.0
            )
        
        # Create default categories if none exist
        categories = cash_manager.get_categories()
        if not categories:
            cash_manager.create_category("Groceries", "expense", 400)
            cash_manager.create_category("Utilities", "expense", 200)
            cash_manager.create_category("Transport", "expense", 150)
            cash_manager.create_category("Entertainment", "expense", 100)
            cash_manager.create_category("Salary", "income")
            cash_manager.create_category("Freelance", "income")
    except Exception as e:
        print(f"Initialization error: {e}")

if __name__ == '__main__':
    # Ensure database API is running on port 5011
    print("Make sure the database API is running on port 5011")
    print(f"Digital Human '{digital_human.name}' is starting...")
    app.run(debug=True, port=8000)