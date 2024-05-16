"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import Cookie from "js-cookie";
import axios from "axios";

function Register() {
  const router = useRouter();
  const [userType, setUserType] = useState("student");

  useEffuseEffect(() => {
    // Redirect if already authenticated
    const token = Cookie.get("ACCESS_TOKEN");
    if (token) {
      (async function () {
        try {
          const res = await axios.get("http://localhost:8000/verify-token/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.status === 200) router.replace("/university");
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/register/", {
        username: e.target["username"].value,
        email: e.target["email"].value,
        password: e.target["password"].value,
        is_teacher: userType === "teacher",
        is_student: userType === "student",
      });
      if (res.status === 201) {
        router.replace("/login");
      }
    } catch (error) {
      toast(error.message);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-[whitesmoke]">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter required information below to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="john_doe"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Register as a</Label>
                </div>
                <Select
                  onValueChange={(e) => setUserType(e)}
                  defaultValue={userType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Teacher or Student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                Sign up
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
