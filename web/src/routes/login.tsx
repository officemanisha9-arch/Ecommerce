import { createFileRoute } from '@tanstack/react-router'
import { Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { User, Lock } from "lucide-react"
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from "../context/AuthContext"
export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
const { login } = useAuth()
  // --- Form State ---
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  // --- Handle Login ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (res.ok) {
        login(data.user, data.token)
        toast.success("Login successful!")
        setTimeout(() => navigate({ to: '/' }) , 1000) // Redirect after toast
      } else {
        toast.error(data.message || "Invalid email or password")
      }
    } catch (err) {
      console.error(err)
      toast.error("Server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Toaster for toast notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 md:p-12">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Login to your LUXESTORE account
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <User className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all duration-300 shadow-sm"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all duration-300 shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-3 rounded-full shadow-lg hover:from-yellow-600 hover:to-yellow-700 hover:scale-105 transform transition-all duration-300 active:scale-95 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-gray-500 text-sm sm:text-base">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-yellow-600 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </div>

          {/* Social login */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition shadow-md w-full sm:w-auto justify-center">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.12 8.44 9.88v-6.99H7.9v-2.89h2.54V9.41c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.89h-2.34v6.99C18.34 21.12 22 17 22 12z" />
              </svg>
              Facebook
            </button>

            <button className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition shadow-md w-full sm:w-auto justify-center">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21.35 11.1h-9.19v2.82h5.44c-.24 1.43-1.53 4.2-5.44 4.2-3.28 0-5.96-2.72-5.96-6.07s2.68-6.07 5.96-6.07c1.86 0 3.11.8 3.82 1.48l2.61-2.51C19.48 3.12 17.14 2 14.16 2 8.07 2 3 7.06 3 12.13s5.07 10.13 11.16 10.13c6.44 0 10.86-4.53 10.86-10.97 0-.74-.08-1.29-.67-1.19z"/>
              </svg>
              Google
            </button>
          </div>
        </div>
      </div>
    </>
  )
}