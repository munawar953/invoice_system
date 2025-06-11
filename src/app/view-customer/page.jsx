"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from '@/components/ui/Modal';
import useSession from "@/hooks/useSession";

const ViewCustomersPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [customers, setCustomers] = useState([]);
  const [editUser, setEditUser] = useState(null);
  const [editData, setEditData] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push('/dashboard');
    } else {
      fetchCustomers();
    }
  }, [session, status, router]);

  const fetchCustomers = async () => {
    const response = await fetch('/api/customers');
    const data = await response.json();
    setCustomers(data);
  };

  const openEditModal = (user) => {
    setEditUser(user);
    setEditData({ name: user.name, email: user.email, phone: user.phone });
  };

  const closeEditModal = () => {
    setEditUser(null);
    setEditData({ name: '', email: '', phone: '' });
  };

  const handleSave = async () => {
    const response = await fetch('/api/customers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editUser.id, ...editData }),
    });
    if (response.ok) {
      closeEditModal();
      fetchCustomers();
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      const response = await fetch('/api/customers', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId }),
      });
      if (response.ok) {
        fetchCustomers();
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  if (status === "loading") {
    return <p className="text-center text-lg mt-10">Loading...</p>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-gray-800 ">Customer Directory</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((user) => (
          <div key={user.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{user.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{user.email}</p>
              <p className="text-sm text-gray-600">{user.phone}</p>
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <Button variant="default" onClick={() => openEditModal(user)}>Edit</Button>
              <Button variant="destructive" onClick={() => handleDelete(user.id)}>Delete</Button>
            </div>
          </div>
        ))}
      </div>

      {editUser && (
        <Modal isOpen={!!editUser} onClose={closeEditModal}>
          <div className="p-6 w-full max-w-md mx-auto bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Edit Customer</h2>
            <div className="space-y-4">
              <Input
                type="text"
                name="name"
                placeholder="Name"
                value={editData.name}
                onChange={handleChange}
              />
              <Input
                type="email"
                name="email"
                placeholder="Email"
                value={editData.email}
                onChange={handleChange}
              />
              <Input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={editData.phone}
                onChange={handleChange}
              />
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="default" onClick={handleSave}>Save</Button>
                <Button variant="secondary" onClick={closeEditModal}>Cancel</Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ViewCustomersPage;
