"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Modal from '@/components/ui/Modal.js';
import EditInvoiceForm from "@/components/EditInvoiceForm";
import useSession from "@/hooks/useSession";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [paymentLink, setPaymentLink] = useState("");
  const [showLinkModal, setShowLinkModal] = useState(false);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login");
  }, [session, status]);

  useEffect(() => {
    if (session) fetchInvoices();
  }, [session]);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get("/api/invoice");
      setInvoices(res.data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    }
  };

  const handleEdit = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const closeAndRefresh = () => {
    setIsModalOpen(false);
    fetchInvoices();
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      try {
        await fetch(`/api/invoice`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
        setInvoices(prev => prev.filter(i => i.id !== id));
      } catch {
        alert("Failed to delete the invoice.");
      }
    }
  };

  const handleGenerateLink = async (invoiceId) => {
    try {
      const res = await fetch(`/api/invoice/generate-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: invoiceId }),
      });
      if (res.ok) {
        const data = await res.json();
        setPaymentLink(data.paymentLink);
        setShowLinkModal(true);
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate payment link.");
    }
  };

  const navLinks = [
    { label: "Add Customer", onClick: () => router.push("/create-customer") },
    { label: "View Customers", onClick: () => router.push("/view-customer") },
    { label: "Create Invoice", onClick: () => router.push("/create-invoice") },
    { label: "Add User", onClick: () => router.push("/create-user") },
    { label: "View Users", onClick: () => router.push("/view-user") },
  ];

  const logoutClick = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  };

  if (status === "loading") return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <aside
        className={`fixed bg-gradient-to-b from-indigo-900 to-indigo-700 text-white h-screen transition-all duration-300 shadow-lg z-40 ${
          isSidebarOpen ? "w-64" : "w-0 overflow-hidden"
        }`}
      >
        <div className="h-full p-6">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="text-xl font-semibold">✕</button>
          </div>
          <nav className="space-y-4">
            {navLinks.map((link, i) => (
              <Button
                key={i}
                onClick={link.onClick}
                className="w-full justify-start bg-indigo-600 hover:bg-indigo-500 shadow-md"
              >
                {link.label}
              </Button>
            ))}
            <Button onClick={logoutClick} className="w-full justify-start bg-red-500 hover:bg-red-400 shadow-md mt-10">
              Logout
            </Button>
          </nav>
        </div>
      </aside>

      {/* Main */}
      <main
        className={`transition-all duration-300 flex-1 p-6 overflow-y-auto ${
          isSidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        <header className="sticky top-0 bg-white border-b py-4 px-6 shadow-md z-30 flex items-center">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="bg-indigo-600 text-white px-3 py-2 rounded-full shadow hover:bg-indigo-500"
            >
              ☰
            </button>
          )}
          <h1 className="text-2xl font-bold ml-4 ">Welcome  {session?.user?.name}</h1>
        </header>

        <Card className="mt-6 shadow-md">
          <CardHeader>
            <CardTitle className="text-xl -ml-2 font-bold">Invoices</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto mx-3">
            <Table className="min-w-full">
              <TableHeader className="bg-indigo-100">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className=' h-18'>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-gray-100  h-10 py-2">
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell>{invoice.email}</TableCell>
                    <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 text-sm font-medium rounded-md ${getStatusLabelClasses(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="space-x-2">
                        <Button onClick={() => handleEdit(invoice)} className="h-7 bg-green-500 hover:bg-green-600">Edit</Button>
                        <Button onClick={() => handleDelete(invoice.id)} className="h-7 bg-red-500 hover:bg-red-600">Delete</Button>
                        <Button onClick={() => handleGenerateLink(invoice.id)} className="h-7 bg-blue-500 hover:bg-blue-600">Link</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* Modals */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {selectedInvoice && <EditInvoiceForm invoice={selectedInvoice} onClose={closeAndRefresh} />}
        </Modal>

        {showLinkModal && (
          <div className="fixed inset-0 z-50 bg-gray-100 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-md shadow-md max-w-lg w-full">
              <h2 className="text-xl font-semibold mb-2">Payment Link</h2>
              <p className="mb-4">Share this link with the customer to complete the payment:</p>
              <a
                href={paymentLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:underline break-words mb-4"
              >
                {paymentLink}
              </a>
              <Button onClick={() => setShowLinkModal(false)} className="bg-indigo-600 hover:bg-indigo-500 text-white">
                Close
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function getStatusLabelClasses(status) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "paid":
      return "bg-green-100 text-green-800";
    case "overdue":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}
