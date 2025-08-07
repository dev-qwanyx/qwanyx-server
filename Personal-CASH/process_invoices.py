from app import app, db, Creditor, Debt
from datetime import datetime
import os
from pathlib import Path

def process_luminus_invoices():
    with app.app_context():
        # First check if Luminus creditor exists
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
            print(f"Created creditor: Luminus")
        
        invoices = [
            {
                'filename': 'LUMINUS_INV_006927974656.pdf',
                'invoice_number': '6927974656',
                'amount': 239.00,
                'date': '2025-06-18',
                'due_date': '2025-07-06',
                'period': 'June 2025'
            },
            {
                'filename': 'LUMINUS_INV_007487962356.pdf',
                'invoice_number': '7487962356',
                'amount': 239.00,
                'date': '2025-05-18',
                'due_date': '2025-06-05',
                'period': 'May 2025'
            }
        ]
        
        processed_folder = Path('IN/processed')
        processed_folder.mkdir(exist_ok=True)
        
        for invoice in invoices:
            # Create debt
            debt = Debt(
                creditor_id=luminus.id,
                creditor_name=luminus.name,
                amount=invoice['amount'],
                description=f'Monthly energy bill {invoice["period"]} - Invoice #{invoice["invoice_number"]} (Electricity: €85.85 + Gas: €139.62)',
                created_date=datetime.strptime(invoice['date'], '%Y-%m-%d'),
                due_date=datetime.strptime(invoice['due_date'], '%Y-%m-%d'),
                status='pending'
            )
            db.session.add(debt)
            
            # Move processed file
            source = Path(f'IN/{invoice["filename"]}')
            if source.exists():
                destination = processed_folder / source.name
                source.rename(destination)
                print(f"Processed: {invoice['filename']} -> Debt created: €{invoice['amount']} due {invoice['due_date']}")
        
        db.session.commit()
        print("All invoices processed successfully!")

if __name__ == '__main__':
    process_luminus_invoices()