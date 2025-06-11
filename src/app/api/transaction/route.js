// src/app/api/transaction/route.js
import prisma from "@/lib/client";

export async function POST(req) {
  const { invoiceId, amount } = req.json();
  try {
    const transaction = await prisma.transaction.create({
      data: {
        invoiceId,
        amount,
        transactionDate: new Date(),
        status: "pending" // Default status, update as needed
      }
    });
    return new Response(JSON.stringify(transaction), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return new Response(
      JSON.stringify({ message: "Error creating transaction", error: error.message }),
      { status: 500 }
    );
  }
}
