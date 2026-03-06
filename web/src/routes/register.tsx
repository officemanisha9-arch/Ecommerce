import { createFileRoute } from '@tanstack/react-router'
import { Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { User, Lock } from "lucide-react"
import { FaMobile } from 'react-icons/fa'
import toast, { Toaster } from 'react-hot-toast'

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()

  // --- Form State ---
  const [full_name, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // --- Handle Register ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name, email, phone, password }),
      })

      const data = await res.json()
      if (res.ok) {
        toast.success("Registered successfully!")
        navigate("/login")
      } else {
        toast.error(data.message || "Registration failed")
      }
    } catch (err) {
      console.error(err)
      toast.error("Server error")
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
              Create Account
            </h1>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Sign up to start shopping at LUXESTORE
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="relative">
              <User className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Full Name"
                value={full_name}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all duration-300 shadow-sm"
                required
              />
            </div>

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
              <FaMobile className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                type="tel"
                placeholder="Phone No"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
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

            <div className="relative">
              <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all duration-300 shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold py-3 rounded-full shadow-lg hover:from-yellow-600 hover:to-yellow-700 hover:scale-105 transform transition-all duration-300 active:scale-95"
            >
              Sign Up
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-gray-500 text-sm sm:text-base">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-yellow-600 font-medium hover:underline"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}