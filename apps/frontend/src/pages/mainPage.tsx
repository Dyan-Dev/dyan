import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BuilderPage from "./builder";

export default function MainPage() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${apiUrl}/dyan/auth/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(() => setLoading(false))
      .catch(() => navigate("/login"));
  }, []);

  if (loading) return <div>Loading...</div>;

  return <BuilderPage />;
}
