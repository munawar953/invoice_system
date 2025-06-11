"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Modal from '@/components/ui/Modal';
import useSession from "@/hooks/useSession";

const ViewUsersPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [editUser, setEditUser] = useState(null);
    const [editData, setEditData] = useState({ name: '', password: '' });

    useEffect(() => {
        if (status !== "loading" && (!session)) {
            router.push("/unauthorized");
        } else if (session) {
            fetchUsers();
        }
    }, [session, status, router]);

    const fetchUsers = async () => {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
    };

    const openEditModal = (user) => {
        setEditUser(user);
        setEditData({ name: user.name, password: '' });
    };

    const closeEditModal = () => {
        setEditUser(null);
        setEditData({ name: '', password: '' });
    };

    const handleSave = async () => {
        const payload = { id: editUser.id, name: editData.name };
        if (editData.password) {
            payload.password = editData.password;
        }

        const response = await fetch('/api/users', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            closeEditModal();
            fetchUsers();
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    };

    const handleDelete = async (userId) => {
        if (confirm("Are you sure you want to delete this user?")) {
            const response = await fetch('/api/users', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: userId })
            });
            if (response.ok) {
                fetchUsers();
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    if (!session) {
        return <p className="text-center text-gray-500 mt-10">Loading or unauthorized...</p>;
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center">User Management</h1>
            <div className="space-y-4">
                {users.map((user) => (
                    <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border rounded-lg shadow-sm bg-white"
                    >
                        <div className="text-gray-800">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button onClick={() => openEditModal(user)} className="text-sm">Edit</Button>
                            <Button onClick={() => handleDelete(user.id)} variant="destructive" className="text-sm">Delete</Button>
                        </div>
                    </div>
                ))}
            </div>

            {editUser && (
                <Modal isOpen={!!editUser} onClose={closeEditModal}>
                    <div className="p-4 space-y-4">
                        <h2 className="text-xl font-semibold">Edit User</h2>
                        <Input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={editData.name}
                            onChange={handleChange}
                        />
                        <Input
                            type="password"
                            name="password"
                            placeholder="New Password"
                            value={editData.password}
                            onChange={handleChange}
                        />
                        <div className="flex justify-end gap-2">
                            <Button onClick={handleSave}>Save</Button>
                            <Button variant="outline" onClick={closeEditModal}>Cancel</Button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ViewUsersPage;