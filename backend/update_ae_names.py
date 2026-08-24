import sqlite3
import json

db_path = "crm.db"

# Map old IDs to new Mock Names
mapping = {
    "90010164": "คุณสมชาย ยอดขาย",
    "90056525": "คุณสมหญิง นำโชค",
    "90003698": "คุณกิตติ ประเสริฐ",
    "90003978": "คุณณัฐพล มั่งคั่ง",
    "90005468": "คุณสุวิทย์ พิชิตดีล",
    "90005898": "คุณอรอนงค์ ทรงพลัง",
    "90005298": "คุณวิชัย ใจสู้",
    "90054135": "คุณนารี ศรีสมบูรณ์",
    "90008852": "คุณธนภัทร รัตนสกุล",
    "90007113": "คุณพงศกร พรประเสริฐ",
    "90000756": "คุณมาลี ดีเลิศ"
}

conn = sqlite3.connect(db_path)
cur = conn.cursor()

for old_id, new_name in mapping.items():
    # Update Customers table
    cur.execute("UPDATE Customers SET ACCOUNT_OWNER = ? WHERE ACCOUNT_OWNER = ?", (new_name, old_id))
    
    # Update Users table
    cur.execute("UPDATE Users SET full_name = ? WHERE full_name = ?", (new_name, old_id))

conn.commit()
conn.close()

print("Successfully updated AE names in database.")
