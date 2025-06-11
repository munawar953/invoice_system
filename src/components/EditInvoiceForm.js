// components/EditInvoiceForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const EditInvoiceForm = ({ invoice, onClose }) => {
    const [formData, setFormData] = useState(invoice);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting form with data:", formData);
        try {
            const response = await fetch(`/api/invoice`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, id: invoice.id }),
            });
            if (response.ok) {
                console.log("Update successful");
                onClose(true); // Refresh or close modal
            } else {
                const errorData = await response.json();
                console.error('Failed to update invoice:', errorData);
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error updating invoice:', error);
            alert(error.message);
        }
    };
        const handleClose = () => {
        onClose(false); // Pass false if no refresh is needed
        //router.push('/dashboard'); // or hide the form
      };
    
    return (
        <div className="edit-invoice-form container mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">Edit Invoice</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="customerName" className="block font-medium">Customer Name:</label>
                    <Input type="text" id="customerName" name="customerName" value={formData.customerName} onChange={handleChange} className="mt-1 block w-full" />
                </div>
                <div>
                    <label htmlFor="email" className="block font-medium">Email:</label>
                    <Input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full" />
                </div>
                <div>
                    <label htmlFor="amount" className="block font-medium">Amount:</label>
                    <Input type="number" id="amount" name="amount" value={formData.amount} onChange={handleChange} className="mt-1 block w-full" />
                </div>
                <div>
                    <label htmlFor="dueDate" className="block font-medium">Due Date:</label>
                    <Input type="date" id="dueDate" name="dueDate" value={formData.dueDate} onChange={handleChange} className="mt-1 block w-full" />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="description" className="block font-medium">Description:</label>
                    <Input type="text" id="description" name="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full" />
                </div>
                <div>
                    <label htmlFor="status" className="block font-medium">Status:</label>
                    <select id="status" name="status" value={formData.status} onChange={handleChange} className="mt-1 px-2 py-1 block w-full border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md">
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="overdue">Overdue</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <Button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Update Invoice</Button>
                    <Button onClick={handleClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-4">Close</Button>
                </div>
                </form>
        </div>
    );
};

export default EditInvoiceForm;
