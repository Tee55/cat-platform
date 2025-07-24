"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff, User, Lock, AlertCircle } from "lucide-react";
import { authService } from "@/server/api/services/auth";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

type FieldErrorsType = {
  email?: string;
  password?: string;
};

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "admin@example.com",
    password: "Admin@123",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrorsType>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load remembered credentials
  useEffect(() => {
    const rememberedUser = localStorage?.getItem("rememberedUser");
    if (rememberedUser) {
      try {
        const userData = JSON.parse(rememberedUser);
        if (userData.expiry > Date.now()) {
          setFormData({
            email: userData.email,
            password: userData.password,
          });
          setRememberMe(true);
        } else {
          localStorage.removeItem("rememberedUser");
        }
      } catch (err) {
        localStorage?.removeItem("rememberedUser");
      }
    }
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!formData.email.trim()) {
      fieldErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      fieldErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      fieldErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      fieldErrors.password = "Password must be at least 6 characters";
    }

    setFieldErrors(fieldErrors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (
    e: { preventDefault: () => void } | undefined,
  ) => {
    e?.preventDefault();

    setError("");
    setFieldErrors({});

    if (!validateForm()) return;

    setIsLoading(true);

    // Handle remember me
    if (rememberMe) {
      const userData = {
        email: formData.email,
        password: formData.password,
        expiry: Date.now() + 24 * 60 * 60 * 1000,
      };
      localStorage?.setItem("rememberedUser", JSON.stringify(userData));
    } else {
      localStorage?.removeItem("rememberedUser");
    }

    // Call the login api
    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/vulnerability-dashboard");
    }
    setIsLoading(false);
  };

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      setFieldErrors((prev) => ({ ...prev, [field]: "" }));
      if (error) setError("");
    };

  const handleForgotPassword = () => {
    alert(
      "Please contact administrator for password reset\nEmail: Alert@mdr-center.com",
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-orange-50">
      <Card className="flex h-5/6 w-11/12 max-w-6xl overflow-hidden rounded-3xl bg-orange-500 shadow-2xl">
        {/* Left Panel */}
        <div className="flex flex-1 flex-col justify-between p-12 text-white">
          <div>
            <h1 className="mb-4 text-5xl leading-tight font-bold">
              Critical Assets
              <br />
              Threat Platform
            </h1>
            <p className="max-w-md text-xl opacity-90">
              Secure access to your security dashboard and monitoring tools
            </p>
          </div>

          <div>
            <h2 className="mb-2 text-4xl font-semibold">WELCOME BACK!</h2>
            <p className="text-lg opacity-75">Please sign in to continue</p>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <Card className="m-4 h-full w-96 rounded-l-3xl rounded-r-3xl border-0 bg-white">
          <CardContent className="flex h-full flex-col justify-center p-8">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-3xl font-bold text-gray-800">Sign In</h2>
              <p className="text-gray-600">Access your dashboard</p>
            </div>

            <div className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div>
                <Label htmlFor="email" className="font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative mt-2">
                  <User className="absolute top-3 left-3 h-4 w-4 text-orange-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange("email")}
                    disabled={isLoading}
                    className={`h-12 rounded-full border-orange-200 bg-orange-50 pl-10 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 ${
                      fieldErrors.email ? "border-red-500" : ""
                    }`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="password" className="font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative mt-2">
                  <Lock className="absolute top-3 left-3 h-4 w-4 text-orange-500" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange("password")}
                    onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
                    disabled={isLoading}
                    className={`h-12 rounded-full border-orange-200 bg-orange-50 pr-12 pl-10 text-gray-900 placeholder:text-gray-500 focus:border-orange-500 ${
                      fieldErrors.password ? "border-red-500" : ""
                    }`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-orange-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-orange-500" />
                    )}
                  </Button>
                </div>
                {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked: boolean | "indeterminate") =>
                      setRememberMe(checked === true)
                    }
                    disabled={isLoading}
                    className="border-orange-500 data-[state=checked]:bg-orange-500"
                  />
                  <Label
                    htmlFor="remember"
                    className="cursor-pointer text-gray-700"
                  >
                    Remember me
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  onClick={handleForgotPassword}
                  disabled={isLoading}
                  className="h-auto p-0 text-orange-600 hover:text-orange-700"
                >
                  Forgot password?
                </Button>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="h-12 w-full rounded-full bg-orange-500 font-medium text-white hover:bg-orange-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-2 text-xs text-gray-500 uppercase">
                    Or
                  </span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                className="h-12 w-full rounded-full border-orange-200 bg-white text-gray-700 hover:bg-orange-50"
              >
                Sign in with other method
              </Button>

              <div className="pt-4 text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Button
                    type="button"
                    variant="link"
                    disabled={isLoading}
                    className="h-auto p-0 font-medium text-orange-600 hover:text-orange-700"
                  >
                    Sign up
                  </Button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Card>
    </div>
  );
};

export default LoginPage;
