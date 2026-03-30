import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Trash2, AlertTriangle, RefreshCw } from 'lucide-react';

// ─── Reusable Modal Shell ───────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-y-auto">
      <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl">
        <h2 className="text-xl font-bold tracking-tight text-gray-900">{title}</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors p-1 rounded-full hover:bg-gray-100">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>
      </div>
      <div className="px-8 py-6">{children}</div>
    </div>
  </div>
);

const ConfirmDelete = ({ label, onConfirm, onClose, loading }) => (
  <Modal title="Confirm Delete" onClose={onClose}>
    <div className="space-y-6">
      <p className="text-gray-600">Are you sure you want to delete user <span className="font-semibold text-gray-900">"{label}"</span>? This will permanently remove their account and cannot be undone.</p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
        <button onClick={onConfirm} disabled={loading} className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-colors disabled:bg-red-300">
          {loading ? 'Deleting...' : 'Yes, Delete'}
        </button>
      </div>
    </div>
  </Modal>
);

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteErr, setDeleteErr] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      // Trying common endpoints for fetching users in Spring Boot
      const res = await api.get('/users').catch(() => api.get('/admin/users'));
      const data = Array.isArray(res.data) ? res.data : res.data.content ?? [];
      setUsers(data);
    } catch (err) {
      console.error('Fetch users error:', err.response || err);
      setError(
        !err.response
          ? `Network error: ${err.message}`
          : `Error ${err.response.status}: ${err.response.data?.message || 'Could not load users.'}`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const confirmDelete = (user) => {
    setDeleteErr(null);
    setDeleteTarget(user);
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteErr(null);
    try {
      await api.delete(`/users/${deleteTarget.id}`).catch(() => api.delete(`/admin/users/${deleteTarget.id}`));
      setDeleteTarget(null);
      fetchUsers();
    } catch (err) {
      console.error('Delete user error:', err.response || err);
      setDeleteErr(
        !err.response
          ? `Network error: ${err.message}`
          : `Error ${err.response.status}: ${err.response.data?.message || 'Could not delete user.'}`
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Users</h2>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 bg-[#f4f4f4] text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Errors */}
      {error && (
        <div className="flex items-start gap-2 mb-6 bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100">
          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {deleteErr && (
        <div className="flex items-start gap-2 mb-6 bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100">
          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
          <span>{deleteErr}</span>
        </div>
      )}

      {/* Loading */}
      {loading && !users.length ? (
        <div className="py-20 text-center text-gray-400">Loading users...</div>
      ) : (
        <div className="bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f9f9f9] border-b border-gray-100">
                  {['ID', 'Name', 'Email', 'Role', 'Actions'].map(h => (
                    <th key={h} className={`px-6 py-4 text-xs font-semibold text-gray-400 uppercase tracking-widest whitespace-nowrap ${h === 'Actions' ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-gray-400">
                      No users found.
                    </td>
                  </tr>
                )}
                {users.map(u => {
                  const role = u.role || 'USER';
                  const name = u.firstName ? `${u.firstName} ${u.lastName}` : (u.username || '—');
                  return (
                    <tr key={u.id} className="hover:bg-[#fafafa] transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-400 font-medium whitespace-nowrap">#{u.id}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 truncate">{u.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                          {role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {role !== 'ADMIN' ? (
                          <button
                            onClick={() => confirmDelete(u)}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium px-3">Protected</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <ConfirmDelete
          label={deleteTarget.email}
          loading={deleting}
          onConfirm={handleDelete}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
};

export default AdminUsers;
