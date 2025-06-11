"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // Correct import for useRouter
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import Loader from "@/components/Loader/Loader";

export default function CreateInvoice() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    customerId: "",
    customerName: "",
    email: "",
    phone: "",
    amount: "",
    dueDate: "",
    description: "",
    status: "pending",
  });
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    } else if (session.user.role !== "ADMIN") {
      router.push("/dashboard");
    } else {
      fetchCustomers();
    }
  }, [session, status, router]);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers");
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };
  // When customer is selected from the dropdown, pre-fill the form fields
  const handleCustomerChange = async (e) => {
    const selectedCustomerId = e.target.value;
    setFormData({ ...formData, customerId: selectedCustomerId });

    if (selectedCustomerId) {
      try {
        const selectedCustomer = customers.find((customer) => customer.id === parseInt(selectedCustomerId));
        setFormData({
          ...formData,
          customerName: selectedCustomer.name,
          email: selectedCustomer.email,
        });
      } catch (error) {
        console.error("Error finding customer:", error);
      }
    } else {
      setFormData({
        ...formData,
        customerName: "",
        email: "",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    const newCustomer = {
      name: formData.customerName,
      email: formData.email,
      phone: formData.phone
    };
    const response = await fetch("/api/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCustomer),
    });

    if (response.ok) {
      const customer = await response.json();
      setCustomers([...customers, customer]);
      setFormData({ ...formData, customerId: customer.id });
      setIsCreatingCustomer(false);
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const invoiceData = {
      ...formData,
      customerId: formData.customerId
    };
    const response = await fetch("/api/invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoiceData),
    });

    if (response.ok) {
      router.push("/dashboard");
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Create Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Customer:</Label>
              <select
                name="customerId"
                value={formData.customerId}
                onChange={handleCustomerChange}
                
              >
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name} - {customer.email}
                  </option>
                ))}
              </select>
              <Button type="button" onClick={() => setIsCreatingCustomer(true)} className="ml-2">Add New Customer</Button>
              {isCreatingCustomer && (
                <>
                  <div className="mt-4">
                    <Label>Customer Name:</Label>
                    <Input
                      type="text"
                      name="customerName"
                      value={formData.customerName}
                      onChange={handleChange}
                      placeholder="Customer Name"
                      required
                    />
                  </div>
                  <div>
                    <Label>Email:</Label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Customer Email"
                      required
                    />
                  </div>
                  <div>
                    <Label>Phone:</Label>
                    <Input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Customer Phone"
                      required
                    />
                  </div>
                  <Button type="button" onClick={handleCreateCustomer} className="mt-2">Confirm Add</Button>
                  <Button type="button" onClick={() => setIsCreatingCustomer(false)} className="mt-2 ml-2">Cancel</Button>
                </>
              )}
            </div>
            <div>
            <Label>Customer Name</Label>
              <Input
                type="text"
                name="customerName"
                value={formData.customerName}
                disabled
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                disabled
              />
            </div>

            <div>
              <Label>Amount:</Label>
              <Input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Amount"
                required
              />
            </div>

            <div>
              <Label>Due Date:</Label>
              <Input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Description:</Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Invoice description"
                required
              />
            </div>

            <Button type="submit" className="w-full">{loading ? <Loader /> : "Create Invoice"}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
