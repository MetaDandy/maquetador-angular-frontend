'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Github } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // logica de autenticacion

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-white to-gray-100">
      {/* Contenedor con animación */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm bg-white p-8 rounded-md shadow-md"
      >
        {/* Encabezado */}
        <div className="mb-6 text-center space-y-2">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-gray-600">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Formulario */}
        <form className="space-y-6">
          {/* Campo Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="test@youtube.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Campo Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot password */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
              />
              <Label htmlFor="remember-me" className="text-gray-700">
                Remember me
              </Label>
            </div>
            <button
              type="button"
              className="text-gray-600 hover:text-gray-800 underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Botón Sign In */}
          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-gray-900"
          >
            Sign in
          </Button>
        </form>

        {/* Separador OR CONTINUE WITH */}
        <div className="my-6 flex items-center text-gray-500 text-sm">
          <span className="flex-1 h-px bg-gray-200" />
          <span className="px-3">OR CONTINUE WITH</span>
          <span className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Botones OAuth */}
        <div className="flex flex-col space-y-3">
          {/* Github */}
          <Button variant="outline" className="w-full flex items-center justify-center">
            <Github size={18} className="mr-2" />
            Github
          </Button>
          {/* Google */}
          <Button variant="outline" className="w-full flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="mr-2 h-5 w-5" 
              viewBox="0 0 48 48"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.94 0 7.5 1.62 10.05 4.23l6.24-6.24C35.6 3.07 30.12.5 24 .5 14.88.5 6.49 6.35 2.74 14.26l7.74 6.01C12.17 14.05 17.56 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.15 24.5c0-1.24-.11-2.45-.31-3.62H24v7h12.5c-.54 2.9-2.16 5.35-4.6 7l7.05 5.47c4.12-3.8 6.2-9.4 6.2-15.85z"
              />
              <path
                fill="#FBBC05"
                d="M10.48 28.49a10.46 10.46 0 0 1-.55-3.49c0-1.21.2-2.39.55-3.49l-7.74-6.01A21.91 21.91 0 0 0 2 25c0 3.66.87 7.12 2.43 10.2l7.76-6.71z"
              />
              <path
                fill="#34A853"
                d="M24 46.5c5.88 0 10.83-1.95 14.44-5.3l-7.05-5.47c-2 1.35-4.59 2.14-7.39 2.14-6.44 0-11.83-4.55-13.74-10.73l-7.74 6.01C6.49 41.65 14.88 47.5 24 47.5z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            Google
          </Button>
        </div>

        {/* Enlace para crear cuenta */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <a href="#" className="font-medium text-gray-800 hover:underline">
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
}