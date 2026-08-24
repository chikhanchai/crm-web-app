import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function WalletTab({ customerId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    product_category: 'Mobile Postpaid',
    current_vendor: '',
    quantity: '',
    current_price_thb: '',
    contract_expiry_date: '',
    notes: ''
  });

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/wallet/customer/${customerId}`, {
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
        current_price_thb: parseFloat(form.current_price_thb) || 0
      };
      if (!payload.contract_expiry_date) delete payload.contract_expiry_date;
      
      await axios.post(`${API_BASE_URL}/api/wallet/`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setForm({
        product_category: 'Mobile Postpaid',
        current_vendor: '',
        quantity: '',
        current_price_thb: '',
        contract_expiry_date: '',
        notes: ''
      });
      fetchItems();
    } catch (err) {
      alert('Error saving data');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/wallet/${id}`, {
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
        <h4 className="font-bold mb-4">Add IT Spending (Share of Wallet)</h4>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select className="w-full p-2 border rounded" value={form.product_category} onChange={e => setForm({...form, product_category: e.target.value})}>
              <option>Mobile Postpaid</option>
              <option>Fixed Broadband</option>
              <option>SD-WAN / Network</option>
              <option>Cloud Computing</option>
              <option>Cybersecurity</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Current Vendor</label>
            <input type="text" required className="w-full p-2 border rounded" value={form.current_vendor} onChange={e => setForm({...form, current_vendor: e.target.value})} placeholder="e.g. AIS, AWS, UIH" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quantity / Size</label>
            <input type="text" className="w-full p-2 border rounded" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} placeholder="e.g. 500 SIMs, 1 Gbps" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Current Price (THB)</label>
            <input type="number" className="w-full p-2 border rounded" value={form.current_price_thb} onChange={e => setForm({...form, current_price_thb: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Contract Expiry</label>
            <input type="date" className="w-full p-2 border rounded" value={form.contract_expiry_date} onChange={e => setForm({...form, contract_expiry_date: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Notes</label>
            <input type="text" className="w-full p-2 border rounded" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
          </div>
          <div className="md:col-span-3">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Record</button>
          </div>
        </form>
      </div>

      <div>
        <h4 className="font-bold mb-4">Current IT Spending</h4>
        {loading ? <p>Loading...</p> : items.length === 0 ? <p className="text-gray-500">No records found.</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse bg-white shadow-sm rounded">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-3 text-sm font-bold">Category</th>
                  <th className="p-3 text-sm font-bold">Vendor</th>
                  <th className="p-3 text-sm font-bold">Quantity</th>
                  <th className="p-3 text-sm font-bold">Price (THB)</th>
                  <th className="p-3 text-sm font-bold">Expiry Date</th>
                  <th className="p-3 text-sm font-bold">Notes</th>
                  <th className="p-3 text-sm font-bold"></th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{item.product_category}</td>
                    <td className="p-3 text-sm">{item.current_vendor}</td>
                    <td className="p-3 text-sm">{item.quantity}</td>
                    <td className="p-3 text-sm">{(item.current_price_thb || 0).toLocaleString()}</td>
                    <td className="p-3 text-sm text-red-600 font-semibold">{item.contract_expiry_date || '-'}</td>
                    <td className="p-3 text-sm">{item.notes}</td>
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
