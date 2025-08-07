from app import app, db
from sqlalchemy import text

with app.app_context():
    # Add new columns to existing database
    with db.engine.connect() as conn:
        try:
            # Add recurring_count column
            conn.execute(text('ALTER TABLE "transaction" ADD COLUMN recurring_count INTEGER'))
            print("Added recurring_count column")
        except Exception as e:
            print(f"recurring_count column might already exist: {e}")
            
        try:
            # Add recurring_parent_id column
            conn.execute(text('ALTER TABLE "transaction" ADD COLUMN recurring_parent_id INTEGER REFERENCES "transaction"(id)'))
            print("Added recurring_parent_id column")
        except Exception as e:
            print(f"recurring_parent_id column might already exist: {e}")
            
        conn.commit()
    
    print("Database schema updated successfully!")