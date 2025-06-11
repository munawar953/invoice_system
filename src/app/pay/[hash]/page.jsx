"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PaymentPage({ params }) {
  const { hash } = params; // Extract the hash from the URL
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    fetchInvoice();
  }, []);

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`/api/invoice/hash/${hash}`);
      const data = await response.json();
      setInvoice(data);
    } catch (error) {
      console.error("Error fetching invoice:", error);
    }
  };

  const handlePayment = async () => {
    alert("Payment functionality to be implemented!");
    // You can add logic here to handle payment processing
  };

  if (!invoice) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Invoice Payment</h1>
      <p><strong>Customer:</strong> {invoice.customerName}</p>
      <p><strong>Amount:</strong> ${invoice.amount.toFixed(2)}</p>
      <p><strong>Description:</strong> {invoice.description}</p>
      <Input type="text" placeholder="Enter Card Details" className="my-4" />
      <Button onClick={handlePayment} className="bg-blue-500 text-white hover:bg-blue-600">
        Proceed to Payment
      </Button>
    </div>
  );
}
