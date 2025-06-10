
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
// import Modal from '@/components/ui/'
import EditInvoiceForm from "@/components/EditInvoiceForm";
import useSession from "@/hooks/useSession";
export default function Dashboard() {
  const session = useSession();
  const router = useRouter();
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar initially closed
  const [paymentLink, setPaymentLink] = useState(""); // To store the generated link
  const [showLinkModal, setShowLinkModal] = useState(false);
 
  // useEffect(() => {
  //     if (session) {
  //         axios.get("/api/invoice").then(res => setInvoices(res.data));
  //     }
  // }, [session]);

  const handleEdit = (invoice) => {
      setSelectedInvoice(invoice);
      setIsModalOpen(true);
  };

  const closeAndRefresh = () => {
      setIsModalOpen(false);
      axios.get("/api/invoice").then(res => setInvoices(res.data));
  };

  const logoutClick = async () => {
  await fetch("/api/logout", { method: "POST" });
  window.location.href = "/login";
};

  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     router.push("/login");
  //   } else if (status === "authenticated") {
  //     fetchInvoices();
  //   }
  // }, [status, router]);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get("/api/invoice");
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      // Consider setting an error state and displaying it
    }
  };
  const handleGenerateLink = async (invoiceId) => {
    try {
      const response = await fetch(`/api/invoice/generate-link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: invoiceId }),
      });
  
      if (response.ok) {
        const data = await response.json();
        alert(`Payment link generated: ${data.paymentLink}`);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error generating payment link:", error.message);
      alert("Failed to generate payment link. Please check the logs.");
    }
  };
    
  const handleCreateCustomer = () => router.push("/create-customer");
  const handleCreateInvoice = () => router.push("/create-invoice");
  const handleCreateUser = () => router.push("/create-user");
  const handleViewUser = () => router.push("/view-user");
  const handleViewCustomer = () => router.push("/view-customer");

  // Delete Invoice
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this invoice?")) {
      const response = await fetch(`/api/invoice`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
  
      if (response.ok) {
        // Refresh the list or filter out the deleted item from state
        setInvoices(prevInvoices => prevInvoices.filter(invoice => invoice.id !== id));
      } else {
        alert("Failed to delete the invoice.");
      }
    }
  };
  
  // if (status === "loading") {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed z-50 bg-gradient-to-b from-blue-800 to-blue-600 text-white h-screen shadow-xl transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full"
        }`}
      >
        {isSidebarOpen && (
          <div className="relative h-full p-5">
            {/* Cross Icon */}
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-4 right-4 text-white text-2xl font-bold hover:text-gray-300 transition-transform hover:scale-110"
            >
              ✕
            </button>
            <h2 className="text-2xl font-extrabold mb-8 text-center">Dashboard</h2>
            {/* {session && session.user.role === 'ADMIN' && ( */}
            {session?.user?.role === 'ADMIN' && (

              <div> 
                <button
                  onClick={handleCreateCustomer}
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4 shadow-lg transition-transform hover:scale-105"
                >
                  Add Customer
                </button>
                <button
                  onClick={handleViewCustomer}
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4 shadow-lg transition-transform hover:scale-105"
                >
                  View Customers
                </button>
                <button
                  onClick={handleCreateInvoice}
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4 shadow-lg transition-transform hover:scale-105"
                >
                  Create Invoice
                </button>
                <button
                  onClick={handleCreateUser}
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4 shadow-lg transition-transform hover:scale-105"
                >
                  Add New User
                </button>
                <button
                  onClick={handleViewUser}
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mb-4 shadow-lg transition-transform hover:scale-105"
                >
                  View Users
                </button>
              </div>
            )}
            <button
              onClick={logoutClick}
              className="block w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded shadow-lg transition-transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } w-full p-4 lg:p-8`}
      >
        {/* Welcome Bar */}
        <div className="flex items-center bg-white p-4 shadow-md sticky top-0 z-50">
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              ☰
            </button>
          )}
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 ml-4">
            Welcome, {session?.user?.name}
          </h1>
        </div>

        <Card className="shadow-xl mt-4">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Invoices</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <Table className="w-full border rounded-lg overflow-hidden">
              <TableHeader className="bg-gray-200">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  {session?.user?.role === 'ADMIN'  && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-gray-100">
                    <TableCell>{invoice.id}</TableCell>
                    <TableCell>{invoice.customerName}</TableCell>
                    <TableCell>{invoice.email}</TableCell>
                    <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          getStatusLabelClasses(invoice.status)
                        }`}
                      >
                        {invoice.status}
                      </div>
                    </TableCell>
                    {session?.user?.role === 'ADMIN' &&  (
                      <TableCell>
                        <Button
                          onClick={() => handleEdit(invoice)}
                          className="bg-green-500 text-white hover:bg-green-600 hover:scale-105 transition-transform"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(invoice.id)}
                          className="ml-2 bg-red-500 text-white hover:bg-red-600 hover:scale-105 transition-transform"
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={() => handleGenerateLink(invoice.id)}
                          className="bg-blue-500 text-white hover:bg-blue-600 transition-transform"
                        >
                          Generate Payment Link
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {selectedInvoice && (
            <EditInvoiceForm
              invoice={selectedInvoice}
              onClose={closeAndRefresh}
            />
          )}
        </Modal> */}


        {/* Payment Link Modal */}
        {showLinkModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Payment Link</h2>
              <p className="mb-4">
                Share this link with the customer to complete the payment:
              </p>
              <div className="mb-4 p-2 border rounded">
                <a href={paymentLink} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                  {paymentLink}
                </a>
              </div>
              <Button onClick={() => setShowLinkModal(false)} className="bg-red-500 text-white hover:bg-red-600">
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
    case "pending": return "bg-yellow-100 text-yellow-800";
    case "paid": return "bg-green-100 text-green-800";
    case "overdue": return "bg-red-500 text-white";
    default: return "bg-gray-100 text-gray-800";
  }
}
