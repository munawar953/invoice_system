import prisma from "./lib/client.js";

const addCustomerAndInvoice = async () => {
  try {
    // 1. Create a new customer
    const customer = await prisma.customer.create({
      data: {
        name: "Nouman Mukhtar",
        email: "nouman@example.com",
        phone: "123-456-7890",
      },
    });

    console.log("Customer created:", customer);

    // 2. Create an invoice linked to the customer
    await prisma.invoice.create({
      data: {
        customerName: customer.name,
        customerId: customer.id,
        email: customer.email,
        amount: 435.45,
        dueDate: new Date("2025-07-01T00:00:00.000Z"),
        description: "Web development services",
      },
    });

    console.log("Invoice inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};

addCustomerAndInvoice();
