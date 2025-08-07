from app import app, db
from sqlalchemy import text

with app.app_context():
    # Add bank_account column to transaction table
    with db.engine.connect() as conn:
        try:
            # Add bank_account column
            conn.execute(text('ALTER TABLE "transaction" ADD COLUMN bank_account VARCHAR(50)'))
            conn.commit()
            print("Added bank_account column successfully")
            
        except Exception as e:
            print(f"Error: {e}")
    
    print("Migration completed!")