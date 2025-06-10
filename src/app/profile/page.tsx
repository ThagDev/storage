import { getValidAccessTokenServerSide } from "@/lib/server-auth";
import type React from "react";
import { apiAuth } from "@/lib/axios-instance";
import type { UserProfile } from "./profile-client";
import ProfileClient from "./profile-client";

export default async function ProfilePage() {
  // Lấy accessToken hợp lệ, tự động refresh nếu hết hạn
  const tokenResult = await getValidAccessTokenServerSide();
  const accessToken = typeof tokenResult === "string" ? tokenResult : tokenResult.accessToken;

  let profile: UserProfile | null = null;
  try {
    const res = await apiAuth.get("/profile/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    profile = res.data?.data || null;
  } catch {
    profile = null;
  }
  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  return <ProfileClient initialProfile={profile} />;
}
