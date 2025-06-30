// File: apps/web/pages/login.tsx

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const requestLogin = async () => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("http://localhost:3000/dyan/auth/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("sent");
      } else {
        const err = await res.json();
        setStatus("error");
        setErrorMessage(err.message || "Something went wrong.");
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Network error.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md p-4">
        <CardContent className="space-y-4">
          <h1 className="text-2xl font-bold text-center">Login to Dyan</h1>

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "loading" || status === "sent"}
            />
          </div>

          <Button
            onClick={requestLogin}
            disabled={status === "loading" || !email}
            className="w-full"
          >
            {status === "loading" ? "Sending..." : "Send Login Link"}
          </Button>

          {status === "sent" && (
            <p className="text-green-600 text-sm text-center">
              ✅ Login link sent! Please check your email.
            </p>
          )}
          {status === "error" && (
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
