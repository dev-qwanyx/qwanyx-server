"""
Personal Cash Management Service for Digital Human
This module provides financial management capabilities
"""

import requests
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Any
import json

class CashManager:
    def __init__(self, api_base_url: str = "http://localhost:5010"):
        self.api_base_url = api_base_url
        self.session = requests.Session()
    
    def _make_request(self, method: str, endpoint: str, data: Optional[Dict] = None) -> Any:
        """Make HTTP request to the database API"""
        url = f"{self.api_base_url}/api/{endpoint}"
        
        try:
            if method == 'GET':
                response = self.session.get(url)
            elif method == 'POST':
                response = self.session.post(url, json=data)
            elif method == 'PUT':
                response = self.session.put(url, json=data)
            elif method == 'DELETE':
                response = self.session.delete(url)
            
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"API request failed: {str(e)}")
    
    # Account Management
    def create_account(self, name: str, account_type: str, initial_balance: float = 0, 
                      bank_name: Optional[str] = None, account_number: Optional[str] = None) -> str:
        """Create a new financial account"""
        data = {
            'name': name,
            'type': account_type,
            'balance': initial_balance,
            'initial_balance': initial_balance,
            'currency': 'EUR',
            'bank_name': bank_name,
            'account_number': account_number
        }
        result = self._make_request('POST', 'accounts', data)
        return result['id']
    
    def get_accounts(self) -> List[Dict]:
        """Get all accounts"""
        return self._make_request('GET', 'accounts')
    
    def get_account_balance(self, account_id: str) -> Dict:
        """Get current balance and transaction summary for an account"""
        return self._make_request('GET', f'accounts/balance/{account_id}')
    
    # Transaction Management
    def record_income(self, account_id: str, amount: float, source: str, 
                     description: Optional[str] = None, date: Optional[datetime] = None) -> str:
        """Record income transaction"""
        data = {
            'type': 'income',
            'direction': 'in',
            'account_id': account_id,
            'amount': amount,
            'counterparty_name': source,
            'description': description,
            'status': 'completed',
            'dates': {
                'created': datetime.utcnow().isoformat(),
                'completed': (date or datetime.utcnow()).isoformat()
            }
        }
        result = self._make_request('POST', 'transactions', data)
        return result['id']
    
    def record_expense(self, account_id: str, counterparty_id: str, amount: float,
                      category_id: str, description: Optional[str] = None,
                      vat_rate: float = 0, due_date: Optional[datetime] = None) -> str:
        """Record expense transaction"""
        net_amount = amount / (1 + vat_rate / 100) if vat_rate > 0 else amount
        vat_amount = amount - net_amount
        
        data = {
            'type': 'expense',
            'direction': 'out',
            'account_id': account_id,
            'counterparty_id': counterparty_id,
            'category_id': category_id,
            'amount': amount,
            'net_amount': net_amount,
            'vat_rate': vat_rate,
            'vat_amount': vat_amount,
            'description': description,
            'status': 'pending' if due_date and due_date > datetime.utcnow() else 'completed',
            'dates': {
                'created': datetime.utcnow().isoformat(),
                'due': due_date.isoformat() if due_date else None
            }
        }
        result = self._make_request('POST', 'transactions', data)
        return result['id']
    
    def get_pending_transactions(self) -> List[Dict]:
        """Get all pending transactions"""
        return self._make_request('GET', 'transactions/pending')
    
    def complete_transaction(self, transaction_id: str) -> bool:
        """Mark a transaction as completed"""
        data = {
            'status': 'completed',
            'dates.completed': datetime.utcnow().isoformat()
        }
        self._make_request('PUT', f'transactions/{transaction_id}', data)
        return True
    
    # Counterparty Management
    def add_counterparty(self, name: str, party_type: str = 'vendor',
                        bank_details: Optional[Dict] = None, tags: Optional[List[str]] = None) -> str:
        """Add a new counterparty (vendor, customer, person)"""
        data = {
            'name': name,
            'type': party_type,
            'bank_details': bank_details or {},
            'tags': tags or []
        }
        result = self._make_request('POST', 'counterparties', data)
        return result['id']
    
    def find_counterparty(self, name: str) -> Optional[Dict]:
        """Find counterparty by name"""
        all_parties = self._make_request('GET', 'counterparties')
        for party in all_parties:
            if party['name'].lower() == name.lower():
                return party
        return None
    
    # Category Management
    def create_category(self, name: str, category_type: str = 'expense',
                       budget_monthly: Optional[float] = None, parent_id: Optional[str] = None) -> str:
        """Create expense/income category"""
        data = {
            'name': name,
            'type': category_type,
            'budget_monthly': budget_monthly,
            'parent_id': parent_id
        }
        result = self._make_request('POST', 'categories', data)
        return result['id']
    
    def get_categories(self, category_type: Optional[str] = None) -> List[Dict]:
        """Get all categories, optionally filtered by type"""
        categories = self._make_request('GET', 'categories')
        if category_type:
            return [c for c in categories if c['type'] == category_type]
        return categories
    
    # Budget Management
    def create_monthly_budget(self, year: int, month: int, category_budgets: Dict[str, float]) -> str:
        """Create a monthly budget"""
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1) - timedelta(days=1)
        else:
            end_date = datetime(year, month + 1, 1) - timedelta(days=1)
        
        categories = []
        total = 0
        for cat_id, amount in category_budgets.items():
            categories.append({
                'category_id': cat_id,
                'planned_amount': amount,
                'actual_amount': 0
            })
            total += amount
        
        data = {
            'name': f'{year}-{month:02d} Monthly Budget',
            'period': 'monthly',
            'start_date': start_date.isoformat(),
            'end_date': end_date.isoformat(),
            'categories': categories,
            'total_planned': total,
            'total_actual': 0
        }
        result = self._make_request('POST', 'budgets', data)
        return result['id']
    
    def get_current_budget_status(self) -> Dict:
        """Get current budget with actual vs planned amounts"""
        return self._make_request('GET', 'budgets/current')
    
    # Recurring Transactions
    def setup_recurring_transaction(self, name: str, template: Dict, 
                                   frequency: str = 'monthly', start_date: Optional[datetime] = None) -> str:
        """Set up a recurring transaction"""
        data = {
            'name': name,
            'template_transaction': template,
            'frequency': frequency,
            'next_due': (start_date or datetime.utcnow()).isoformat(),
            'active': True
        }
        result = self._make_request('POST', 'recurring_templates', data)
        return result['id']
    
    def process_recurring_transactions(self) -> Dict:
        """Process all due recurring transactions"""
        return self._make_request('POST', 'recurring/process')
    
    # Analysis and Reporting
    def get_cash_flow_summary(self, start_date: datetime, end_date: datetime) -> Dict:
        """Get cash flow summary for a period"""
        transactions = self._make_request('GET', 'transactions')
        
        income = 0
        expenses = 0
        pending_income = 0
        pending_expenses = 0
        
        for trans in transactions:
            trans_date = datetime.fromisoformat(trans['dates']['created'].replace('Z', '+00:00'))
            if start_date <= trans_date <= end_date:
                if trans['type'] == 'income':
                    if trans['status'] == 'completed':
                        income += trans['amount']
                    else:
                        pending_income += trans['amount']
                elif trans['type'] == 'expense':
                    if trans['status'] == 'completed':
                        expenses += trans['amount']
                    else:
                        pending_expenses += trans['amount']
        
        return {
            'period': f"{start_date.date()} to {end_date.date()}",
            'income': income,
            'expenses': expenses,
            'net_flow': income - expenses,
            'pending_income': pending_income,
            'pending_expenses': pending_expenses
        }
    
    def get_spending_by_category(self, start_date: datetime, end_date: datetime) -> Dict[str, float]:
        """Get spending breakdown by category for a period"""
        transactions = self._make_request('GET', 'transactions')
        categories = {cat['_id']: cat['name'] for cat in self._make_request('GET', 'categories')}
        
        spending = {}
        for trans in transactions:
            if trans['type'] == 'expense' and trans['status'] == 'completed':
                trans_date = datetime.fromisoformat(trans['dates']['completed'].replace('Z', '+00:00'))
                if start_date <= trans_date <= end_date:
                    cat_id = trans.get('category_id')
                    cat_name = categories.get(cat_id, 'Uncategorized')
                    spending[cat_name] = spending.get(cat_name, 0) + trans['amount']
        
        return spending
    
    # Utility Methods
    def initialize_database(self) -> bool:
        """Initialize database collections and indexes"""
        self._make_request('POST', 'init-collections')
        return True
    
    def suggest_payment_plan(self, available_amount: float) -> List[Dict]:
        """Suggest which pending transactions to pay based on available funds"""
        pending = self.get_pending_transactions()
        
        # Sort by due date and priority
        pending.sort(key=lambda x: (
            x['dates'].get('due', '9999-12-31'),
            -x.get('priority', 5)
        ))
        
        suggestions = []
        remaining = available_amount
        
        for trans in pending:
            if trans['amount'] <= remaining:
                suggestions.append({
                    'transaction_id': trans['_id'],
                    'counterparty': trans.get('counterparty_name', 'Unknown'),
                    'amount': trans['amount'],
                    'due_date': trans['dates'].get('due'),
                    'description': trans.get('description', '')
                })
                remaining -= trans['amount']
        
        return suggestions