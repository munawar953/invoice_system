// src/components/EditUserForm.js
"use client";
import React, { useState } from 'react';

const EditUserForm = ({ user, onSave }) => {
  const [role, setRole] = useState(user.role);
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/users/${user.id}/changePassword`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, password })
    });
    if (res.ok) {
      onSave();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <p>{user.email} (email cannot be changed)</p>
      <label>Role:</label>
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="ADMIN">Admin</option>
        <option value="USER">User</option>
      </select>
      <label>Password:</label>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Change Password" />
      <button type="submit">Save Changes</button>
      <button type="button" onClick={onSave}>Cancel</button>
    </form>
  );
};

export default EditUserForm;
