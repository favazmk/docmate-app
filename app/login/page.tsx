"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Lock, Mail } from "lucide-react";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [phonePrefix, setPhonePrefix] = useState("+971");
  const [isPasswordless, setIsPasswordless] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const registered = searchParams.get("registered");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const fullPhone = isPasswordless ? `${phonePrefix} ${phone.trim()}` : "";

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password: isPasswordless ? "" : password,
      phone: fullPhone,
      isPasswordless: isPasswordless ? "true" : "false",
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error === "CredentialsSignin" ? "Invalid login details." : res.error);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-text-dark">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-text-mid">
          Secure access to your appointments
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-gray-border">
          
          {/* Toggle Tabs */}
          <div className="flex bg-gray-bg p-1 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => { setIsPasswordless(false); setError(""); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${!isPasswordless ? "bg-white text-blue-primary shadow-sm" : "text-text-mid hover:text-text-dark"}`}
            >
              Password Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsPasswordless(true); setError(""); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${isPasswordless ? "bg-white text-blue-primary shadow-sm" : "text-text-mid hover:text-text-dark"}`}
            >
              Email + Phone (Passwordless)
            </button>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                {error}
              </div>
            )}
            {registered && (
              <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm border border-green-200">
                Account created successfully! Please sign in.
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-blue-primary focus:border-blue-primary sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {!isPasswordless ? (
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-blue-primary focus:border-blue-primary sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-text-dark mb-1">
                  Phone Number
                </label>
                <div className="flex">
                  <select
                    value={phonePrefix}
                    onChange={(e) => setPhonePrefix(e.target.value)}
                    className="bg-gray-bg border border-gray-border border-r-0 rounded-l-xl px-3 text-sm font-medium text-text-dark focus:outline-none"
                  >
                    <option>+971</option>
                    <option>+966</option>
                    <option>+965</option>
                  </select>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-border rounded-r-xl placeholder-gray-400 focus:outline-none focus:ring-blue-primary focus:border-blue-primary sm:text-sm"
                    placeholder="50 123 4567"
                  />
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`${buttonVariants()} w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-primary hover:bg-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-primary disabled:opacity-50`}
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </div>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    New to Docmate?
                  </span>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link href="/register" className="text-sm font-medium text-blue-primary hover:text-blue-hover">
                  Create an account
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
