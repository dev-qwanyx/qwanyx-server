from app import app, db, Debt, Transaction, Creditor
from datetime import datetime

def migrate_debts_to_transactions():
    with app.app_context():
        # Get all existing debts
        debts = Debt.query.all()
        
        if debts:
            print(f"Found {len(debts)} debts to migrate")
            
            for debt in debts:
                # Create a transaction for each debt
                transaction = Transaction(
                    type='payable',
                    counterparty_id=debt.creditor_id,
                    counterparty_name=debt.creditor_name,
                    amount=debt.amount,
                    description=debt.description,
                    structured_communication=debt.structured_communication,
                    created_date=debt.created_date,
                    due_date=debt.due_date,
                    planned_pay_date=debt.planned_pay_date,
                    status='pending' if debt.status == 'pending' else 'completed'
                )
                db.session.add(transaction)
                print(f"Migrated: {debt.creditor_name} - €{debt.amount} - Due: {debt.due_date}")
            
            db.session.commit()
            print("Migration completed!")
        else:
            print("No debts found to migrate")
            
            # If no debts exist, let's add the Luminus invoices directly as transactions
            luminus = Creditor.query.filter_by(name='Luminus').first()
            if not luminus:
                luminus = Creditor(
                    name='Luminus',
                    bank_name='',
                    account_number='BE76 3350 5545 9895',
                    routing_number='BBRUBEBB',
                    notes='Energy provider (Electricity & Gas)'
                )
                db.session.add(luminus)
                db.session.commit()
                print("Created Luminus creditor")
            
            # Add the three invoices as transactions
            invoices = [
                {
                    'invoice_number': '7487962356',
                    'amount': 239.00,
                    'date': '2025-05-18',
                    'due_date': '2025-06-05',
                    'period': 'May 2025',
                    'structured_communication': '748/7962/35620'
                },
                {
                    'invoice_number': '6927974656',
                    'amount': 239.00,
                    'date': '2025-06-18',
                    'due_date': '2025-07-06',
                    'period': 'June 2025',
                    'structured_communication': '692/7974/65613'
                },
                {
                    'invoice_number': '3714122895',
                    'amount': 239.00,
                    'date': '2025-07-18',
                    'due_date': '2025-08-05',
                    'period': 'July 2025',
                    'structured_communication': '371/4122/89573'
                }
            ]
            
            for inv in invoices:
                transaction = Transaction(
                    type='payable',
                    counterparty_id=luminus.id,
                    counterparty_name=luminus.name,
                    amount=inv['amount'],
                    description=f'Monthly energy bill {inv["period"]} - Invoice #{inv["invoice_number"]} (Electricity: €85.85 + Gas: €139.62)',
                    structured_communication=inv['structured_communication'],
                    created_date=datetime.strptime(inv['date'], '%Y-%m-%d'),
                    due_date=datetime.strptime(inv['due_date'], '%Y-%m-%d'),
                    status='pending'
                )
                db.session.add(transaction)
                print(f"Added: Luminus {inv['period']} - €{inv['amount']} - Due: {inv['due_date']}")
            
            db.session.commit()
            print("Added Luminus invoices as transactions!")

if __name__ == '__main__':
    migrate_debts_to_transactions()