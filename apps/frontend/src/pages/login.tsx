import { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Loader2, Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && status !== "loading" && status !== "sent") {
      requestLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h1 className="text-2xl font-semibold text-center tracking-tight">
              Welcome to Dyan
            </h1>
            <p className="text-sm text-muted-foreground text-center">
              Enter your email to receive a secure login link
            </p>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  disabled={status === "loading" || status === "sent"}
                  className="h-11"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={status === "loading" || !email || status === "sent"}
                className="w-full h-11 font-medium"
                size="lg"
              >
                {status === "loading" && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {status === "loading" ? "Sending..." : "Send Login Link"}
              </Button>
            </form>

            {status === "sent" && (
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Login link sent successfully! Please check your email inbox.
                </AlertDescription>
              </Alert>
            )}

            {status === "error" && (
              <Alert className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
                <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                <AlertDescription className="text-red-800 dark:text-red-200">
                  {errorMessage}
                </AlertDescription>
              </Alert>
            )}

            {status === "sent" && (
              <div className="text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStatus("idle");
                    setEmail("");
                  }}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Try with a different email
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="text-xs text-center text-muted-foreground mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
