import sqlite3
import pandas as pd
import json

db_path = 'crm.db'
excel_path = 'C:/Happy/AI SandBox/CRM/Customer_Profiling_ICT_Solutions_Master_724Accounts_Strict_Web_Crosscheck.xlsx'

# 1. Read Database
conn = sqlite3.connect(db_path)
cur = conn.cursor()
cur.execute("SELECT CUSTOMER_NAME, ACCOUNT_OWNER FROM Customers WHERE CUSTOMER_NAME IS NOT NULL")
db_data = {r[0].strip(): r[1].strip() if r[1] else "" for r in cur.fetchall()}
conn.close()

# 2. Read Excel
df = pd.read_excel(excel_path, engine='openpyxl', header=3)
# Clean columns
df.columns = [str(c).strip() for c in df.columns]

mismatches = []
matches = 0

for _, row in df.iterrows():
    company = str(row.get('ชื่อลูกค้าองค์กร', '')).strip()
    ae_name = str(row.get('AE Name', '')).strip()
    
    if not company or company == 'nan' or company == '-':
        continue
        
    if company in db_data:
        db_ae = db_data[company]
        
        # In Excel, missing AE Name might be 'nan' or '-'
        if ae_name == 'nan': ae_name = ''
        if db_ae == 'nan' or db_ae == '-': db_ae = ''
        
        if ae_name != db_ae:
            mismatches.append({
                "company": company,
                "excel_ae": ae_name,
                "db_ae": db_ae
            })
        else:
            matches += 1

output = {
    "total_checked": matches + len(mismatches),
    "matches": matches,
    "mismatches": mismatches
}

with open('verification.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)

print("Verification complete. Check verification.json")
