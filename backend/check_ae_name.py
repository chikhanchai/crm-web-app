import pandas as pd
df = pd.read_excel('C:/Happy/AI SandBox/CRM/Customer_Profiling_ICT_Solutions_Master_724Accounts_Strict_Web_Crosscheck.xlsx', engine='openpyxl', header=None)

for i, val in enumerate(df.iloc[1]):
    print(f"Col {i}: {str(val).encode('utf-8')}")
