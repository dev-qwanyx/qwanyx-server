from app import app, db
from sqlalchemy import text

with app.app_context():
    # Add free_communication column to transaction table
    with db.engine.connect() as conn:
        try:
            # Add free_communication column
            conn.execute(text('ALTER TABLE "transaction" ADD COLUMN free_communication VARCHAR(200)'))
            conn.commit()
            print("Added free_communication column successfully")
            
        except Exception as e:
            print(f"Error: {e}")
    
    print("Migration completed!")