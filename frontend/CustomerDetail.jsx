import { API_BASE_URL } from '../config';
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Save } from 'lucide-react';
import InteractionsTab from '../components/InteractionsTab';
import OpportunitiesTab from '../components/OpportunitiesTab';
import WalletTab from '../components/WalletTab';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/customers/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setCustomer(res.data);
      } catch (err) {
        if(err.response?.status === 401) navigate('/login');
        if(err.response?.status === 403) {
          alert('Not authorized to view this record');
          navigate('/');
        }
      }
    };
    fetchCustomer();
  }, [id, navigate]);

  const handleChange = (field, value) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await axios.put(`${API_BASE_URL}/api/customers/${id}`, customer, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Saved successfully!');
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Failed to save data. You may not have permission.';
      alert('Error: ' + errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  if (!customer) return <div className="p-10 text-center">Loading...</div>;

  const tabs = [
    { id: 'activities', label: 'Activity Log' },
    { id: 'opportunities_v2', label: 'Opportunities (V2)' },
    { id: 'wallet', label: 'Share of Wallet' },
    { id: 'overview', label: 'Overview & Contact' },
    { id: 'digital', label: 'Digital & Tech Stack' },
    { id: 'needs', label: 'Sales & Needs' },
    { id: 'opps', label: 'True Opportunities' },
    { id: 'synergy', label: 'Ecosystem Synergies' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-white shadow-sm px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <Link to="/" className="text-gray-500 hover:text-gray-800"><ArrowLeft /></Link>
        <div>
          <h1 className="text-xl font-bold text-gray-800">{customer.CUSTOMER_NAME}</h1>
          <p className="text-sm text-gray-500">Tax ID: {customer.M_BUSINESS_ID}</p>
        </div>
        <div className="ml-auto">
          <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 disabled:opacity-50">
            <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6">
        {/* Tabs Header */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto bg-white rounded-t shadow-sm">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-b-2 border-blue-600 text-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-white p-8 rounded-b shadow">
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Basic & Financial Profile</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Field label="Customer Name" val={customer.CUSTOMER_NAME} onChange={v => handleChange('CUSTOMER_NAME', v)} />
                <Field label="Tax ID (M_BUSINESS_ID)" val={customer.M_BUSINESS_ID} onChange={v => handleChange('M_BUSINESS_ID', v)} />
                <Field label="Vertical" val={customer.CURR_VERTICAL} onChange={v => handleChange('CURR_VERTICAL', v)} />
                <Field label="Business Unit" val={customer.CURR_BU} onChange={v => handleChange('CURR_BU', v)} />
                <Field label="SET Status" val={customer.SET_STATUS} onChange={v => handleChange('SET_STATUS', v)} />
                <Field label="Focus Tier" val={customer.FOCUS_TIER} onChange={v => handleChange('FOCUS_TIER', v)} />
                <Field label="Capital (THB)" val={customer.CAPITAL_THB} type="number" onChange={v => handleChange('CAPITAL_THB', v)} />
                <Field label="Latest Revenue (THB)" val={customer.LATEST_REVENUE_THB} type="number" onChange={v => handleChange('LATEST_REVENUE_THB', v)} />
                <Field label="Latest Net Profit (THB)" val={customer.LATEST_NET_PROFIT_THB} type="number" onChange={v => handleChange('LATEST_NET_PROFIT_THB', v)} />
                <Field label="Est. Employees" val={customer.EMPLOYEE_COUNT_EST} onChange={v => handleChange('EMPLOYEE_COUNT_EST', v)} />
                <Field label="Est. Branches" val={customer.EST_NUM_BRANCHES} type="number" onChange={v => handleChange('EST_NUM_BRANCHES', v)} />
              </div>

              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Stakeholders & Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field label="Key Decision Maker" val={customer.KEY_DECISION_MAKER} onChange={v => handleChange('KEY_DECISION_MAKER', v)} />
                <Field label="Contact Info" val={customer.DM_CONTACT_INFO} onChange={v => handleChange('DM_CONTACT_INFO', v)} />
              </div>
            </div>
          )}

          {activeTab === 'digital' && (
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Digital Footprint</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <Field label="Official Website" val={customer.OFFICIAL_WEBSITE} onChange={v => handleChange('OFFICIAL_WEBSITE', v)} />
                <Field label="LINE Official" val={customer.LINE_OFFICIAL} onChange={v => handleChange('LINE_OFFICIAL', v)} />
                <Field label="Facebook Page" val={customer.FACEBOOK_PAGE} onChange={v => handleChange('FACEBOOK_PAGE', v)} />
                <Field label="Instagram" val={customer.INSTAGRAM} onChange={v => handleChange('INSTAGRAM', v)} />
                <Field label="TikTok Shop" val={customer.TIKTOK_SHOP} onChange={v => handleChange('TIKTOK_SHOP', v)} />
                <Field label="YouTube Channel" val={customer.YOUTUBE_CHANNEL} onChange={v => handleChange('YOUTUBE_CHANNEL', v)} />
                <Field label="LinkedIn Page" val={customer.LINKEDIN_PAGE} onChange={v => handleChange('LINKEDIN_PAGE', v)} />
                <Field label="Mobile Application" val={customer.MOBILE_APPLICATION} onChange={v => handleChange('MOBILE_APPLICATION', v)} />
                <Field label="E-Commerce Channels" val={customer.ECOMMERCE_CHANNELS} onChange={v => handleChange('ECOMMERCE_CHANNELS', v)} />
              </div>

              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Portfolio & Tech Stack</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Field label="Portfolio Brands" val={customer.PORTFOLIO_BRANDS} onChange={v => handleChange('PORTFOLIO_BRANDS', v)} />
                <Field label="Specific Services" val={customer.SPECIFIC_SERVICES} onChange={v => handleChange('SPECIFIC_SERVICES', v)} />
                <Field label="Main Segment" val={customer.MAIN_SEGMENT} onChange={v => handleChange('MAIN_SEGMENT', v)} />
                <Field label="Industry Segment" val={customer.INDUSTRY_SEGMENT} onChange={v => handleChange('INDUSTRY_SEGMENT', v)} />
                <Field label="Target Customer Type" val={customer.TARGET_CUSTOMER_TYPE} onChange={v => handleChange('TARGET_CUSTOMER_TYPE', v)} />
                <Field label="Primary ERP/POS" val={customer.PRIMARY_ERP_POS} onChange={v => handleChange('PRIMARY_ERP_POS', v)} />
                <Field label="Cloud Adoption" val={customer.CLOUD_ADOPTION} onChange={v => handleChange('CLOUD_ADOPTION', v)} />
                <Field label="Call Center Type" val={customer.CALL_CENTER_TYPE} onChange={v => handleChange('CALL_CENTER_TYPE', v)} />
                <Field label="Current ISP/Telco" val={customer.CURRENT_ISP_TELCO} onChange={v => handleChange('CURRENT_ISP_TELCO', v)} />
                <Field label="Digital Readiness Score" val={customer.DIGITAL_READINESS_SCORE} type="number" onChange={v => handleChange('DIGITAL_READINESS_SCORE', v)} />
              </div>
            </div>
          )}

          {activeTab === 'needs' && (
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Sales Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Field label="AE Name" val={customer.ACCOUNT_OWNER} onChange={v => handleChange('ACCOUNT_OWNER', v)} />
                <Field label="Engagement Status" val={customer.ENGAGEMENT_STATUS} onChange={v => handleChange('ENGAGEMENT_STATUS', v)} />
                <Field label="Target Meeting Date" val={customer.TARGET_MEETING_DATE} type="date" onChange={v => handleChange('TARGET_MEETING_DATE', v)} />
              </div>
              
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">Business Needs</h3>
              <div className="grid grid-cols-1 gap-6">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Key Pain Point</label>
                  <textarea 
                    className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]" 
                    value={customer.KEY_PAIN_POINT || ''} 
                    onChange={e => handleChange('KEY_PAIN_POINT', e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Next Action Step</label>
                  <textarea 
                    className="w-full p-3 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]" 
                    value={customer.NEXT_ACTION_STEP || ''} 
                    onChange={e => handleChange('NEXT_ACTION_STEP', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'opps' && (
            <div>
              <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">True Business Opportunities</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Field label="SD-WAN / Network" val={customer.OPP_NETWORK_SDWAN} onChange={v => handleChange('OPP_NETWORK_SDWAN', v)} />
                <Field label="Cloud / DRaaS" val={customer.OPP_CLOUD_BACKUP} onChange={v => handleChange('OPP_CLOUD_BACKUP', v)} />
                <Field label="Cybersecurity" val={customer.OPP_CYBER_SECURITY} onChange={v => handleChange('OPP_CYBER_SECURITY', v)} />
                <Field label="Smart Retail / IoT" val={customer.OPP_SMART_RETAIL_IOT} onChange={v => handleChange('OPP_SMART_RETAIL_IOT', v)} />
                <Field label="Omnichannel CRM" val={customer.OPP_OMNICHANNEL_CRM} onChange={v => handleChange('OPP_OMNICHANNEL_CRM', v)} />
                <Field label="Est. Deal Value (THB)" val={customer.EST_DEAL_VALUE_THB} type="number" onChange={v => handleChange('EST_DEAL_VALUE_THB', v)} />
              </div>
            </div>
          )}

          {activeTab === 'activities' && <InteractionsTab customerId={id} />}
          {activeTab === 'opportunities_v2' && <OpportunitiesTab customerId={id} />}
          {activeTab === 'wallet' && <WalletTab customerId={id} />}

          {activeTab === 'synergy' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-orange-50 p-6 rounded border border-orange-200">
                <h3 className="font-bold text-orange-700 text-lg mb-4 border-b border-orange-200 pb-2">Egg Digital Synergy</h3>
                <div className="space-y-4">
                  <Field label="Data Analytics" val={customer.EGG_DATA_ANALYTICS} onChange={v => handleChange('EGG_DATA_ANALYTICS', v)} />
                  <Field label="LINE CRM & MarTech" val={customer.EGG_MARTECH_LINE_CRM} onChange={v => handleChange('EGG_MARTECH_LINE_CRM', v)} />
                  <Field label="Smart SMS A2P" val={customer.EGG_SMART_SMS_A2P} onChange={v => handleChange('EGG_SMART_SMS_A2P', v)} />
                  <Field label="Retail Media Ads" val={customer.EGG_RETAIL_MEDIA_ADS} onChange={v => handleChange('EGG_RETAIL_MEDIA_ADS', v)} />
                  <Field label="True+Egg Proposal" val={customer.TRUE_EGG_SYNERGY_PROPOSAL} onChange={v => handleChange('TRUE_EGG_SYNERGY_PROPOSAL', v)} />
                  <Field label="Est. Annual Revenue (THB)" val={customer.EST_EGG_ANNUAL_REVENUE_THB} type="number" onChange={v => handleChange('EST_EGG_ANNUAL_REVENUE_THB', v)} />
                </div>
              </div>
              
              <div className="bg-blue-50 p-6 rounded border border-blue-200">
                <h3 className="font-bold text-blue-700 text-lg mb-4 border-b border-blue-200 pb-2">True IDC Synergy</h3>
                <div className="space-y-4">
                  <Field label="Colocation DC" val={customer.TRUE_IDC_COLOCATION_DC} onChange={v => handleChange('TRUE_IDC_COLOCATION_DC', v)} />
                  <Field label="Multi-Cloud" val={customer.TRUE_IDC_MULTI_CLOUD} onChange={v => handleChange('TRUE_IDC_MULTI_CLOUD', v)} />
                  <Field label="Cloud Direct Connect" val={customer.TRUE_IDC_CLOUD_DIRECT_CONNECT} onChange={v => handleChange('TRUE_IDC_CLOUD_DIRECT_CONNECT', v)} />
                  <Field label="Security & DRaaS" val={customer.TRUE_IDC_SECURITY_DRAAS} onChange={v => handleChange('TRUE_IDC_SECURITY_DRAAS', v)} />
                  <Field label="Tri-Party Proposal" val={customer.TRI_PARTY_SYNERGY_PROPOSAL} onChange={v => handleChange('TRI_PARTY_SYNERGY_PROPOSAL', v)} />
                  <Field label="Est. Annual Revenue (THB)" val={customer.EST_TRUE_IDC_ANNUAL_REV_THB} type="number" onChange={v => handleChange('EST_TRUE_IDC_ANNUAL_REV_THB', v)} />
                </div>
              </div>
              
              <div className="bg-teal-50 p-6 rounded border border-teal-200">
                <h3 className="font-bold text-teal-700 text-lg mb-4 border-b border-teal-200 pb-2">True Digital Group Synergy</h3>
                <div className="space-y-4">
                  <Field label="Digital Solutions (IoT)" val={customer.TDG_DIGITAL_SOLUTIONS} onChange={v => handleChange('TDG_DIGITAL_SOLUTIONS', v)} />
                  <Field label="True Analytics" val={customer.TDG_TRUE_ANALYTICS} onChange={v => handleChange('TDG_TRUE_ANALYTICS', v)} />
                  <Field label="Cybersecurity (SOC)" val={customer.TDG_CYBERSECURITY} onChange={v => handleChange('TDG_CYBERSECURITY', v)} />
                  <Field label="Digital Academy" val={customer.TDG_DIGITAL_ACADEMY} onChange={v => handleChange('TDG_DIGITAL_ACADEMY', v)} />
                  <Field label="Quad-Party Proposal" val={customer.TRUE_ECOSYSTEM_QUAD_SYNERGY} onChange={v => handleChange('TRUE_ECOSYSTEM_QUAD_SYNERGY', v)} />
                  <Field label="Est. Annual Revenue (THB)" val={customer.EST_TDG_ANNUAL_REV_THB} type="number" onChange={v => handleChange('EST_TDG_ANNUAL_REV_THB', v)} />
                </div>
              </div>
              
              <div className="bg-green-50 p-6 rounded border border-green-200">
                <h3 className="font-bold text-green-700 text-lg mb-4 border-b border-green-200 pb-2">Greenmoons Synergy</h3>
                <div className="space-y-4">
                  <Field label="AI & RPA" val={customer.GREENMOONS_AI_RPA} onChange={v => handleChange('GREENMOONS_AI_RPA', v)} />
                  <Field label="IT Digital Solution" val={customer.GREENMOONS_IT_DIGITAL_SOLUTION} onChange={v => handleChange('GREENMOONS_IT_DIGITAL_SOLUTION', v)} />
                  <Field label="Solution Fit" val={customer.GREENMOONS_SOLUTION_FIT} onChange={v => handleChange('GREENMOONS_SOLUTION_FIT', v)} />
                  <Field label="Sustainability Tech" val={customer.GREENMOONS_SUSTAINABILITY_TECH} onChange={v => handleChange('GREENMOONS_SUSTAINABILITY_TECH', v)} />
                  <Field label="5-Pillar Proposal" val={customer.TRUE_GREENMOONS_DIGITAL_SYNERGY} onChange={v => handleChange('TRUE_GREENMOONS_DIGITAL_SYNERGY', v)} />
                  <Field label="Est. Annual Revenue (THB)" val={customer.EST_GREENMOONS_ANNUAL_REV_THB} type="number" onChange={v => handleChange('EST_GREENMOONS_ANNUAL_REV_THB', v)} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, val, onChange, type="text" }) {
  // Use a helper to display numbers properly without causing input issues, 
  // but since it's an uncontrolled-like behavior controlled by parent, simple input is fine.
  // Added formatting classes to look consistent.
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input 
        type={type} 
        className="w-full p-2.5 bg-white border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow" 
        value={val !== null ? val : ''} 
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
