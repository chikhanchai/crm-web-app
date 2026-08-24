import pandas as pd
import json

df = pd.read_excel('C:/Happy/AI SandBox/CRM/Customer_Profiling_ICT_Solutions_Master_724Accounts_Strict_Web_Crosscheck.xlsx', engine='openpyxl', header=3)
cols = [str(c) for c in df.columns]

with open('cols.json', 'w', encoding='utf-8') as f:
    json.dump(cols, f, ensure_ascii=False)
