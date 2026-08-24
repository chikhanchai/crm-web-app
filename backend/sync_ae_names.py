import sqlite3
import pandas as pd

db_path = 'crm.db'
excel_path = 'C:/Happy/AI SandBox/CRM/Customer_Profiling_ICT_Solutions_Master_724Accounts_Strict_Web_Crosscheck.xlsx'

# Read Excel
df = pd.read_excel(excel_path, engine='openpyxl', header=3)
df.columns = [str(c).strip() for c in df.columns]

# Connect to database
conn = sqlite3.connect(db_path)
cur = conn.cursor()

updated_count = 0

for _, row in df.iterrows():
    company = str(row.get('ชื่อลูกค้าองค์กร', '')).strip()
    ae_name = str(row.get('AE Name', '')).strip()
    
    if not company or company == 'nan' or company == '-':
        continue
        
    if ae_name == 'nan': 
        ae_name = ''
        
    cur.execute("UPDATE Customers SET ACCOUNT_OWNER = ? WHERE CUSTOMER_NAME = ?", (ae_name, company))
    updated_count += cur.rowcount

conn.commit()
conn.close()

print(f"Synced {updated_count} rows from Master Excel 'AE Name' column to Database 'ACCOUNT_OWNER'.")
