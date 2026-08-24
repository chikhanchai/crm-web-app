import openpyxl
import time

start = time.time()
path = r"C:\Happy\AI SandBox\CRM\Customer_Profiling_ICT_Solutions_Master_724Accounts_Strict_Web_Crosscheck.xlsx"
print("Loading...")
wb = openpyxl.load_workbook(path)
ws = wb.worksheets[0]
print(f"Loaded in {time.time()-start:.2f}s. Modifying...")
ws.cell(row=5, column=5).value = "TEST"
print("Saving...")
try:
    wb.save(path)
    print(f"Saved in {time.time()-start:.2f}s total.")
except Exception as e:
    print("Error:", e)
