import sqlite3
import json

# Define the 15-20 macro segments
MACRO_SEGMENTS = [
    "Technology & IT",
    "Manufacturing & Industrial",
    "Retail, Wholesale & E-commerce",
    "Food, Beverage & Agriculture",
    "Logistics & Transportation",
    "Healthcare & Pharmaceuticals",
    "Financial Services & Insurance",
    "Real Estate & Construction",
    "Marketing & Media",
    "Professional Services & Consulting",
    "Automotive & Vehicles",
    "Hospitality & Tourism",
    "Education & Training",
    "Energy & Utilities",
    "Telecommunications",
    "Consumer Services & Others",
    "Government & Non-Profit"
]

def map_segment(val):
    val_lower = val.lower()
    
    # Keyword checks
    if any(k in val_lower for k in ['it', 'tech', 'software', 'hardware', 'data', 'computer', 'digital', 'cyber', 'electronics', 'internet', 'platform', 'app', 'system']):
        if 'agriculture' not in val_lower and 'food' not in val_lower:
            return "Technology & IT"
            
    if any(k in val_lower for k in ['manufactur', 'industrial', 'automation', 'equipment', 'chemical', 'packaging', 'machinery', 'metal', 'plastic', 'steel', 'factory', 'production', 'material']):
        return "Manufacturing & Industrial"
        
    if any(k in val_lower for k in ['retail', 'wholesale', 'trading', 'consumer', 'fashion', 'apparel', 'e-commerce', 'ecommerce', 'supermarket', 'store', 'mall', 'grocery', 'jewelry', 'cosmetics', 'import', 'export']):
        return "Retail, Wholesale & E-commerce"
        
    if any(k in val_lower for k in ['food', 'beverage', 'agricultur', 'farm', 'ingredient', 'restaurant', 'cafe', 'catering', 'f&b', 'meat', 'feed', 'crop']):
        return "Food, Beverage & Agriculture"
        
    if any(k in val_lower for k in ['logistic', 'supply chain', 'ship', 'transport', 'warehouse', 'delivery', 'freight', 'cargo', 'courier', 'maritime', 'aviation', 'airlines']):
        return "Logistics & Transportation"
        
    if any(k in val_lower for k in ['health', 'pharma', 'medical', 'hospital', 'clinic', 'beauty', 'wellness', 'care', 'medicine', 'dental', 'laboratory']):
        return "Healthcare & Pharmaceuticals"
        
    if any(k in val_lower for k in ['financ', 'insur', 'debt', 'leasing', 'bank', 'invest', 'payment', 'capital', 'wealth', 'credit', 'broker']):
        return "Financial Services & Insurance"
        
    if any(k in val_lower for k in ['real estate', 'property', 'construct', 'engineer', 'architect', 'building', 'contractor', 'developer', 'housing']):
        return "Real Estate & Construction"
        
    if any(k in val_lower for k in ['market', 'advertis', 'media', 'publish', 'entertain', 'agency', 'pr', 'broadcasting', 'event', 'content']):
        return "Marketing & Media"
        
    if any(k in val_lower for k in ['consult', 'legal', 'bpo', 'outsourc', 'hr', 'recruit', 'audit', 'law', 'accounting', 'management', 'service', 'call center', 'certification']):
        return "Professional Services & Consulting"
        
    if any(k in val_lower for k in ['auto', 'vehicle', 'car', 'motor', 'tire', 'part', 'garage', 'dealer']):
        return "Automotive & Vehicles"
        
    if any(k in val_lower for k in ['hospitality', 'tour', 'hotel', 'travel', 'attraction', 'resort', 'leisure']):
        return "Hospitality & Tourism"
        
    if any(k in val_lower for k in ['educat', 'train', 'school', 'university', 'academy', 'learning', 'student']):
        return "Education & Training"
        
    if any(k in val_lower for k in ['energy', 'utilit', 'mining', 'oil', 'gas', 'power', 'solar', 'water', 'petroleum', 'electricity']):
        return "Energy & Utilities"
        
    if any(k in val_lower for k in ['telecom', 'isp', 'network', 'communication']):
        return "Telecommunications"
        
    if any(k in val_lower for k in ['gov', 'ngo', 'non-profit', 'association', 'public', 'state', 'foundation']):
        return "Government & Non-Profit"
        
    # Catch-all
    if any(k in val_lower for k in ['clean', 'securit', 'maintain', 'laundry', 'salon', 'spa', 'fitness', 'consumer service', 'membership']):
        return "Consumer Services & Others"

    # Default fallback
    return "Consumer Services & Others"

conn = sqlite3.connect('crm.db')
cur = conn.cursor()
cur.execute('SELECT id, INDUSTRY_SEGMENT FROM Customers WHERE INDUSTRY_SEGMENT IS NOT NULL')
rows = cur.fetchall()

update_count = 0
for row in rows:
    cid, old_seg = row
    if not old_seg or old_seg == '-':
        continue
    new_seg = map_segment(old_seg)
    cur.execute('UPDATE Customers SET INDUSTRY_SEGMENT = ? WHERE id = ?', (new_seg, cid))
    update_count += 1

conn.commit()
conn.close()

print(f"Successfully grouped {update_count} records into Macro Segments.")
