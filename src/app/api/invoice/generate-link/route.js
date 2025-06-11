// import { PrismaClient } from "@prisma/client";
import prisma from "@/lib/client";
import crypto from "crypto";

// const prisma = new PrismaClient();
// prisma

export async function POST(req) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return new Response(JSON.stringify({ message: "Invoice ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if the invoice exists
    const invoice = await prisma.invoice.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!invoice) {
      return new Response(JSON.stringify({ message: "Invoice not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate a unique hash and payment link
    const hash = crypto.randomBytes(16).toString("hex");
    const paymentLink = `${process.env.NEXT_PUBLIC_BASE_URL}/pay/${hash}`;

    // Update the invoice with the payment link and hash
    const updatedInvoice = await prisma.invoice.update({
      where: { id: parseInt(id, 10) },
      data: {
        paymentLink,
        hash,
      },
    });

    return new Response(JSON.stringify({ paymentLink: updatedInvoice.paymentLink }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating payment link:", error);
    return new Response(
      JSON.stringify({ message: "Failed to generate payment link", error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
