import sqlite3
import pandas as pd

# Load mapping from Excel
mapping_df = pd.read_excel('C:/Happy/AI SandBox/CRM/RES_AE_ID.xlsx')

# Create a dictionary: { "90003698": "Name", ... }
ae_mapping = {}
for index, row in mapping_df.iterrows():
    ae_id = str(row['CURR_AE_EMP_CD']).strip()
    ae_name = str(row['CURR_AE_EMP_NAME']).strip()
    ae_mapping[ae_id] = ae_name

# Connect to database
db_path = "crm.db"
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Update Customers and Users tables
for old_id, new_name in ae_mapping.items():
    # Update Customers
    cur.execute("UPDATE Customers SET ACCOUNT_OWNER = ? WHERE ACCOUNT_OWNER = ?", (new_name, old_id))
    
    # Update Users
    cur.execute("UPDATE Users SET full_name = ? WHERE full_name = ?", (new_name, old_id))

conn.commit()
conn.close()

print(f"Successfully updated AE names using RES_AE_ID.xlsx. Mapped {len(ae_mapping)} AEs.")
