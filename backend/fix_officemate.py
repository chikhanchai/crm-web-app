import sqlite3
conn = sqlite3.connect('crm.db')
cur = conn.cursor()
cur.execute("UPDATE Customers SET ACCOUNT_OWNER = 'เจณิษา วงวัชรโสภณ' WHERE CUSTOMER_NAME LIKE '%ออฟฟิศเมท (ไทย) จำกัด%'")
print('Updated rows:', cur.rowcount)
conn.commit()
conn.close()
