from app import app, db, Creditor, Debt
from datetime import datetime

def reimport_luminus_invoices():
    with app.app_context():
        # Create Luminus creditor
        luminus = Creditor(
            name='Luminus',
            bank_name='',
            account_number='BE76 3350 5545 9895',
            routing_number='BBRUBEBB',
            notes='Energy provider (Electricity & Gas)'
        )
        db.session.add(luminus)
        db.session.commit()
        print(f"Created creditor: Luminus")
        
        # Re-import the three invoices with structured communications
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
        
        total = 0
        for invoice in invoices:
            debt = Debt(
                creditor_id=luminus.id,
                creditor_name=luminus.name,
                amount=invoice['amount'],
                description=f'Monthly energy bill {invoice["period"]} - Invoice #{invoice["invoice_number"]} (Electricity: €85.85 + Gas: €139.62)',
                structured_communication=invoice['structured_communication'],
                created_date=datetime.strptime(invoice['date'], '%Y-%m-%d'),
                due_date=datetime.strptime(invoice['due_date'], '%Y-%m-%d'),
                status='pending'
            )
            db.session.add(debt)
            total += invoice['amount']
            print(f"Created debt: {invoice['period']} - €{invoice['amount']} - Due: {invoice['due_date']} - Ref: +++{invoice['structured_communication']}+++")
        
        db.session.commit()
        print(f"\nTotal debt created: €{total}")
        print("All invoices re-imported successfully!")

if __name__ == '__main__':
    reimport_luminus_invoices()