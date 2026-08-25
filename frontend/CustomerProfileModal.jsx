import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { Link } from 'react-router-dom';
import { 
  X, Building2, MapPin, Store, Briefcase, Users, Phone, Mail, 
  Globe, Wifi, Cloud, Shield, Headset, Laptop, Camera, 
  AlertTriangle, TrendingUp, BarChart3, Target, CheckCircle2 
} from 'lucide-react';

const formatNumber = (val) => {
  if (val === null || val === undefined || val === '') return '-';
  const num = Number(val);
  return isNaN(num) ? val : num.toLocaleString('en-US');
};

const formatMB = (val) => {
  if (val === null || val === undefined || val === '') return '-';
  const num = Number(val);
  if (isNaN(num)) return val;
  return (num / 1000000).toLocaleString('en-US', {maximumFractionDigits: 0}) + ' MB';
};

const getTierBadgeClass = (tier) => {
  if (!tier) return "bg-gray-100 text-gray-700";
  const t = String(tier).toLowerCase();
  if (t.includes('premium')) return "bg-green-100 text-green-800 border-green-300";
  if (t.includes('gold')) return "bg-yellow-100 text-yellow-800 border-yellow-300";
  if (t.includes('silver')) return "bg-blue-100 text-blue-800 border-blue-300";
  if (t.includes('key focus')) return "bg-pink-100 text-pink-800 border-pink-300";
  return "bg-gray-100 text-gray-700 border-gray-300";
};

const SectionTitle = ({ num, title }) => (
  <h2 className="text-[13px] font-bold text-[#1a2b49] tracking-wider uppercase flex items-center gap-2 mb-4">
    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[11px]">{num}</span>
    {title}
  </h2>
);

const StatBox = ({ icon, label, value, color }) => {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    green: 'bg-green-50 text-green-600 border-green-100',
    yellow: 'bg-orange-50 text-orange-500 border-orange-100'
  };
  const textColors = { blue: 'text-blue-800', green: 'text-green-800', yellow: 'text-orange-700' };
  return (
    <div className={`p-4 rounded-xl border ${colors[color]} flex items-center gap-4 flex-1`}>
       <div className="p-2 bg-white rounded-lg shadow-sm">{icon}</div>
       <div>
          <p className="text-[11px] font-bold uppercase opacity-80">{label}</p>
          <p className={`text-xl font-black ${textColors[color]}`}>{value}</p>
       </div>
    </div>
  );
};

const TechRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 text-sm py-1.5 border-b border-gray-50 last:border-0">
     <div className="flex items-center gap-2 w-32 text-gray-700 font-bold">
        <div className="text-gray-400">{icon}</div> {label}
     </div>
     <div className="text-gray-600 flex-1 truncate">{value || '-'}</div>
  </div>
);

export default function CustomerProfileModal({ customer, onClose }) {
  const [wallets, setWallets] = useState([]);
  const [loadingWallets, setLoadingWallets] = useState(true);

  useEffect(() => {
    const fetchWallets = async () => {
      if (!customer?.id) return;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/wallet/customer/${customer.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWallets(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingWallets(false);
      }
    };
    fetchWallets();
  }, [customer]);

  if (!customer) return null;

  // Extract Opportunities
  const opps = [];
  if (customer.OPP_NETWORK_SDWAN && customer.OPP_NETWORK_SDWAN !== '-') opps.push("Network/SD-WAN");
  if (customer.OPP_CLOUD_BACKUP && customer.OPP_CLOUD_BACKUP !== '-') opps.push("Cloud & Backup");
  if (customer.OPP_CYBER_SECURITY && customer.OPP_CYBER_SECURITY !== '-') opps.push("Cybersecurity");
  if (customer.OPP_SMART_RETAIL_IOT && customer.OPP_SMART_RETAIL_IOT !== '-') opps.push("IoT & Smart Retail");
  if (customer.OPP_OMNICHANNEL_CRM && customer.OPP_OMNICHANNEL_CRM !== '-') opps.push("Omnichannel/CRM");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-[1300px] my-8 relative flex flex-col overflow-hidden">
        
        {/* Top bar with close and edit */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
           <Link 
             to={`/customers/${customer.id}`} 
             className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 px-4 rounded-full shadow-sm transition"
           >
             Edit Profile
           </Link>
           <button onClick={onClose} className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition">
             <X size={20} />
           </button>
        </div>

        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-gray-100 pb-5 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-[#1a2b49] tracking-tight">{customer.CUSTOMER_NAME}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getTierBadgeClass(customer.FOCUS_TIER)}`}>
                  {customer.FOCUS_TIER || 'No Tier'}
                </span>
              </div>
              <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                <Building2 size={16}/> Tax ID: {customer.M_BUSINESS_ID || '-'} 
                <span className="text-gray-300">|</span> {customer.CURR_VERTICAL || '-'}
              </p>
            </div>
            <div className="flex gap-8 text-right pr-32">
              <div className="flex items-center gap-3 text-gray-700">
                <Store className="text-blue-600" size={24}/>
                <div className="text-sm leading-tight text-left">
                  <div className="font-bold">{customer.INDUSTRY_SEGMENT || '-'}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700 border-l border-gray-200 pl-8">
                <MapPin className="text-slate-700" size={24}/>
                <div className="text-sm leading-tight text-left">
                  <div className="font-bold text-lg">{customer.EST_NUM_BRANCHES ? formatNumber(customer.EST_NUM_BRANCHES) : '-'}</div>
                  <div className="text-gray-500">branches</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Left 2/3 Column */}
            <div className="col-span-12 lg:col-span-8 space-y-6">
              
              {/* 1. BUSINESS SNAPSHOT */}
              <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
                <SectionTitle num="1" title="Business Snapshot" />
                <div className="flex flex-col xl:flex-row gap-6">
                  <div className="flex gap-3 flex-1">
                    <StatBox icon={<Store size={18}/>} label="Revenue (THB)" value={formatMB(customer.LATEST_REVENUE_THB)} color="blue" />
                    <StatBox icon={<TrendingUp size={18}/>} label="Net Profit (THB)" value={formatMB(customer.LATEST_NET_PROFIT_THB)} color="green" />
                    <StatBox icon={<BarChart3 size={18}/>} label="Capital (THB)" value={formatMB(customer.CAPITAL_THB)} color="yellow" />
                  </div>
                  <div className="xl:border-l border-gray-200 xl:pl-6 flex-1 text-[13px] space-y-3 flex flex-col justify-center">
                    <p className="flex"><span className="font-bold text-gray-700 flex items-center gap-2 w-24 shrink-0"><Briefcase size={14} className="text-blue-500"/> Industry:</span> <span className="text-gray-600 truncate">{customer.INDUSTRY_SEGMENT || '-'}</span></p>
                    <p className="flex"><span className="font-bold text-gray-700 flex items-center gap-2 w-24 shrink-0"><Store size={14} className="text-blue-500"/> Brands:</span> <span className="text-gray-600 truncate">{customer.PORTFOLIO_BRANDS || '-'}</span></p>
                    <p className="flex"><span className="font-bold text-gray-700 flex items-center gap-2 w-24 shrink-0"><Target size={14} className="text-blue-500"/> Services:</span> <span className="text-gray-600 line-clamp-2">{customer.SPECIFIC_SERVICES || '-'}</span></p>
                  </div>
                </div>
              </div>

              {/* Row: Priority & Challenges */}
              <div className="grid grid-cols-2 gap-6">
                {/* 2. STRATEGY & PRIORITIES */}
                <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm flex flex-col">
                  <SectionTitle num="2" title="Strategy & Priorities 2026" />
                  <div className="flex-1 flex items-center justify-center text-gray-400 text-sm italic bg-gray-50 rounded-xl border border-dashed border-gray-200 min-h-[100px]">
                    No strategy data recorded
                  </div>
                </div>
                {/* 3. BUSINESS NEEDS & CHALLENGES */}
                <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm flex flex-col">
                  <SectionTitle num="3" title="Business Needs & Challenges" />
                  <div className="flex-1 space-y-3">
                    {customer.KEY_PAIN_POINT ? customer.KEY_PAIN_POINT.split('\n').map((line, i) => (
                      <div key={i} className="flex gap-2 text-[13px] text-gray-700">
                        <AlertTriangle size={16} className="text-red-500 shrink-0 mt-0.5" />
                        <span>{line}</span>
                      </div>
                    )) : (
                      <div className="h-full flex items-center justify-center text-gray-400 text-sm italic bg-gray-50 rounded-xl border border-dashed border-gray-200 min-h-[100px]">
                        No challenges recorded
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 4. CURRENT IT & TECHNOLOGY LANDSCAPE */}
              <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
                <SectionTitle num="4" title="Current IT & Technology Landscape" />
                <div className="grid grid-cols-2 gap-x-12 gap-y-1">
                  <TechRow icon={<Globe size={16}/>} label="Network" value="" />
                  <TechRow icon={<Shield size={16}/>} label="Security" value="" />
                  <TechRow icon={<Wifi size={16}/>} label="SD-WAN" value="" />
                  <TechRow icon={<Users size={16}/>} label="Collaboration" value="" />
                  <TechRow icon={<Cloud size={16}/>} label="Internet" value="" />
                  <TechRow icon={<Headset size={16}/>} label="Call Center" value={customer.CALL_CENTER_TYPE} />
                  <TechRow icon={<Wifi size={16}/>} label="Wi-Fi" value="" />
                  <TechRow icon={<Laptop size={16}/>} label="ERP/POS" value={customer.PRIMARY_ERP_POS} />
                  <TechRow icon={<Cloud size={16}/>} label="Cloud" value={customer.CLOUD_ADOPTION} />
                  <TechRow icon={<Camera size={16}/>} label="CCTV / IoT" value="" />
                </div>
              </div>

              {/* 5. COMPETITORS & IT SPEND OVERVIEW */}
              <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
                <SectionTitle num="5" title="Competitors & IT Spend Overview" />
                <div className="flex flex-col xl:flex-row gap-8">
                  <div className="flex-1">
                    <p className="text-[11px] font-bold text-gray-800 mb-3 uppercase tracking-wider">Key Competitors Used</p>
                    <div className="flex flex-wrap gap-2">
                      {loadingWallets ? <span className="text-gray-400 text-sm">Loading...</span> : 
                        wallets.length > 0 ? [...new Set(wallets.map(w => w.current_vendor))].filter(Boolean).map(v => (
                        <div key={v} className="px-3 py-1.5 border border-gray-200 bg-white rounded-md text-[13px] font-bold text-gray-700 shadow-sm">{v}</div>
                      )) : <span className="text-gray-400 text-sm italic">No competitor data</span>}
                    </div>
                  </div>
                  <div className="flex-1 xl:border-l border-gray-100 xl:pl-8">
                    <p className="text-[11px] font-bold text-gray-800 mb-3 uppercase tracking-wider">IT Spending Trend (THB)</p>
                    <div className="h-16 flex items-center justify-center text-gray-400 text-sm italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      No historical trend data
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 1/3 Column */}
            <div className="col-span-12 lg:col-span-4 space-y-6">
              
              {/* CUSTOMER OWNER */}
              <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
                <h2 className="text-[13px] font-bold text-blue-900 tracking-wider uppercase flex items-center gap-2 mb-4">
                  <Users size={18}/> Customer Owner
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-1"><Users size={16}/></div>
                    <div>
                      <p className="font-bold text-sm text-gray-800">{customer.KEY_DECISION_MAKER || '-'}</p>
                      <p className="text-xs text-gray-500">Key Decision Maker</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-1"><Mail size={16}/></div>
                    <div>
                      <p className="font-bold text-sm text-gray-800 break-all">{customer.DM_CONTACT_INFO || '-'}</p>
                      <p className="text-xs text-gray-500">Contact Info</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 border-t border-gray-100 pt-4">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-1"><Briefcase size={16}/></div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-500 uppercase">AE Name</p>
                      <p className="font-bold text-sm text-gray-800 mb-2">{customer.ACCOUNT_OWNER || '-'}</p>
                      <p className="text-[11px] font-bold text-gray-500 uppercase">Business Unit</p>
                      <p className="font-bold text-sm text-gray-800 uppercase">{customer.CURR_BU || '-'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 6. OPPORTUNITIES */}
              <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
                <SectionTitle num="6" title="Opportunities for True & Partners" />
                <div className="space-y-4">
                  {opps.length > 0 ? opps.map((opp, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                        <CheckCircle2 size={16}/>
                      </div>
                      <div>
                        <p className="font-bold text-[13px] text-gray-800">{opp}</p>
                        <p className="text-[11px] text-gray-500 leading-tight mt-0.5">Identified as a potential opportunity for this account.</p>
                      </div>
                    </div>
                  )) : (
                    <div className="h-24 flex items-center justify-center text-gray-400 text-sm italic bg-gray-50 rounded-xl border border-dashed border-gray-200">
                      No active opportunities
                    </div>
                  )}
                </div>
              </div>

              {/* 7. RECOMMENDED SOLUTIONS */}
              <div className="border border-gray-200 rounded-2xl p-5 bg-white shadow-sm">
                <SectionTitle num="7" title="Recommended Solutions" />
                <div className="flex flex-wrap gap-2">
                  {opps.length > 0 ? opps.map(opp => (
                    <div key={opp} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-[11px] font-bold px-2.5 py-1.5 rounded-md border border-blue-100">
                      <Globe size={12}/> {opp}
                    </div>
                  )) : <div className="w-full h-12 flex items-center justify-center text-gray-400 text-sm italic bg-gray-50 rounded-lg border border-dashed border-gray-200">No data</div>}
                </div>
              </div>

            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-6 px-2 gap-4">
             <div className="text-xl font-black text-red-600 flex items-center tracking-tighter">
                true<span className="text-[#1a2b49] font-medium tracking-normal">business</span>
             </div>
             <div className="flex flex-wrap justify-center gap-6 text-[11px] text-gray-500 font-bold uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><Shield size={14}/> Trusted Technology Partner</span>
                <span className="flex items-center gap-1.5"><Target size={14}/> End-to-End Solutions</span>
                <span className="flex items-center gap-1.5"><TrendingUp size={14}/> Scalable for Growth</span>
             </div>
             <div className="text-[13px] font-bold text-[#1a2b49]">
                <span className="text-red-600">Empower Your Business Transformation</span> with True
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
