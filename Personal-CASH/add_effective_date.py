from app import app, db
from sqlalchemy import text

with app.app_context():
    # Add effective_date column to existing database
    with db.engine.connect() as conn:
        try:
            conn.execute(text('ALTER TABLE "transaction" ADD COLUMN effective_date DATETIME'))
            conn.commit()
            print("Added effective_date column successfully")
        except Exception as e:
            print(f"Error adding effective_date column: {e}")
    
    # Update existing transactions to set effective_date = due_date
    with db.engine.connect() as conn:
        try:
            conn.execute(text('UPDATE "transaction" SET effective_date = due_date WHERE effective_date IS NULL'))
            conn.commit()
            print("Updated existing transactions with effective_date")
        except Exception as e:
            print(f"Error updating effective_date: {e}")
    
    print("Migration completed!")