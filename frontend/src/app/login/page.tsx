"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

type RoleType = "admin" | "pantry" | "kitchen" | "delivery" | "";

const Login = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [role, setRole] = useState<RoleType>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password, role);
      router.push("/dashboard");
    } catch (err: unknown) {
      if (isErrorWithMessage(err)) {
        setError(err.error || "Login failed");
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  // Type guard function
  function isErrorWithMessage(err: unknown): err is { error: string } {
    return (
      typeof err === "object" &&
      err !== null &&
      "error" in (err as { error?: unknown }) &&
      typeof (err as { error: unknown }).error === "string"
    );
  }

  // if (loading) {
  //   return <div className="spinner" />;
  // }

  if (role === "") {
    return (
      <>
        <div className="min-h-full flex items-center justify-center bg-background px-4">
          <div className="w-full max-w-[750px] p-10 pb-2 rounded-2xl bg-card">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-4">
                Select Role
              </h1>
              <div className="grid grid-cols-3 gap-4">
                <button
                  className={`p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3
										hover:scale-105 hover:shadow-lg
										${
                      role === ("admin" as RoleType)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-secondary/50"
                    }`}
                  onClick={() => setRole("admin")}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-lg">Admin</span>
                  <span className="text-sm text-muted">
                    Full system control
                  </span>
                </button>

                <button
                  className={`p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3
										hover:scale-105 hover:shadow-lg
										${
                      role === ("pantry" as RoleType)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-secondary/50"
                    }`}
                  onClick={() => setRole("pantry")}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-lg">Pantry</span>
                  <span className="text-sm text-muted">
                    Inventory Management
                  </span>
                </button>

                <button
                  className={`p-6 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3
										hover:scale-105 hover:shadow-lg
										${
                      role === ("delivery" as RoleType)
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-secondary/50"
                    }`}
                  onClick={() => setRole("delivery")}
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <span className="font-medium text-lg">Delivery</span>
                  <span className="text-sm text-muted">Food Distribution</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-full flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-[450px] p-10 rounded-2xl bg-card">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">Sign in</h1>
          <p className="text-muted">to continue to Hospital Food Management</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
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

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-muted">
                Remember me
              </label>
            </div>
            <a href="#" className="text-primary hover:text-muted transition">
              Forgot password?
            </a>
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-500 text-sm rounded-lg p-3">
              {error}
            </div>
          )}

          <div className="pt-4">
            <button
              className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-muted transition flex items-center justify-center gap-2"
              type="submit"
              disabled={loading}
            >
              {loading && <div className="spinner" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </div>

          <div className="text-center text-sm text-muted">
            <span>Don't have an account? </span>
            <a
              href="/register"
              className="text-primary hover:text-muted transition"
            >
              Create one
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
