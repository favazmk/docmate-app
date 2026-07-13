"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Lock, Mail, User } from "lucide-react";
import { registerPatient } from "@/app/actions/auth";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    
    const res = await registerPatient(formData);

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      // Auto login after successful registration
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Registration successful, but auto-login failed. Please sign in manually.");
        setLoading(false);
        router.push("/login?registered=true");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    }
  };

  return (
    <div className="min-h-[80vh] bg-gray-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-text-dark">
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-text-mid">
          Sign up to easily book and manage your appointments
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-xl sm:px-10 border border-gray-border">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-blue-primary focus:border-blue-primary sm:text-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

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
                  name="email"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-blue-primary focus:border-blue-primary sm:text-sm"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-dark mb-1">
                Phone Number
              </label>
              <div className="flex">
                <select
                  name="phonePrefix"
                  defaultValue="+971"
                  className="bg-gray-bg border border-gray-border border-r-0 rounded-l-xl px-3 text-sm font-medium text-text-dark focus:outline-none"
                >
                  <option>+971</option>
                  <option>+966</option>
                  <option>+965</option>
                </select>
                <input
                  type="tel"
                  name="phone"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-border rounded-r-xl placeholder-gray-400 focus:outline-none focus:ring-blue-primary focus:border-blue-primary sm:text-sm"
                  placeholder="50 123 4567"
                />
              </div>
            </div>

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
                  name="password"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-border rounded-xl placeholder-gray-400 focus:outline-none focus:ring-blue-primary focus:border-blue-primary sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`${buttonVariants()} w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-blue-primary hover:bg-blue-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-primary disabled:opacity-50`}
              >
                {loading ? "Creating account..." : "Sign up"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link href="/login" className="text-sm font-medium text-blue-primary hover:text-blue-hover">
                Sign in to your account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
