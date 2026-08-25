import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { X, Building2, AlertTriangle, Wallet, Loader2, Briefcase, Users, Phone, Target, Laptop, Lightbulb, MapPin, Tag, TrendingUp, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

const formatNumber = (val) => {
  if (val === null || val === undefined || val === '') return '-';
  const num = Number(val);
  return isNaN(num) ? val : num.toLocaleString('en-US');
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

  // Extract Ecosystem
  const ecosystem = [];
  if (customer.TRUE_EGG_SYNERGY_PROPOSAL && customer.TRUE_EGG_SYNERGY_PROPOSAL !== '-') ecosystem.push({ name: "Egg Digital", color: "bg-orange-100 text-orange-800 border-orange-300" });
  if (customer.EST_TRUE_IDC_ANNUAL_REV_THB) ecosystem.push({ name: "True IDC", color: "bg-blue-100 text-blue-800 border-blue-300" });
  if (customer.EST_TDG_ANNUAL_REV_THB) ecosystem.push({ name: "TDG", color: "bg-red-100 text-red-800 border-red-300" });
  if (customer.EST_GREENMOONS_ANNUAL_REV_THB) ecosystem.push({ name: "Greenmoons", color: "bg-green-100 text-green-800 border-green-300" });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl my-8 relative border-t-8 border-blue-600 flex flex-col max-h-[90vh]">
        
        {/* Header (Sticky) */}
        <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-white rounded-t-2xl sticky top-0 z-10 shrink-0">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-black text-gray-900">{customer.CUSTOMER_NAME}</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-bold border ${getTierBadgeClass(customer.FOCUS_TIER)}`}>
                {customer.FOCUS_TIER || 'No Tier'}
              </span>
            </div>
            <p className="text-gray-500 font-medium flex items-center gap-2">
              <Building2 size={16} /> Tax ID: {customer.M_BUSINESS_ID || '-'} | {customer.CURR_VERTICAL || '-'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto bg-gray-50 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Section 1: Financials */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <TrendingUp className="text-blue-600" /> Company Snapshot
                </h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-sm font-medium text-blue-600 mb-1">Capital (THB)</p>
                    <p className="text-xl font-bold text-gray-900">{formatNumber(customer.CAPITAL_THB)}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="text-sm font-medium text-green-600 mb-1">Revenue (THB)</p>
                    <p className="text-xl font-bold text-gray-900">{formatNumber(customer.LATEST_REVENUE_THB)}</p>
                  </div>
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                    <p className="text-sm font-medium text-yellow-600 mb-1">Net Profit (THB)</p>
                    <p className="text-xl font-bold text-gray-900">{formatNumber(customer.LATEST_NET_PROFIT_THB)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p><span className="font-medium text-gray-600">Industry:</span> {customer.INDUSTRY_SEGMENT || '-'}</p>
                  <p><span className="font-medium text-gray-600">Branches:</span> {customer.EST_NUM_BRANCHES ? formatNumber(customer.EST_NUM_BRANCHES) : '-'}</p>
                  <p className="col-span-2"><span className="font-medium text-gray-600">Brands:</span> {customer.PORTFOLIO_BRANDS || '-'}</p>
                  <p className="col-span-2"><span className="font-medium text-gray-600">Services:</span> {customer.SPECIFIC_SERVICES || '-'}</p>
                </div>
              </div>

              {/* Section 3: Tech Stack */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <Cpu className="text-blue-600" /> Digital & Tech Stack
                </h3>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm">
                    <span className="font-bold text-gray-700">ERP/POS:</span> 
                    <span className="text-blue-600 font-medium">{customer.PRIMARY_ERP_POS || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm">
                    <span className="font-bold text-gray-700">Cloud:</span> 
                    <span className="text-blue-600 font-medium">{customer.CLOUD_ADOPTION || '-'}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm">
                    <span className="font-bold text-gray-700">Call Center:</span> 
                    <span className="text-blue-600 font-medium">{customer.CALL_CENTER_TYPE || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Section 5: Business Needs & Challenges */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <AlertTriangle className="text-orange-500" /> Business Needs & Challenges
                </h3>
                <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                  {customer.KEY_PAIN_POINT || 'No business challenges recorded.'}
                </p>
              </div>

              {/* Section 6: Share of Wallet (Competitor Info) */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <Wallet className="text-purple-600" /> Share of Wallet (Competitors & IT Spending)
                </h3>
                {loadingWallets ? (
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    <Loader2 className="animate-spin text-purple-600" size={16} /> Loading data...
                  </p>
                ) : wallets.length > 0 ? (
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Vendor</th>
                          <th className="px-4 py-3 text-right">Price/Mo (THB)</th>
                          <th className="px-4 py-3">Contract Exp.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {wallets.map(w => (
                          <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-800">{w.product_category}</td>
                            <td className="px-4 py-3 text-gray-600">{w.current_vendor}</td>
                            <td className="px-4 py-3 text-right font-medium text-gray-700">
                              {w.current_price_thb ? formatNumber(w.current_price_thb) : '-'}
                            </td>
                            <td className="px-4 py-3 text-gray-500">{w.contract_expiry_date || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic bg-gray-50 p-4 rounded-lg text-center border border-dashed border-gray-200">
                    No competitor or wallet data recorded for this customer yet.
                  </p>
                )}
              </div>

            </div>

            {/* Right Column */}
            <div className="space-y-6">
              
              {/* Section 2: Contact */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <Users className="text-blue-600" /> Sales & Contact
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <p className="text-xs text-gray-500 font-medium mb-1">Key Decision Maker</p>
                    <p className="font-bold text-gray-900">{customer.KEY_DECISION_MAKER || '-'}</p>
                    <p className="text-gray-600 mt-1 flex items-center gap-2"><Phone size={14}/> {customer.DM_CONTACT_INFO || 'No contact info'}</p>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-500">AE Name</span>
                    <span className="font-bold text-gray-900">{customer.ACCOUNT_OWNER || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500">Business Unit</span>
                    <span className="font-bold text-gray-900">{customer.CURR_BU || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Section 5: Business Needs & Challenges */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <AlertTriangle className="text-orange-500" /> Business Needs & Challenges
                </h3>
                <p className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">
                  {customer.KEY_PAIN_POINT || 'No business challenges recorded.'}
                </p>
              </div>

              {/* Section 6: Share of Wallet (Competitor Info) */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                  <Wallet className="text-purple-600" /> Share of Wallet (Competitors & IT Spending)
                </h3>
                {loadingWallets ? (
                  <p className="text-gray-500 text-sm flex items-center gap-2">
                    <Loader2 className="animate-spin text-purple-600" size={16} /> Loading data...
                  </p>
                ) : wallets.length > 0 ? (
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-gray-50 text-gray-600 font-bold border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Vendor</th>
                          <th className="px-4 py-3 text-right">Price/Mo (THB)</th>
                          <th className="px-4 py-3">Contract Exp.</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {wallets.map(w => (
                          <tr key={w.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-4 py-3 font-medium text-gray-800">{w.product_category}</td>
                            <td className="px-4 py-3 text-gray-600">{w.current_vendor}</td>
                            <td className="px-4 py-3 text-right font-medium text-gray-700">
                              {w.current_price_thb ? formatNumber(w.current_price_thb) : '-'}
                            </td>
                            <td className="px-4 py-3 text-gray-500">{w.contract_expiry_date || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic bg-gray-50 p-4 rounded-lg text-center border border-dashed border-gray-200">
                    No competitor or wallet data recorded for this customer yet.
                  </p>
                )}
              </div>

              {/* Section 4: Opportunities */}
              <div className="bg-gradient-to-br from-blue-900 to-blue-700 p-5 rounded-xl shadow-sm text-white">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 border-b border-blue-500 pb-2">
                  <Lightbulb className="text-yellow-300" /> Opportunities
                </h3>
                <div className="mb-4">
                  <p className="text-blue-200 text-xs font-medium uppercase mb-1">Recommended Products</p>
                  {opps.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {opps.map(opp => (
                        <span key={opp} className="bg-white/20 px-2 py-1 rounded text-xs font-bold border border-white/30 backdrop-blur-sm">
                          {opp}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-blue-100">No specific products identified yet.</p>
                  )}
                </div>
                <div>
                  <p className="text-blue-200 text-xs font-medium uppercase mb-1">Ecosystem Synergy</p>
                  {ecosystem.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {ecosystem.map(eco => (
                        <span key={eco.name} className={`px-2 py-1 rounded text-xs font-bold border ${eco.color}`}>
                          {eco.name}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-blue-100">None</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer (Sticky) */}
        <div className="p-4 bg-white border-t border-gray-100 rounded-b-2xl flex justify-end sticky bottom-0 shrink-0">
          <Link 
            to={`/customers/${customer.id}`} 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-sm transition flex items-center gap-2"
          >
            Go to Full Profile & Edit
          </Link>
        </div>

      </div>
    </div>
  );
}