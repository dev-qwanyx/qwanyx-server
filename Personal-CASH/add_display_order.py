from app import app, db
from sqlalchemy import text

with app.app_context():
    # Add display_order column to existing database
    with db.engine.connect() as conn:
        try:
            conn.execute(text('ALTER TABLE "transaction" ADD COLUMN display_order INTEGER DEFAULT 0'))
            conn.commit()
            print("Added display_order column successfully")
            
            # Set initial display order based on current sorting (by due date)
            conn.execute(text('''
                UPDATE "transaction" 
                SET display_order = (
                    SELECT COUNT(*) 
                    FROM "transaction" t2 
                    WHERE (t2.due_date < "transaction".due_date) 
                       OR (t2.due_date = "transaction".due_date AND t2.id < "transaction".id)
                )
            '''))
            conn.commit()
            print("Set initial display order values")
            
        except Exception as e:
            print(f"Error: {e}")
    
    print("Migration completed!")