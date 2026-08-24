import os
import pandas as pd
import sqlite3

EXCEL_PATH = r"C:\Happy\AI SandBox\CRM\Customer_Profiling_ICT_Solutions_Master_724Accounts_Strict_Web_Crosscheck.xlsx"
DB_PATH = r"C:\Happy\AI SandBox\CRM\crm_web_app\backend\crm.db"

# Column names based on the updated Excel structure (65 columns, ENGAGEMENT_STATUS removed)
COL_NAMES = [
    "CURR_VERTICAL", "CURR_BU", "M_BUSINESS_ID", "CUSTOMER_NAME", "SET_STATUS", "FOCUS_TIER", "CAPITAL_THB",
    "LATEST_REVENUE_THB", "LATEST_NET_PROFIT_THB", "EST_NUM_BRANCHES", "OFFICIAL_WEBSITE", "LINE_OFFICIAL",
    "FACEBOOK_PAGE", "INSTAGRAM", "TIKTOK_SHOP", "YOUTUBE_CHANNEL", "LINKEDIN_PAGE", "MOBILE_APPLICATION",
    "ECOMMERCE_CHANNELS", "PRIMARY_ERP_POS", "CLOUD_ADOPTION", "CALL_CENTER_TYPE", "CURRENT_ISP_TELCO",
    "DIGITAL_READINESS_SCORE", "KEY_DECISION_MAKER", "DM_CONTACT_INFO", "AE_ID", "ACCOUNT_OWNER",
    "TARGET_MEETING_DATE", "KEY_PAIN_POINT", "OPP_NETWORK_SDWAN", "OPP_CLOUD_BACKUP", "OPP_CYBER_SECURITY",
    "OPP_SMART_RETAIL_IOT", "OPP_OMNICHANNEL_CRM", "EST_DEAL_VALUE_THB", "NEXT_ACTION_STEP", "EGG_DATA_ANALYTICS",
    "EGG_MARTECH_LINE_CRM", "EGG_SMART_SMS_A2P", "EGG_RETAIL_MEDIA_ADS", "TRUE_EGG_SYNERGY_PROPOSAL",
    "EST_EGG_ANNUAL_REVENUE_THB", "TRUE_IDC_COLOCATION_DC", "TRUE_IDC_MULTI_CLOUD", "TRUE_IDC_CLOUD_DIRECT_CONNECT",
    "TRUE_IDC_SECURITY_DRAAS", "TRI_PARTY_SYNERGY_PROPOSAL", "EST_TRUE_IDC_ANNUAL_REV_THB", "TDG_DIGITAL_SOLUTIONS",
    "TDG_TRUE_ANALYTICS", "TDG_CYBERSECURITY", "TDG_DIGITAL_ACADEMY", "TRUE_ECOSYSTEM_QUAD_SYNERGY",
    "EST_TDG_ANNUAL_REV_THB", "GREENMOONS_AI_RPA", "GREENMOONS_IT_DIGITAL_SOLUTION", "GREENMOONS_SOLUTION_FIT",
    "GREENMOONS_SUSTAINABILITY_TECH", "TRUE_GREENMOONS_DIGITAL_SYNERGY", "EST_GREENMOONS_ANNUAL_REV_THB",
    "PORTFOLIO_BRANDS", "SPECIFIC_SERVICES", "INDUSTRY_SEGMENT", "TARGET_CUSTOMER_TYPE"
]

def migrate():
    print("Reading Excel file...")
    # Load 65 columns, starting from row index 4
    df = pd.read_excel(EXCEL_PATH, sheet_name=0, usecols=range(65), skiprows=4, header=None)
    df.columns = COL_NAMES
    
    # We still want ENGAGEMENT_STATUS in the database to not break the frontend
    df['ENGAGEMENT_STATUS'] = ''
    
    # Clean up empty rows
    df = df.dropna(subset=['CUSTOMER_NAME'])
    df = df[~df['CUSTOMER_NAME'].astype(str).str.contains("ชื่อลูกค้าองค์กร")]

    print(f"Loaded {len(df)} records. Connecting to SQLite...")
    
    if os.path.exists(DB_PATH):
        try:
            os.remove(DB_PATH)
        except Exception as e:
            print(f"Error removing DB, make sure backend is stopped. {e}")
            return
        
    conn = sqlite3.connect(DB_PATH)
    
    # Drop AE_ID as it's not needed in frontend table
    df_to_save = df.drop(columns=['AE_ID'])
    df_to_save.to_sql("Customers", conn, if_exists="replace", index=True, index_label="id")
    
    cursor = conn.cursor()
    cursor.execute('''
    CREATE TABLE Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        full_name TEXT,
        bu_name TEXT
    )
    ''')
    
    unique_owners = df['ACCOUNT_OWNER'].dropna().unique()
    unique_bus = df['CURR_BU'].dropna().unique()
    
    users_data = []
    users_data.append(("admin", "admin123", "Admin", "System Administrator", None))
    
    for bu in unique_bus:
        if str(bu).strip() and str(bu) != '-':
            username = f"bu_{str(bu).lower().replace(' ', '_')}"
            users_data.append((username, "password", "BU", f"Head of {bu}", bu))
            
    ae_map = df[['AE_ID', 'ACCOUNT_OWNER', 'CURR_BU']].dropna().drop_duplicates(subset=['ACCOUNT_OWNER'])
    for _, row in ae_map.iterrows():
        owner = str(row['ACCOUNT_OWNER']).strip()
        ae_id = str(row['AE_ID']).strip()
        owner_bu = str(row['CURR_BU']).strip()
        
        if owner and owner != '-' and owner != 'nan':
            if not ae_id or ae_id == 'nan' or ae_id == '-':
                username = owner.split()[0].lower()
            else:
                try:
                    username = str(int(float(ae_id)))
                except:
                    username = ae_id
            users_data.append((username, "password", "AE", owner, owner_bu))
            
    cursor.executemany('''
    INSERT INTO Users (username, password, role, full_name, bu_name)
    VALUES (?, ?, ?, ?, ?)
    ''', users_data)
    
    conn.commit()
    conn.close()
    print("Database migration completed successfully!")
    print(f"Created {len(users_data)} mock users.")

if __name__ == '__main__':
    migrate()
