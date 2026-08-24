import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function OpportunitiesTab({ customerId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    deal_name: '',
    product_category: 'Cloud / DRaaS',
    est_deal_value_thb: '',
    stage: 'Prospecting',
    confidence_percent: '50',
    expected_close_date: ''
  });

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/opportunities/customer/${customerId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setItems(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [customerId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        ...form, 
        customer_id: customerId,
        est_deal_value_thb: parseFloat(form.est_deal_value_thb) || 0,
        confidence_percent: parseInt(form.confidence_percent) || 0
      };
      if (!payload.expected_close_date) delete payload.expected_close_date;
      
      await axios.post(`${API_BASE_URL}/api/opportunities/`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setForm({
        deal_name: '',
        product_category: 'Cloud / DRaaS',
        est_deal_value_thb: '',
        stage: 'Prospecting',
        confidence_percent: '50',
        expected_close_date: ''
      });
      fetchItems();
    } catch (err) {
      alert('Error saving data');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this deal?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/opportunities/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchItems();
    } catch (err) {
      alert('Error deleting data');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded border">
        <h4 className="font-bold mb-4">Add New Opportunity</h4>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Deal Name</label>
            <input type="text" required className="w-full p-2 border rounded" value={form.deal_name} onChange={e => setForm({...form, deal_name: e.target.value})} placeholder="e.g. Q3 Network Upgrade" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Product Category</label>
            <select className="w-full p-2 border rounded" value={form.product_category} onChange={e => setForm({...form, product_category: e.target.value})}>
              <option>SD-WAN / Network</option>
              <option>Cloud / DRaaS</option>
              <option>Cybersecurity</option>
              <option>Smart Retail / IoT</option>
              <option>Data Analytics</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Est. Value (THB)</label>
            <input type="number" className="w-full p-2 border rounded" value={form.est_deal_value_thb} onChange={e => setForm({...form, est_deal_value_thb: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stage</label>
            <select className="w-full p-2 border rounded" value={form.stage} onChange={e => setForm({...form, stage: e.target.value})}>
              <option>Prospecting</option>
              <option>Qualification</option>
              <option>Proposal</option>
              <option>Negotiation</option>
              <option>Closed Won</option>
              <option>Closed Lost</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expected Close Date</label>
            <input type="date" className="w-full p-2 border rounded" value={form.expected_close_date} onChange={e => setForm({...form, expected_close_date: e.target.value})} />
          </div>
          <div className="md:col-span-3">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Deal</button>
          </div>
        </form>
      </div>

      <div>
        <h4 className="font-bold mb-4">Pipeline</h4>
        {loading ? <p>Loading...</p> : items.length === 0 ? <p className="text-gray-500">No deals found.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse bg-white shadow-sm rounded">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3 text-sm font-bold">Deal Name</th>
                  <th className="p-3 text-sm font-bold">Category</th>
                  <th className="p-3 text-sm font-bold">Value (THB)</th>
                  <th className="p-3 text-sm font-bold">Stage</th>
                  <th className="p-3 text-sm font-bold">Close Date</th>
                  <th className="p-3 text-sm font-bold">Owner</th>
                  <th className="p-3 text-sm font-bold"></th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.deal_name}</td>
                    <td className="p-3 text-sm">{item.product_category}</td>
                    <td className="p-3 text-sm">{(item.est_deal_value_thb || 0).toLocaleString()}</td>
                    <td className="p-3 text-sm">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">{item.stage}</span>
                    </td>
                    <td className="p-3 text-sm">{item.expected_close_date || '-'}</td>
                    <td className="p-3 text-sm">{item.user_name}</td>
                    <td className="p-3 text-sm text-right">
                      <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:underline">Del</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
