'use client';

import { useEffect, useState } from 'react';

import { TrashIcon, KeyIcon } from '@heroicons/react/24/outline';

export default function UsersTable() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    const token = localStorage.getItem('token');
    try {
      await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(users.filter(u => u._id !== id));
    } catch (error) {
      alert('Error deleting user');
    }
  };

  const handleResetPassword = async (id: string) => {
    const newPass = prompt('Enter new password for this user:');
    if (!newPass) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ password: newPass })
      });
      if (res.ok) alert('Password updated');
      else alert('Failed to update password');
    } catch (error) {
      alert('Error resetting password');
    }
  };

  if (loading) return <div className="p-4 text-center text-gray-500">Loading users...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-medium text-white">Name</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-white">Email</th>
            <th className="px-4 py-2 text-left text-sm font-medium text-white">Role</th>
            <th className="px-4 py-2 text-right text-sm font-medium text-white">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-[#1a1a1a] divide-y divide-gray-700">
          {users.map((u) => (
            <tr key={u._id}>
              <td className="px-4 py-2 text-sm text-white">{u.name}</td>
              <td className="px-4 py-2 text-sm text-white">{u.email}</td>
              <td className="px-4 py-2 text-sm">
                <span className={`px-2 py-0.5 rounded-full text-xs ${u.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-gray-700 text-white'}`}>
                  {u.role}
                </span>
              </td>
              <td className="px-4 py-2 text-right flex justify-end gap-2">
                <button
                  onClick={() => handleResetPassword(u._id)}
                  className="p-1 text-gray-500 hover:text-[var(--color-primary)] transition-colors"
                  title="Reset Password"
                >
                  <KeyIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(u._id)}
                  className="p-1 text-red-400 hover:text-red-700 transition-colors"
                  title="Delete User"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}