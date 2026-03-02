"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package, Loader2, Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SetupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shopName, setShopName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = async () => {
    try {
      const res = await fetch("/api/auth/setup");
      const data = await res.json();
      if (data.success && !data.data.needsSetup) {
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, shopName }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Setup failed");
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

  if (checking) {
    return (
      <div className="min-h-screen bg-stone-950 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 flex items-center justify-center px-4 py-8">
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
          <h1 className="text-3xl font-bold text-white mb-2">Set Up Your Store</h1>
          <p className="text-stone-400">Create your seller account to get started</p>
        </div>

        {/* Setup Form - Glassmorphism */}
        <div className="animate-fade-in-up animation-delay-100 glass-dark rounded-3xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-300 mb-2">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3.5 bg-stone-800/50 border border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-white placeholder:text-stone-500 transition-all"
                placeholder="John Doe"
                required
              />
            </div>

            <div>
              <label htmlFor="shopName" className="block text-sm font-medium text-stone-300 mb-2">
                Shop Name
              </label>
              <input
                id="shopName"
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-4 py-3.5 bg-stone-800/50 border border-stone-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-white placeholder:text-stone-500 transition-all"
                placeholder="My OpenBox Store"
              />
            </div>

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
                  placeholder="At least 6 characters"
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
              className="w-full btn-primary py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-stone-700/50 text-center">
            <Link href="/" className="text-sm text-stone-400 hover:text-white transition-colors">
              ← Back to store
            </Link>
          </div>
        </div>

        {/* Features list */}
        <div className="mt-8 space-y-3 animate-fade-in-up animation-delay-200">
          <div className="flex items-center gap-3 text-stone-400 text-sm">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-emerald-500" />
            </div>
            <span>Manage your inventory</span>
          </div>
          <div className="flex items-center gap-3 text-stone-400 text-sm">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-emerald-500" />
            </div>
            <span>Track sales and analytics</span>
          </div>
          <div className="flex items-center gap-3 text-stone-400 text-sm">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-emerald-500" />
            </div>
            <span>AI-powered API access</span>
          </div>
        </div>
      </div>
    </div>
  );
}
