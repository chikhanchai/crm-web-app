import { API_BASE_URL } from '../config';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserCircle, LogOut, ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react';

export default function UserManagement() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '', password: '', full_name: '', role: 'AE', bu_name: ''
  });

  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/users/`, getAuthHeaders());
      setUsers(res.data);
    } catch (err) {
      if(err.response?.status === 403) {
        alert("Not authorized");
        navigate('/');
      } else if(err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'Admin') {
      navigate('/');
      return;
    }
    setUser(parsedUser);
    fetchUsers();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const openAddModal = () => {
    setEditUser(null);
    setFormData({ username: '', password: '', full_name: '', role: 'AE', bu_name: '' });
    setShowModal(true);
  };

  const openEditModal = (u) => {
    setEditUser(u);
    setFormData({
      username: u.username,
      password: '', // blank unless changing
      full_name: u.full_name,
      role: u.role,
      bu_name: u.bu_name || ''
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData };
      if (editUser) {
        if (!payload.password) delete payload.password; // Don't update if empty
        await axios.put(`${API_BASE_URL}/api/users/${editUser.id}`, payload, getAuthHeaders());
      } else {
        if (!payload.password) return alert("Password is required for new users");
        await axios.post(`${API_BASE_URL}/api/users/`, payload, getAuthHeaders());
      }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.detail || "An error occurred");
    }
  };

  const handleDelete = async (id, username) => {
    if (username === user.username) return alert("Cannot delete your own account");
    if (window.confirm(`Are you sure you want to delete user ${username}?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/api/users/${id}`, getAuthHeaders());
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.detail || "An error occurred");
      }
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center z-20">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-gray-500 hover:text-blue-600 transition">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">User Management</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-600">
            <UserCircle size={20} />
            <span className="font-medium">{user.full_name} <span className="text-gray-400">({user.role})</span></span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      <div className="p-6 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">System Users</h2>
          <button 
            onClick={openAddModal}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            <Plus size={18} /> Add User
          </button>
        </div>

        <div className="bg-white rounded shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">BU / Sector</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{u.username}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{u.full_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'Admin' ? 'bg-purple-100 text-purple-800' : u.role === 'BU' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{u.bu_name || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => openEditModal(u)} className="text-blue-600 hover:text-blue-900 mr-4">
                      <Edit size={18} />
                    </button>
                    {u.username !== user.username && (
                      <button onClick={() => handleDelete(u.id, u.username)} className="text-red-600 hover:text-red-900">
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{editUser ? 'Edit User' : 'Add New User'}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input 
                  type="text" required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input 
                  type="text" required
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password {editUser && <span className="text-gray-400 font-normal">(Leave blank to keep current)</span>}</label>
                <input 
                  type="password" required={!editUser}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500 bg-white"
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="Admin">Admin</option>
                  <option value="BU">BU (Business Unit)</option>
                  <option value="AE">AE (Sales)</option>
                </select>
              </div>

              {formData.role !== 'Admin' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">BU / Sector Name</label>
                  <input 
                    type="text" required
                    className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. SERVICE SECTOR"
                    value={formData.bu_name}
                    onChange={(e) => setFormData({...formData, bu_name: e.target.value})}
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
