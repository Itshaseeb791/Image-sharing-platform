"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner"; // optional toast notifications
import { useRouter } from "next/navigation";

interface AuthFormProps {
  type: "login" | "signup";
}

export function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = type === "login" ? "/api/auth/login" : "/api/auth/signup";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      toast.success(data.message || "Success!");

      if (type === "login") {
        localStorage.setItem("token", data.token); // save JWT
        router.push("/"); // redirect to home/dashboard
      } else {
        router.push("/auth/login"); // redirect to login after signup
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-8 rounded-2xl shadow-lg bg-white space-y-6"
    >
      <h1 className="text-2xl font-bold text-center">
        {type === "login" ? "Welcome Back" : "Create Account"}
      </h1>

      {type === "signup" && (
        <Input
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}

      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Processing..." : type === "login" ? "Login" : "Sign Up"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {type === "login" ? (
          <>
            Don't have an account?{" "}
            <a href="/auth/signup" className="text-blue-500 font-medium">
              Sign Up
            </a>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <a href="/auth/login" className="text-blue-500 font-medium">
              Login
            </a>
          </>
        )}
      </p>
    </form>
  );
}
