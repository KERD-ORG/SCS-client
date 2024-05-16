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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import { useEffect } from "react";
import axios from "axios";

export default function LoginForm() {
  const router = useRouter();

  useEffect(() => {
    // Redirect if already authenticated
    const token = Cookie.get("ACCESS_TOKEN");
    if (token) {
      (async function () {
        try {
          const res = await axios.get("http://127.0.0.1:8000/verify-token/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.status === 200) router.replace("/university");
          else router.replace("/login");
        } catch (error) {
          console.log(error);
        }
      })();
    }
  
     verifyToken();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(e.target["username"].value, e.target["password"].value);
    try {
      const res = await axios.post("http://127.0.0.1:8000/login/", {
        username: e.target["username"].value,
        password: e.target["password"].value
      });
      console.log("response", res);
      if (res.status === 200) {
        Cookie.set("ACCESS_TOKEN", res.data.token.access, { expires: 7 }); // Expires in 1 day
        Cookie.set("REFRESH_TOKEN", res.data.token.refresh, { expires: 1 }); // Expires in 7 days
        router.replace("/university");
        toast("Login successful");
      } else {
        toast("Invalid credentials");
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
