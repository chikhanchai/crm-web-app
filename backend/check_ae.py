import sqlite3
import pandas as pd
import json

conn = sqlite3.connect('crm.db')
cur = conn.cursor()
cur.execute("SELECT id, CUSTOMER_NAME, ACCOUNT_OWNER FROM Customers WHERE CUSTOMER_NAME LIKE '%ออฟฟิศเมท%'")
db_res = cur.fetchall()
conn.close()

output = {"db": db_res, "excel": []}

try:
    df = pd.read_excel('C:/Happy/AI SandBox/CRM/Customer_Profiling_ICT_Solutions_Master_724Accounts_Strict_Web_Crosscheck.xlsx', engine='openpyxl')
    row = df[df['ชื่อลูกค้าองค์กร'].str.contains('ออฟฟิศเมท', na=False)]
    for _, r in row.iterrows():
        output["excel"].append([str(r['ชื่อลูกค้าองค์กร']), str(r['Sales Lead ผู้รับผิดชอบ'])])
except Exception as e:
    pass

with open('check_ae.json', 'w', encoding='utf-8') as f:
    json.dump(output, f, ensure_ascii=False, indent=2)
