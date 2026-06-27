import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "../components/ui/layout";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/ui/alert";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      if (!data.token) {
        setError("Login failed: token not returned");
        return;
      }

      localStorage.setItem("authToken", data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="w-full max-w-[1160px] mx-auto px-4 md:px-6">
        <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12">
          <div className="w-full max-w-md bg-white rounded-[20px] shadow-lg p-8 md:p-10">
            <h1 className="text-2xl md:text-3xl font-bold text-[#222a47] mb-8 text-center">
              Admin Login
            </h1>
            {error && (
              <Alert variant="destructive" className="mb-6">
                {error}
              </Alert>
            )}
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-[#222a47] mb-2">
                  Username
                </label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  className="w-full h-[45px] md:h-[55px] px-5 rounded-[12px] border-2 border-[#e56815] focus:border-[#d55a12] focus:ring-2 focus:ring-[#e56815] bg-white transition-shadow hover:shadow-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#222a47] mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full h-[45px] md:h-[55px] px-5 rounded-[12px] border-2 border-[#e56815] focus:border-[#d55a12] focus:ring-2 focus:ring-[#e56815] bg-white transition-shadow hover:shadow-sm"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-[45px] md:h-[55px] bg-[#e56815] hover:bg-[#d55a12] text-white rounded-[12px] font-semibold transition-all hover:scale-[1.02] ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
