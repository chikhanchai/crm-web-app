import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function InteractionsTab({ customerId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    interaction_date: new Date().toISOString().slice(0, 16),
    interaction_type: 'Meeting',
    notes: '',
    next_action: '',
    next_action_date: ''
  });

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/interactions/customer/${customerId}`, {
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
      const payload = { ...form, customer_id: customerId };
      if (!payload.next_action_date) delete payload.next_action_date;
      
      await axios.post(`${API_BASE_URL}/api/interactions/`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setForm({
        interaction_date: new Date().toISOString().slice(0, 16),
        interaction_type: 'Meeting',
        notes: '',
        next_action: '',
        next_action_date: ''
      });
      fetchItems();
    } catch (err) {
      alert('Error saving data');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/interactions/${id}`, {
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
        <h4 className="font-bold mb-4">Add New Activity</h4>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date & Time</label>
            <input type="datetime-local" required className="w-full p-2 border rounded" value={form.interaction_date} onChange={e => setForm({...form, interaction_date: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select className="w-full p-2 border rounded" value={form.interaction_type} onChange={e => setForm({...form, interaction_type: e.target.value})}>
              <option>Meeting</option>
              <option>Phone Call</option>
              <option>Email</option>
              <option>LINE / Chat</option>
              <option>Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Notes / Minutes</label>
            <textarea className="w-full p-2 border rounded" rows="3" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})}></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Next Action</label>
            <input type="text" className="w-full p-2 border rounded" value={form.next_action} onChange={e => setForm({...form, next_action: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Next Action Date</label>
            <input type="date" className="w-full p-2 border rounded" value={form.next_action_date} onChange={e => setForm({...form, next_action_date: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Activity</button>
          </div>
        </form>
      </div>

      <div>
        <h4 className="font-bold mb-4">Activity History</h4>
        {loading ? <p>Loading...</p> : items.length === 0 ? <p className="text-gray-500">No history found.</p> : (
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="border p-4 rounded shadow-sm bg-white relative">
                <button onClick={() => handleDelete(item.id)} className="absolute top-4 right-4 text-red-500 text-sm">Delete</button>
                <div className="flex gap-4 items-center mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded font-bold">{item.interaction_type}</span>
                  <span className="text-gray-500 text-sm">{new Date(item.interaction_date).toLocaleString()}</span>
                  <span className="text-gray-500 text-sm border-l pl-4">By: {item.user_name}</span>
                </div>
                <p className="text-gray-800 whitespace-pre-wrap mb-3">{item.notes}</p>
                {item.next_action && (
                  <div className="bg-orange-50 p-2 rounded text-sm text-orange-800">
                    <strong>Next Step:</strong> {item.next_action} {item.next_action_date && `(Due: ${item.next_action_date})`}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
