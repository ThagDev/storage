"use client";
import { useCallback } from "react";

export type ToastType = "success" | "error" | "info";

export interface ToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

export function showToast({
  message,
  type = "info",
  duration = 3000,
}: ToastOptions) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.className = `fixed z-[9999] left-1/2 top-6 -translate-x-1/2 px-4 py-2 rounded shadow-lg text-white text-sm font-medium transition-all duration-300 pointer-events-none toast-${type}`;
  toast.style.background =
    type === "success" ? "#22c55e" : type === "error" ? "#ef4444" : "#2563eb";
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => document.body.removeChild(toast), 300);
  }, duration);
}

export function useToast() {
  return useCallback(showToast, []);
}
