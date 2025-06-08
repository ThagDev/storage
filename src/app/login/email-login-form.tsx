"use client";

import { ArrowRight, Loader2 } from "lucide-react";
import { useActionState } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/lib/toast";
import { LoadingOverlay } from "@/components/ui/loading-overlay";

// Server action wrapper for useActionState
async function submitEmail(
  prevState: { error?: string; success?: string; email?: string },
  formData: FormData
): Promise<{ error?: string; success?: string; email?: string }> {
  const email = formData.get("email")?.toString() || "";
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
    return { error: "Please enter a valid email address" };
  }
  try {
    // Gọi API thực tế để gửi email bằng axios
    const res = await axios.post(
      "https://hoquocthang.vercel.app/mutiple-auth/send-email",
      { email }
    );
    if (res.status !== 201) {
      throw new Error(res.data?.message || "Failed to send verification code.");
    }
    return { success: "Verification code sent! Redirecting...", email };
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const apiMessage =
        typeof err.response?.data?.message === "string"
          ? err.response.data.message
          : undefined;
      return { error: apiMessage || err.message };
    }
    if (err instanceof Error) {
      return { error: err.message };
    }
    return { error: "Something went wrong. Please try again." };
  }
}

export function EmailLoginForm() {
  const router = useRouter();
  const [showOverlay, setShowOverlay] = useState(false);
  const [state, formAction, isPending]: [
    { error?: string; success?: string; email?: string },
    (formData: FormData) => void,
    boolean
  ] = useActionState(submitEmail, {});
  const toast = useToast();

  useEffect(() => {
    if (state.error) {
      toast({ message: state.error, type: "error" });
    }
    if (state.success) {
      toast({ message: state.success, type: "success" });
    }
  }, [state.error, state.success, toast]);

  useEffect(() => {
    if (state.success && state.email) {
      sessionStorage.setItem("login_email", state.email);
      setShowOverlay(true); // Hiển thị overlay loading toàn trang khi chuyển hướng
      router.push("/verify");
    }
  }, [state.success, state.email, router]);

  return (
    <>
      {showOverlay && <LoadingOverlay />}
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            required
            disabled={isPending}
          />
        </div>
        {state.error && (
          <p className="text-sm font-medium text-destructive">{state.error}</p>
        )}
        {state.success && (
          <p className="text-sm font-medium text-green-600">{state.success}</p>
        )}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </form>
    </>
  );
}
