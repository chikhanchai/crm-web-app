import sqlite3
conn = sqlite3.connect('crm.db')
cur = conn.cursor()
# Find the row ID of the descriptive header
cur.execute("SELECT id, CUSTOMER_NAME FROM Customers WHERE CUSTOMER_NAME LIKE '%ชื่อลูกค้าองค์กร%' OR M_BUSINESS_ID LIKE '%เลข%'")
rows = cur.fetchall()
for r in rows:
    print("Deleting row:", r[0])
    cur.execute("DELETE FROM Customers WHERE id = ?", (r[0],))
conn.commit()
conn.close()
