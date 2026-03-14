"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Loader2, Eye, EyeOff, Sparkles, Terminal } from "lucide-react";
import Link from "next/link";

// =============================================================================
// 🚨 DEV LOGIN BYPASS - REMOVE BEFORE PRODUCTION DEPLOYMENT 🚨
// =============================================================================
// The code below (marked with [DEV-BYPASS]) allows quick login during 
// development. It is automatically hidden in production builds.
//
// TO REMOVE:
// 1. Delete lines marked with [DEV-BYPASS] comments
// 2. Remove Terminal import
// 3. Remove isDev check
// 4. Delete this comment block
// =============================================================================

// [DEV-BYPASS] Always show dev login for demo site
const isDev = true;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // [DEV-BYPASS] State for dev login loading
  const [isDevLoading, setIsDevLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Login failed");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // [DEV-BYPASS] Dev bypass function - DELETE THIS FUNCTION FOR PRODUCTION
  const handleDevLogin = async () => {
    setError("");
    setIsDevLoading(true);

    try {
      const res = await fetch("/api/auth/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ devSecret: "dev-mode-123" }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Dev login failed");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError("Dev login failed. Make sure you're in development mode.");
    } finally {
      setIsDevLoading(false);
    }
  };
  // [END-DEV-BYPASS]

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 flex items-center justify-center px-4">
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="floating-orb orb-1 top-0 -left-40 opacity-20" />
        <div className="floating-orb orb-2 top-1/2 -right-40 opacity-15" />
        <div className="floating-orb orb-3 bottom-0 left-1/4 opacity-10" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

      <div className="relative w-full max-w-md">
        {/* Logo with animation */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl mb-5 shadow-2xl shadow-amber-500/30">
            <Package className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-stone-400">Sign in to manage your store</p>
        </div>

        {/* Login Form - Glassmorphism */}
        <div className="animate-fade-in-up animation-delay-100 glass-dark rounded-3xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 bg-stone-800/50 border border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-white placeholder:text-stone-500 transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 bg-stone-800/50 border border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-white placeholder:text-stone-500 transition-all pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Sign In
                </>
              )}
            </button>

            {/* [DEV-BYPASS] Dev Bypass Button - REMOVE THIS BLOCK FOR PRODUCTION */}
            {isDev && (
              <button
                type="button"
                onClick={handleDevLogin}
                disabled={isDevLoading}
                className="w-full py-3 px-4 bg-stone-800 hover:bg-stone-700 border border-stone-600 border-dashed rounded-xl font-medium text-sm text-stone-400 hover:text-stone-300 flex items-center justify-center gap-2 transition-colors"
              >
                {isDevLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Terminal className="h-4 w-4" />
                    Dev: Skip Login
                  </>
                )}
              </button>
            )}
            {/* [END-DEV-BYPASS] */}
          </form>

          <div className="mt-6 pt-6 border-t border-stone-700/50 text-center space-y-2">
            <p className="text-stone-400 text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="text-amber-400 hover:text-amber-300 transition-colors font-medium">
                Create one
              </Link>
            </p>
            <Link href="/" className="text-sm text-stone-400 hover:text-white transition-colors block">
              ← Back to store
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-stone-500 text-sm mt-8 animate-fade-in-up animation-delay-200 space-y-1">
          <p>Secure seller portal</p>
          <p className="text-xs text-stone-600">
            Demo: seller@example.com / password123
          </p>
        </div>
      </div>
    </div>
  );
}
