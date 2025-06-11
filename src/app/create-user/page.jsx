"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/Loader/Loader";
import useSession from "@/hooks/useSession";

export default function CreateUserForm({ onSubmit }) {
  // const { data: session, status } = useSession();
  const session = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER'
  });
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (status === "loading") return; // Wait until the session is loaded
  //   if (!session) {
  //     // If not signed in, redirect to the login page
  //     router.push("/login");
  //   } else if (session.user.role !== 'ADMIN') {
  //     // If not admin, redirect to the dashboard or an unauthorized access page
  //     router.push("/dashboard");
  //   }
  // }, [session, status, router]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    
    if (response.ok) {
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'USER'    
      });
      setLoading(false);
      router.push("/dashboard");
    } else {
      const error = await response.json();
      alert(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  // if (status === "loading" || status === "unauthenticated") {
  //   return <div>Loading...</div>; // Provide a loading state or manage redirection
  // }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label>Name:</label>
              <Input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <label>Email:</label>
              <Input type="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div>
              <label>Password:</label>
              <Input type="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role:
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2"
              >
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} className="w-full">
            {loading ? <Loader /> : "Create User"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
