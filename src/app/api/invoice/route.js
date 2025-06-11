import prisma from "@/lib/client";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { customerName, email, amount, dueDate, description, status, newCustomer } = body;

    if (!customerName || !email || !amount || !dueDate) {
      return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    let customerId;

    // Handle new customer addition if needed
    if (newCustomer) {
      const createdCustomer = await prisma.customer.create({
        data: {
          name: customerName,
          email: email,
          // You can add phone or other fields as needed
        },
      });
      customerId = createdCustomer.id;
    } else {
      // Find existing customer by email
      const customer = await prisma.customer.findUnique({
        where: { email: email },
      });
      if (!customer) {
        return NextResponse.json({ message: "Customer not found." }, { status: 404 });
      }
      customerId = customer.id;
    }

    // Create the invoice linked to the customer
    const invoice = await prisma.invoice.create({
      data: {
        customerId,
        customerName,
        email,
        amount: parseFloat(amount),
        dueDate: new Date(dueDate),
        description,
        status: status || "pending",
      },
    });

    return NextResponse.json(invoice, { status: 201 });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
// Get All Invoices
export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany();
    return NextResponse.json(invoices, { status: 200 });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}

// Update Invoice
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, customerName, email, amount, dueDate, description, status } = body;

    if (!id) {
      return NextResponse.json({ message: "Invoice ID is required." }, { status: 400 });
    }

    const dataToUpdate = {};
    if (customerName) dataToUpdate.customerName = customerName;
    if (email) dataToUpdate.email = email;
    if (amount) dataToUpdate.amount = parseFloat(amount);
    if (dueDate) dataToUpdate.dueDate = new Date(dueDate);
    if (description) dataToUpdate.description = description;
    if (status) dataToUpdate.status = status;

    const updatedInvoice = await prisma.invoice.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedInvoice, { status: 200 });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json({ message: "Something went wrong.", error: error.message }, { status: 500 });
  }
}
// Delete Invoice
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "Invoice ID is required." }, { status: 400 });
    }

    await prisma.invoice.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Invoice deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
