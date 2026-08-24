import json
with open('verification.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
    print(f"Total Checked: {data['total_checked']}")
    print(f"Matches: {data['matches']}")
    print(f"Mismatches: {len(data['mismatches'])}")
    if data['mismatches']:
        with open('mismatches_summary.txt', 'w', encoding='utf-8') as out:
            for m in data['mismatches']:
                out.write(f"{m['company']} | Excel: {m['excel_ae']} | DB: {m['db_ae']}\n")
