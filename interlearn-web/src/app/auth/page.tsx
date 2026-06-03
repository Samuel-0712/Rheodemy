"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, ArrowRight, Lock, User } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const role = searchParams?.get("role") || "learner";
  
  const [isLogin, setIsLogin] = useState(false);
  const [useEmail, setUseEmail] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, hit the API to generate OTP
    router.push("/auth/verify?role=" + role);
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass p-8 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">
                {isLogin ? "Welcome back" : "Create an account"}
              </h1>
              <p className="text-foreground/60">
                {isLogin
                  ? "Enter your details to access your dashboard"
                  : "Join Rheodemy and start your journey"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground/80 pl-1">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-foreground/40" />
                    </div>
                    <input
                      type="text"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-background/50 border border-foreground/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-foreground/40"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <div className="flex justify-between items-center pl-1 pr-1">
                  <label className="text-sm font-medium text-foreground/80">
                    {useEmail ? "Email Address" : "Phone Number"}
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseEmail(!useEmail)}
                    className="text-xs text-primary hover:underline"
                  >
                    Use {useEmail ? "Phone" : "Email"} instead
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {useEmail ? (
                      <Mail className="w-5 h-5 text-foreground/40" />
                    ) : (
                      <Phone className="w-5 h-5 text-foreground/40" />
                    )}
                  </div>
                  <input
                    type={useEmail ? "email" : "tel"}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-background/50 border border-foreground/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-foreground/40"
                    placeholder={useEmail ? "you@example.com" : "+1 234 567 890"}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-foreground/80 pl-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="w-5 h-5 text-foreground/40" />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full pl-12 pr-4 py-3 bg-background/50 border border-foreground/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-foreground/40"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:opacity-90 transition-opacity"
                >
                  {isLogin ? "Sign In" : "Continue to Verification"}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-foreground/60 text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary font-semibold hover:underline focus:outline-none"
                >
                  {isLogin ? "Sign up" : "Log in"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
