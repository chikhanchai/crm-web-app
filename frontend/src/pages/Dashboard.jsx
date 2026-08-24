import { API_BASE_URL } from '../config';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Search, Building, TableProperties, List, Download } from 'lucide-react';
import * as XLSX from 'xlsx';

const ALL_COLUMNS = [
  { key: "CUSTOMER_NAME", label: "Customer Name" },
  { key: "M_BUSINESS_ID", label: "Tax ID" },
  { key: "CURR_VERTICAL", label: "Vertical" },
  { key: "CURR_BU", label: "Business Unit" },
  { key: "SET_STATUS", label: "SET Status" },
  { key: "FOCUS_TIER", label: "Focus Tier" },
  { key: "CAPITAL_THB", label: "Capital (THB)" },
  { key: "LATEST_REVENUE_THB", label: "Revenue" },
  { key: "LATEST_NET_PROFIT_THB", label: "Net Profit" },
  { key: "EST_NUM_BRANCHES", label: "Branches" },
  { key: "KEY_DECISION_MAKER", label: "Decision Maker" },
  { key: "DM_CONTACT_INFO", label: "Contact Info" },
  { key: "OFFICIAL_WEBSITE", label: "Website" },
  { key: "LINE_OFFICIAL", label: "LINE" },
  { key: "FACEBOOK_PAGE", label: "Facebook" },
  { key: "INSTAGRAM", label: "Instagram" },
  { key: "TIKTOK_SHOP", label: "TikTok" },
  { key: "YOUTUBE_CHANNEL", label: "YouTube" },
  { key: "LINKEDIN_PAGE", label: "LinkedIn" },
  { key: "MOBILE_APPLICATION", label: "Mobile App" },
  { key: "ECOMMERCE_CHANNELS", label: "E-Commerce" },
  { key: "PORTFOLIO_BRANDS", label: "Brands" },
  { key: "SPECIFIC_SERVICES", label: "Services" },
  { key: "INDUSTRY_SEGMENT", label: "Industry" },
  { key: "TARGET_CUSTOMER_TYPE", label: "Target Customer" },
  { key: "PRIMARY_ERP_POS", label: "ERP/POS" },
  { key: "CLOUD_ADOPTION", label: "Cloud" },
  { key: "CALL_CENTER_TYPE", label: "Call Center" },
  { key: "CURRENT_ISP_TELCO", label: "ISP/Telco" },
  { key: "DIGITAL_READINESS_SCORE", label: "Digital Readiness" },
  { key: "ACCOUNT_OWNER", label: "AE Name" },
  { key: "ENGAGEMENT_STATUS", label: "Engagement Status" },
  { key: "TARGET_MEETING_DATE", label: "Meeting Date" },
  { key: "KEY_PAIN_POINT", label: "Pain Point" },
  { key: "NEXT_ACTION_STEP", label: "Next Action" },
  { key: "OPP_NETWORK_SDWAN", label: "OPP SD-WAN" },
  { key: "OPP_CLOUD_BACKUP", label: "OPP Cloud" },
  { key: "OPP_CYBER_SECURITY", label: "OPP Security" },
  { key: "OPP_SMART_RETAIL_IOT", label: "OPP IoT" },
  { key: "OPP_OMNICHANNEL_CRM", label: "OPP CRM" },
  { key: "EST_DEAL_VALUE_THB", label: "Est. Deal Value" },
  { key: "EGG_DATA_ANALYTICS", label: "Egg Data Analytics" },
  { key: "EGG_MARTECH_LINE_CRM", label: "Egg CRM" },
  { key: "EGG_SMART_SMS_A2P", label: "Egg SMS" },
  { key: "EGG_RETAIL_MEDIA_ADS", label: "Egg Ads" },
  { key: "TRUE_EGG_SYNERGY_PROPOSAL", label: "True+Egg Proposal" },
  { key: "EST_EGG_ANNUAL_REVENUE_THB", label: "Egg Rev." },
  { key: "TRUE_IDC_COLOCATION_DC", label: "IDC Colocation" },
  { key: "TRUE_IDC_MULTI_CLOUD", label: "IDC Multi-Cloud" },
  { key: "TRUE_IDC_CLOUD_DIRECT_CONNECT", label: "IDC Direct Connect" },
  { key: "TRUE_IDC_SECURITY_DRAAS", label: "IDC Security" },
  { key: "TRI_PARTY_SYNERGY_PROPOSAL", label: "Tri-Party Proposal" },
  { key: "EST_TRUE_IDC_ANNUAL_REV_THB", label: "IDC Rev." },
  { key: "TDG_DIGITAL_SOLUTIONS", label: "TDG IoT" },
  { key: "TDG_TRUE_ANALYTICS", label: "TDG Analytics" },
  { key: "TDG_CYBERSECURITY", label: "TDG Security" },
  { key: "TDG_DIGITAL_ACADEMY", label: "TDG Academy" },
  { key: "TRUE_ECOSYSTEM_QUAD_SYNERGY", label: "Quad-Party Proposal" },
  { key: "EST_TDG_ANNUAL_REV_THB", label: "TDG Rev." },
  { key: "GREENMOONS_AI_RPA", label: "Greenmoons RPA" },
  { key: "GREENMOONS_IT_DIGITAL_SOLUTION", label: "Greenmoons IT" },
  { key: "GREENMOONS_SOLUTION_FIT", label: "Greenmoons Fit" },
  { key: "GREENMOONS_SUSTAINABILITY_TECH", label: "Greenmoons Sustainability" },
  { key: "TRUE_GREENMOONS_DIGITAL_SYNERGY", label: "5-Pillar Proposal" },
  { key: "EST_GREENMOONS_ANNUAL_REV_THB", label: "Greenmoons Rev." },
];

export default function Dashboard() {
  const [customers, setCustomers] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [bus, setBus] = useState([]);
  const [aes, setAes] = useState([]);
  
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [bu, setBu] = useState('All');
  const [ae, setAe] = useState('All');
  
  const [viewMode, setViewMode] = useState('summary'); // 'summary' or 'excel'
  
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchFilters();
    fetchCustomers();
  }, [industry, bu, ae]); 

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchFilters = async () => {
    try {
      const [indRes, busRes, aesRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/customers/industries`, getAuthHeaders()),
        axios.get(`${API_BASE_URL}/api/customers/bus`, getAuthHeaders()),
        axios.get(`${API_BASE_URL}/api/customers/aes`, getAuthHeaders())
      ]);
      setIndustries(indRes.data);
      setBus(busRes.data);
      setAes(aesRes.data);
    } catch (err) {
      if(err.response?.status === 401) handleLogout();
    }
  };

  const handleExportExcel = () => {
    const exportData = customers.map(c => {
      const row = {};
      ALL_COLUMNS.forEach(col => {
        row[col.label] = c[col.key] !== null && c[col.key] !== undefined ? c[col.key] : "";
      });
      return row;
    });
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");
    XLSX.writeFile(workbook, "CRM_Export.xlsx");
  };

  const fetchCustomers = async (e) => {
    if (e) e.preventDefault();
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (industry !== 'All') params.append('industry', industry);
      if (bu !== 'All') params.append('bu', bu);
      if (ae !== 'All') params.append('ae', ae);
      
      const res = await axios.get(`${API_BASE_URL}/api/customers/?${params.toString()}`, getAuthHeaders());
      setCustomers(res.data.data);
    } catch (err) {
      if(err.response?.status === 401) handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-3 flex justify-between items-center z-10 sticky top-0">
        <div className="flex items-center gap-2">
          <Building className="text-blue-600" />
          <h1 className="text-xl font-bold text-gray-800">CRM Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Logged in as: <span className="font-bold">{user.full_name}</span> ({user.role})
          </div>
          {user.role === 'Admin' && (
            <Link to="/users" className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 px-3 py-1 rounded transition">
              <span className="font-medium">⚙️ Users</span>
            </Link>
          )}
          <button onClick={handleLogout} className="flex items-center gap-1 text-red-600 hover:bg-red-50 px-3 py-1 rounded">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 w-full flex-grow flex flex-col">
        <div className="mb-4">
          <form onSubmit={fetchCustomers} className="flex flex-wrap gap-4 items-end bg-white p-4 rounded shadow-sm border border-gray-100">
            <div className="flex-1 min-w-[250px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Company</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Enter company name..." 
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
            
            <div className="w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Industry</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded shadow-sm bg-white"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              >
                <option value="All">All Industries</option>
                {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
              </select>
            </div>

            {user.role === 'Admin' && bus.length > 0 && (
              <div className="w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by BU</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded shadow-sm bg-white"
                  value={bu}
                  onChange={(e) => setBu(e.target.value)}
                >
                  <option value="All">All BUs</option>
                  {bus.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            )}

            {['Admin', 'BU'].includes(user.role) && aes.length > 0 && (
              <div className="w-48">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by AE</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded shadow-sm bg-white"
                  value={ae}
                  onChange={(e) => setAe(e.target.value)}
                >
                  <option value="All">All AEs</option>
                  {aes.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            )}

            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition">
              Search
            </button>
          </form>
        </div>

        {/* View Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode('summary')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded shadow-sm transition ${viewMode === 'summary' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
            >
              <List size={16} /> Summary View
            </button>
            <button 
              onClick={() => setViewMode('excel')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded shadow-sm transition ${viewMode === 'excel' ? 'bg-green-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
            >
              <TableProperties size={16} /> Excel View (All Columns)
            </button>
            <button 
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded shadow-sm transition bg-white text-gray-700 hover:bg-gray-50 border border-green-600 border-2"
            >
              <Download size={16} className="text-green-600" /> <span className="text-green-700 font-bold">Export to Excel</span>
            </button>
          </div>
          <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full border border-gray-200 shadow-sm">
            Total Records: <span className="font-bold text-gray-800">{customers.length}</span>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded shadow overflow-x-auto flex-grow border border-gray-200">
          
          {viewMode === 'summary' ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 shadow-sm z-10">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Company Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tax ID</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Industry</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">AE Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{c.CUSTOMER_NAME}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{c.M_BUSINESS_ID || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{c.INDUSTRY_SEGMENT || '-'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{c.ACCOUNT_OWNER || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-blue-600 hover:text-blue-900 font-medium">
                      <Link to={`/customers/${c.id}`}>View & Edit</Link>
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-500 font-medium">No customers found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            /* EXCEL VIEW (ALL COLUMNS) */
            <div className="overflow-auto max-h-[70vh]">
              <table className="min-w-max divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100 sticky top-0 shadow-sm z-10">
                  <tr>
                    <th className="px-4 py-2 text-left font-bold text-gray-700 border-r border-gray-200 bg-gray-100 sticky left-0 z-20">Actions</th>
                    {ALL_COLUMNS.map(col => (
                      <th key={col.key} className="px-4 py-2 text-left font-bold text-gray-600 border-r border-gray-200 whitespace-nowrap">
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-green-50 transition-colors">
                      <td className="px-4 py-2 whitespace-nowrap border-r border-gray-200 bg-white sticky left-0 z-10">
                        <Link to={`/customers/${c.id}`} className="text-blue-600 font-bold hover:underline">Edit</Link>
                      </td>
                      {ALL_COLUMNS.map(col => (
                        <td key={col.key} className="px-4 py-2 border-r border-gray-100 whitespace-nowrap text-gray-700 max-w-[300px] overflow-hidden text-ellipsis">
                          {c[col.key] !== null && c[col.key] !== undefined ? String(c[col.key]) : '-'}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr>
                      <td colSpan={ALL_COLUMNS.length + 1} className="px-6 py-10 text-center text-gray-500 font-medium">
                        No customers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
