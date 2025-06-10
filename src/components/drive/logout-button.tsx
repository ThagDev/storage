"use client";
import { apiAuth } from "@/lib/axios-instance";
import { useAuth } from "@/lib/use-auth";
import { useToast } from "@/lib/toast";

export default function LogoutButton() {
  const { logout } = useAuth();
  const toast = useToast();

  const handleLogout = async () => {
    try {
      await apiAuth.post("/mutiple-auth/logout");
      logout();
      toast({ message: "Logged out successfully!", type: "success" });
    } catch {
      toast({ message: "Logout failed. Please try again.", type: "error" });
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full text-left px-2 py-1 hover:bg-gray-100"
    >
      Sign out
    </button>
  );
}
