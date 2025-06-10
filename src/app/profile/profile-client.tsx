"use client";
import { useState, useRef, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import dynamic from "next/dynamic";
import { User } from "lucide-react";
import { apiAuth } from "@/lib/axios-instance";
import NextImage from "@/components/ui/next-image";

const DriveHeader = dynamic(() => import("@/components/drive/drive-header").then(mod => mod.DriveHeader), { ssr: false });

export interface UserProfile {
  email: string;
  avatar?: string;
  roles?: string[];
  username?: string;
  phonenumber?: string;
  address?: string;
  gender?: string;
  birthday?: string;
}

export default function ProfileClient({ initialProfile }: { initialProfile: UserProfile }) {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    username: profile.username || "",
    phonenumber: profile.phonenumber || "",
    address: profile.address || "",
    gender: profile.gender || "",
    birthday: profile.birthday || "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setAvatarFile(file);
  }

  async function handleAvatarUpload() {
    if (!avatarFile) return;
    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", avatarFile); // Đúng tên trường backend
      const res = await apiAuth.post("/profile/avatar", formData, {
        headers: {
          // Không set Content-Type, axios sẽ tự động set cho FormData
        },
      });
      const data = res.data;
      if ((res.status === 201 || res.status === 200) && (data?.url)) {
        // Lấy url avatar mới (tùy backend trả về url hay data.avatar)
        const newAvatar = data?.url
        setProfile((p) => ({ ...p, avatar: newAvatar }));
        // Cập nhật sessionStorage và phát sự kiện cho header
        if (typeof window !== "undefined") {
          sessionStorage.setItem("profilePicture", newAvatar);
          window.dispatchEvent(new Event("profilePictureUpdated"));
        }
        showToast({ message: "Avatar updated!", type: "success" });
        setAvatarFile(null);
      } else {
        showToast({ message: data?.message || "Failed to update avatar", type: "error" });
      }
    } catch {
      showToast({ message: "Error uploading avatar", type: "error" });
    } finally {
      setAvatarUploading(false);
    }
  }

  function handleSaveProfile() {
    startTransition(async () => {
      try {
        const res = await apiAuth.put("/profile/me", form);
        const data = res.data;
        if ((res.status === 200 || res.status === 201) && data?.data) {
          setProfile((p) => ({ ...p, ...form }));
          setEditing(false);
          showToast({ message: "Profile updated!", type: "success" });
        } else {
          showToast({ message: data?.message || "Failed to update profile", type: "error" });
        }
      } catch {
        showToast({ message: "Error updating profile", type: "error" });
      }
    });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DriveHeader />
      <main className="flex-1 container px-8 py-8">
        <div className="space-y-6 ">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Update your avatar</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24">
                    {profile.avatar ? (
                      <NextImage
                        src={profile.avatar}
                        alt="Avatar"
                        width={96}
                        height={96}
                        className="object-cover rounded-full h-24 w-24"
                        priority
                        unoptimized={true}
                      />
                    ) : (
                      <AvatarFallback>
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="text-center">
                    <div className="font-semibold">{profile.email}</div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarUploading}
                  >
                    {avatarUploading ? "Uploading..." : "Change Avatar"}
                  </Button>
                  {avatarFile && (
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-xs text-muted-foreground">{avatarFile.name}</div>
                      <Button
                        size="sm"
                        onClick={handleAvatarUpload}
                        disabled={avatarUploading}
                      >
                        {avatarUploading ? "Uploading..." : "Upload Avatar"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>View and edit your account details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Username</Label>
                    <Input
                      name="username"
                      value={form.username}
                      onChange={handleChange}
                      readOnly={!editing}
                    />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      name="phonenumber"
                      value={form.phonenumber}
                      onChange={handleChange}
                      readOnly={!editing}
                    />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      readOnly={!editing}
                    />
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Input
                      name="gender"
                      value={form.gender}
                      onChange={handleChange}
                      readOnly={!editing}
                    />
                  </div>
                  <div>
                    <Label>Birthday</Label>
                    <Input
                      name="birthday"
                      value={form.birthday}
                      onChange={handleChange}
                      readOnly={!editing}
                    />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  {editing ? (
                    <>
                      <Button onClick={handleSaveProfile} disabled={pending}>
                        {pending ? "Saving..." : "Save"}
                      </Button>
                      <Button variant="outline" onClick={() => {
                        setEditing(false);
                        setForm({
                          username: profile.username || "",
                          phonenumber: profile.phonenumber || "",
                          address: profile.address || "",
                          gender: profile.gender || "",
                          birthday: profile.birthday || "",
                        });
                      }}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setEditing(true)}>
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Statistics</CardTitle>
              <CardDescription>
                Overview of your account activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">
                    Files Uploaded
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">0</div>
                  <div className="text-sm text-muted-foreground">
                    Folders Created
                  </div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-primary">0 MB</div>
                  <div className="text-sm text-muted-foreground">
                    Storage Used
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
