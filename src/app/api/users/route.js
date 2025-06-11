import prisma from "@/lib/client";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const users = await prisma.user.findMany({
            include: {
                role: true
            }
        });
        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.error("Error fetching users:", error);
        return NextResponse.json({ message: "Failed to fetch users" }, { status: 500 });
    }
}

export async function POST(req) {
    const body = await req.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
        return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const roleData = await prisma.role.findUnique({ where: { name: role } });

    if (!roleData) {
        return NextResponse.json({ message: "Invalid role provided." }, { status: 400 });
    }

    try {
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                roleId: roleData.id,
            },
        });
        return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
        if (error.code === "P2002") {
            return NextResponse.json({ message: "A user with this email already exists." }, { status: 409 });
        }
        console.error("Error creating user:", error);
        return NextResponse.json({ message: "Failed to create user", error: error.message }, { status: 500 });
    }
}

export async function PUT(req) {
    const { id, name, password } = await req.json();
    const updateData = { name };

    // Only add password to update data if it is provided
    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        updateData.password = hashedPassword;
    }

    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
        });
        return NextResponse.json(updatedUser, { status: 200 });
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ message: "Failed to update user", error: error.message }, { status: 500 });
    }
}

export async function DELETE(req) {
    const { id } = await req.json();
    try {
        await prisma.user.delete({ where: { id } });
        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ message: "Failed to delete user", error: error.message }, { status: 500 });
    }
}
