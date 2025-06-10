"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

export function VerificationForm({ email }: { email: string }) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Lấy email từ sessionStorage nếu không truyền qua props
  useEffect(() => {
    if (!email) {
      sessionStorage.getItem("login_email");
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true); // Đảm bảo setIsLoading(true) ngay khi bắt đầu submit
    try {
      // Validate code format
      if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
        throw new Error("Please enter a valid 6-digit code");
      }

      const submitEmail = email || sessionStorage.getItem("login_email") || "";
      if (!submitEmail) throw new Error("Missing email. Please login again.");

      // Gọi API xác thực code
      const res = await axios.post(
        "https://hoquocthang.vercel.app/mutiple-auth/verify-code",
        {
          email: submitEmail,
          code,
        }
      );

      if (res.status !== 201) {
        throw new Error(res.data?.message || "Verification failed.");
      }

      // Lưu accessToken và các thông tin khác nếu cần
      const {
        accessToken,
        email: userEmail,
        roles,
        verified,
        avatar,
      } = res.data.data;
      console.log(res.data.data);

      Cookies.set("accessToken", accessToken, { expires: 7, sameSite: "lax" });
      sessionStorage.setItem("userEmail", userEmail);
      sessionStorage.setItem("profilePicture", avatar || "");
      sessionStorage.setItem("roles", JSON.stringify(roles));
      sessionStorage.setItem("verified", JSON.stringify(verified));
      // if (avatar) {
      //   sessionStorage.setItem("profilePicture", avatar);
      //   window.dispatchEvent(new Event("profilePictureUpdated"));
      // } else {
      //   sessionStorage.removeItem("profilePicture");
      // }
      setSuccess("Verification successful! Redirecting to drive...");
      setShowOverlay(true);
      setIsLoading(false);
      router.push("/drive");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          typeof err.response?.data?.message === "string"
            ? err.response.data.message
            : err.message
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
      setIsLoading(false); // Đảm bảo luôn set lại isLoading về false khi có lỗi
    }
  };

  return (
    <>
      {showOverlay && <LoadingOverlay />}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="code" className="text-sm font-medium">
              Verification Code
            </label>
          </div>
          <Input
            ref={inputRef}
            id="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.slice(0, 6))}
            className="text-center text-lg tracking-widest"
            required
            disabled={isLoading}
          />
          <p className="text-xs text-gray-500">
            Enter the 6-digit code sent to your email
          </p>
        </div>

        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
        {success && (
          <p className="text-sm font-medium text-green-600">{success}</p>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify and Sign In"
          )}
        </Button>

        <div className="text-center">
          <Link
            href="/login"
            className="inline-flex items-center text-sm text-primary hover:underline"
          >
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back to login
          </Link>
        </div>
      </form>
    </>
  );
}
