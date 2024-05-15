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
import Link from "next/link";
import api from "../../lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import { useEffect } from "react";

export default function LoginForm() {
  const router = useRouter();

  useEffect(() => {
    // Redirect if already authenticated
    const token = Cookie.get("ACCESS_TOKEN");
    if (token) {
      router.replace("/university"); // Or to another appropriate route
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    console.log()
    const res = await fetch('http://localhost:8000/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email: e.target['email'].value, password: e.target['password'].value})
    })
    const data= await res.json()
    console.log(data)
  }
  return (
    <div className="min-h-screen grid place-items-center bg-[whitesmoke]">
        <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="text"
              placeholder="m@example.com"
              required
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              {/* <Link href="#" className="ml-auto inline-block text-sm underline">
=======
    try {
      const res = await api.post("login/", {
        username: e.target["username"].value,
        password: e.target["password"].value,
      });
      if (res.status === 200) {
        Cookie.set("ACCESS_TOKEN", res.data.token.access, { expires: 1 }); // Expires in 1 day
        Cookie.set("REFRESH_TOKEN", res.data.token.refresh, { expires: 7 }); // Expires in 7 days
        router.replace("/");
      }
    } catch (error) {
      console.log(error);
      toast(error.message);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-[whitesmoke]">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" type="text" placeholder="john" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <Link href="#" className="ml-auto inline-block text-sm underline">
>>>>>>> a40585d36466bde3fdd245ecc06c7ef80273b0d3
                Forgot your password?
              </Link> */}
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              {/* <Button variant="outline" className="w-full">
            Login with Google
          </Button> */}
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// export async function getServerSideProps(context) {
//   const { req } = context;
//   const { cookies } = req;

//   // Assuming you have a way to verify tokens server-side
//   const { authorized } = await verifyToken(
//     cookies.ACCESS_TOKEN,
//     cookies.REFRESH_TOKEN
//   );

//   if (authorized) {
//     return {
//       redirect: {
//         destination: "/", // Redirect to the homepage or user dashboard
//         permanent: false,
//       },
//     };
//   }

//   return { props: {} }; // Return empty props if not authenticated
// }
