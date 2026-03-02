"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Package, Loader2, Eye, EyeOff, Sparkles, Check, X } from "lucide-react";
import Link from "next/link";

interface ValidationErrors {
  [key: string]: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    shopName: "",
    whatsapp: "",
    address: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ValidationErrors>({});
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[@$!%*?&]/.test(password),
    };
    return checks;
  };

  const passwordChecks = validatePassword(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error when user types
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!data.success) {
        if (data.errors) {
          // Handle validation errors
          const errors: ValidationErrors = {};
          data.errors.forEach((err: { field: string; message: string }) => {
            errors[err.field] = err.message;
          });
          setFieldErrors(errors);
        } else {
          setError(data.error || "Signup failed");
        }
        return;
      }

      // Redirect to admin dashboard on success
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

      <div className="relative w-full max-w-lg">
        {/* Logo with animation */}
        <div className="text-center mb-6 animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl mb-4 shadow-2xl shadow-amber-500/30">
            <Package className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Create Seller Account</h1>
          <p className="text-stone-400 text-sm">Start selling your open box products</p>
        </div>

        {/* Signup Form - Glassmorphism */}
        <div className="animate-fade-in-up animation-delay-100 glass-dark rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                <X className="h-4 w-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-stone-300 mb-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-stone-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-white placeholder:text-stone-500 transition-all text-sm ${
                  fieldErrors.name ? "border-red-500" : "border-stone-700"
                }`}
                placeholder="John Doe"
                required
              />
              {fieldErrors.name && <p className="text-red-400 text-xs mt-1">{fieldErrors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-stone-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-white placeholder:text-stone-500 transition-all text-sm ${
                  fieldErrors.email ? "border-red-500" : "border-stone-700"
                }`}
                placeholder="you@example.com"
                required
              />
              {fieldErrors.email && <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>}
            </div>

            {/* Shop Name */}
            <div>
              <label htmlFor="shopName" className="block text-sm font-medium text-stone-300 mb-1">
                Shop Name
              </label>
              <input
                id="shopName"
                name="shopName"
                type="text"
                value={formData.shopName}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-stone-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-white placeholder:text-stone-500 transition-all text-sm ${
                  fieldErrors.shopName ? "border-red-500" : "border-stone-700"
                }`}
                placeholder="My OpenBox Store"
                required
              />
              {fieldErrors.shopName && <p className="text-red-400 text-xs mt-1">{fieldErrors.shopName}</p>}
            </div>

            {/* WhatsApp */}
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-stone-300 mb-1">
                WhatsApp Number
              </label>
              <input
                id="whatsapp"
                name="whatsapp"
                type="tel"
                value={formData.whatsapp}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-stone-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-white placeholder:text-stone-500 transition-all text-sm ${
                  fieldErrors.whatsapp ? "border-red-500" : "border-stone-700"
                }`}
                placeholder="+919999999999"
                required
              />
              <p className="text-stone-500 text-xs mt-1">Include country code (e.g., +91 for India)</p>
              {fieldErrors.whatsapp && <p className="text-red-400 text-xs mt-1">{fieldErrors.whatsapp}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-stone-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-white placeholder:text-stone-500 transition-all pr-12 text-sm ${
                    fieldErrors.password ? "border-red-500" : "border-stone-700"
                  }`}
                  placeholder="Create a secure password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              
              {/* Password requirements */}
              {formData.password && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-1 text-xs">
                    {passwordChecks.length ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-red-400" />}
                    <span className={passwordChecks.length ? "text-emerald-400" : "text-stone-500"}>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {passwordChecks.uppercase ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-red-400" />}
                    <span className={passwordChecks.uppercase ? "text-emerald-400" : "text-stone-500"}>One uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {passwordChecks.lowercase ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-red-400" />}
                    <span className={passwordChecks.lowercase ? "text-emerald-400" : "text-stone-500"}>One lowercase letter</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {passwordChecks.number ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-red-400" />}
                    <span className={passwordChecks.number ? "text-emerald-400" : "text-stone-500"}>One number</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {passwordChecks.special ? <Check className="h-3 w-3 text-emerald-400" /> : <X className="h-3 w-3 text-red-400" />}
                    <span className={passwordChecks.special ? "text-emerald-400" : "text-stone-500"}>One special character (@$!%*?&)</span>
                  </div>
                </div>
              )}
              {fieldErrors.password && <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-stone-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-white placeholder:text-stone-500 transition-all pr-12 text-sm ${
                    fieldErrors.confirmPassword ? "border-red-500" : "border-stone-700"
                  }`}
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && <p className="text-red-400 text-xs mt-1">{fieldErrors.confirmPassword}</p>}
            </div>

            {/* Address (Optional) */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-stone-300 mb-1">
                Business Address (Optional)
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className={`w-full px-4 py-3 bg-stone-800/50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 text-white placeholder:text-stone-500 transition-all text-sm resize-none ${
                  fieldErrors.address ? "border-red-500" : "border-stone-700"
                }`}
                placeholder="Your business address"
              />
              {fieldErrors.address && <p className="text-red-400 text-xs mt-1">{fieldErrors.address}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl font-semibold text-base flex items-center justify-center gap-2 mt-6"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-stone-700/50 text-center space-y-2">
            <Link href="/login" className="text-sm text-amber-400 hover:text-amber-300 transition-colors block">
              Already have an account? Sign in
            </Link>
            <Link href="/" className="text-sm text-stone-400 hover:text-white transition-colors block">
              ← Back to store
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-stone-500 text-xs mt-6 animate-fade-in-up animation-delay-200">
          Secure seller registration • Passwords are encrypted
        </p>
      </div>
    </div>
  );
}
