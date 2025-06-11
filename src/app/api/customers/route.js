// import { PrismaClient } from "@prisma/client";

import prisma from "@/lib/client";

// const prisma = new PrismaClient();

// prisma
// Fetch customers
export async function GET() {
  try {
    const customers = await prisma.customer.findMany();
    return new Response(JSON.stringify(customers), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch customers", error: error.message }),
      { status: 500 }
    );
  }
}

// Create a new customer
export async function POST(req) {
  const { name, email, phone } = await req.json();
  try {
    const newCustomer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
      },
    });

    return new Response(JSON.stringify(newCustomer), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating customer:", error);
    return new Response(
      JSON.stringify({ message: "Error creating customer", error: error.message }),
      { status: 500 }
    );
  }
}
// Update an existing customer
export async function PUT(req) {
  const { id, name, phone } = await req.json();
  try {
    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: {
        name,
        phone, // Not updating email as it might be a unique identifier
      },
    });

    return new Response(JSON.stringify(updatedCustomer), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating customer:", error);
    return new Response(
      JSON.stringify({ message: "Error updating customer", error: error.message }),
      { status: 500 }
    );
  }
}

// Delete a customer
export async function DELETE(req) {
  const { id } = await req.json();
  try {
    await prisma.customer.delete({
      where: { id },
    });

    return new Response(JSON.stringify({ message: "Customer deleted successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return new Response(
      JSON.stringify({ message: "Error deleting customer", error: error.message }),
      { status: 500 }
    );
  }
}