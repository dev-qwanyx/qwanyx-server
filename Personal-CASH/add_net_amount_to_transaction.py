from app import app, db
from sqlalchemy import text

with app.app_context():
    # Add net_amount column to transaction table
    with db.engine.connect() as conn:
        try:
            # Add net_amount column
            conn.execute(text('ALTER TABLE "transaction" ADD COLUMN net_amount FLOAT'))
            conn.commit()
            print("Added net_amount column successfully")
            
            # Update existing transactions to set net_amount
            # For transactions with VAT, calculate net amount
            conn.execute(text('''
                UPDATE "transaction" 
                SET net_amount = CASE 
                    WHEN vat_percentage > 0 THEN amount / (1 + vat_percentage / 100.0)
                    ELSE amount
                END
                WHERE net_amount IS NULL
            '''))
            conn.commit()
            print("Updated existing transactions with net_amount")
            
        except Exception as e:
            print(f"Error: {e}")
    
    print("Migration completed!")