"use client";

import { VerificationForm } from "./verification-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

export default function VerifyPage() {
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("login_email") || "";
    setEmail(storedEmail);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Verify your email
          </CardTitle>
          <CardDescription>
            {email
              ? `We've sent a 6-digit code to ${email}`
              : "Please login again to receive a code."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VerificationForm email={email} />
        </CardContent>
      </Card>
    </div>
  );
}
