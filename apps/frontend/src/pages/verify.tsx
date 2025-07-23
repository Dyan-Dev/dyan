// File: pages/verify.tsx

import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function VerifyPage() {
  const [status, setStatus] = useState<"verifying" | "success" | "error">(
    "verifying"
  );
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("token");
      if (!token) {
        setStatus("error");
        return;
      }

      try {
        const res = await fetch(`${apiUrl}/dyan/auth/verify?token=${token}`, {
          credentials: "include",
        });
        if (res.ok) {
          setStatus("success");
          setTimeout(() => navigate("/"), 1500);
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    };

    verify();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-center">
      <div>
        {status === "verifying" && <p>Verifying your login...</p>}
        {status === "success" && <p>Login successful! Redirecting...</p>}
        {status === "error" && (
          <p className="text-red-600">Invalid or expired link.</p>
        )}
      </div>
    </div>
  );
}
