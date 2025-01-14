"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type RoleType = "admin" | "pantry" | "kitchen" | "delivery" | "";

const Register = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<RoleType>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await register(name, email, password, role);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (isErrorWithMessage(err)) {
        setError(err.error || "Registration failed");
      } else {
        setError("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  function isErrorWithMessage(err: unknown): err is { error: string } {
    return (
      typeof err === "object" &&
      err !== null &&
      "error" in (err as { error?: unknown }) &&
      typeof (err as { error: unknown }).error === "string"
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-[450px] p-10 rounded-2xl bg-card">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Create Account
          </h1>
          <p className="text-muted">Join Hospital Food Management</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <select
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={role}
              onChange={(e) => setRole(e.target.value as RoleType)}
              required
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="delivery">Delivery Staff</option>
              <option value="pantry">Pantry Staff</option>
            </select>
          </div>
          <div>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="pt-4">
            <button
              className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-muted transition flex items-center justify-center gap-2"
              type="submit"
              disabled={loading}
            >
              {loading && (
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
              )}
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>

          <div className="text-center text-sm text-muted">
            <span>Already have an account? </span>
            <a
              href="/login"
              className="text-primary hover:text-muted transition"
            >
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
