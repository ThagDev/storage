"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/lib/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/lib/toast";
import { Camera, Save, User, Mail } from "lucide-react";
import { DriveHeader } from "@/components/drive/drive-header";

// Thêm các trường mới cho UserProfile để đồng bộ với API mới
interface UserProfile {
  email: string;
  avatar?: string;
  roles?: string[];
  username?: string;
  phonenumber?: string;
  address?: string;
  gender?: string;
  birthday?: string;
}

export default function ProfilePage() {
  const { userEmail, accessToken } = useAuth();
  const toast = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phonenumber: "",
    address: "",
    gender: "",
    birthday: "",
  });

  // Sử dụng API mới để lấy profile
  const loadProfile = useCallback(async () => {
    if (!accessToken) return;
    try {
      const response = await fetch(
        "https://hoquocthang.vercel.app/profile/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.ok) {
        const { data } = await response.json();
        setProfile(data);
        setFormData({
          username: data.username || "",
          phonenumber: data.phonenumber || "",
          address: data.address || "",
          gender: data.gender || "",
          birthday: data.birthday || "",
        });
        // Đồng bộ avatar cho drive-header
        if (data.avatar) {
          sessionStorage.setItem("profilePicture", data.avatar);
          window.dispatchEvent(new Event("profilePictureUpdated"));
        } else {
          sessionStorage.removeItem("profilePicture");
        }
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      toast({
        message: "There was an error loading your profile information.",
        type: "error",
      });
    }
  }, [accessToken, toast]);

  useEffect(() => {
    if (accessToken && typeof window !== "undefined") {
      loadProfile();
    }
  }, [accessToken, loadProfile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Sửa lại hàm handleSaveProfile để dùng API mới
  const handleSaveProfile = async () => {
    if (!accessToken) return;
    setIsSaving(true);
    try {
      const response = await fetch(
        "https://hoquocthang.vercel.app/profile/me",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            username: formData.username,
            phonenumber: formData.phonenumber,
            address: formData.address,
            gender: formData.gender,
            birthday: formData.birthday,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      toast({
        message: "Your profile has been updated successfully.",
        type: "success",
      });
      setIsEditing(false);
      loadProfile();
    } catch (err) {
      console.error("Error updating profile:", err);
      toast({
        message: "There was an error updating your profile.",
        type: "error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfilePictureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !userEmail) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        message: "Please select an image file.",
        type: "error",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        message: "Please select an image smaller than 5MB.",
        type: "error",
      });
      return;
    }

    setIsUploadingPicture(true);

    try {
      const formDataData = new FormData();
      formDataData.append("file", file);
      // Chỉ thêm Authorization nếu có accessToken
      const headers: Record<string, string> = { Accept: "application/json" };
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

      const response = await fetch(
        "https://hoquocthang.vercel.app/profile/avatar",
        {
          method: "POST",
          body: formDataData,
          headers,
        }
      );

      if (response.status !== 201) {
        const errorText = await response.text();
        console.error("Upload failed:", response.status, errorText);
        throw new Error("Failed to upload profile picture");
      }

      const result = await response.json();
      setProfile((prev) => (prev ? { ...prev, avatar: result.url } : null));
      sessionStorage.setItem("profilePicture", result.url);
      window.dispatchEvent(new Event("profilePictureUpdated"));
      // Gọi lại loadProfile để đồng bộ với backend nếu có
      loadProfile();

      toast({
        message: "Your profile picture has been updated successfully.",
        type: "success",
      });
    } catch (err) {
      console.error("Error uploading profile picture:", err);
      toast({
        message: "There was an error uploading your profile picture.",
        type: "error",
      });
    } finally {
      setIsUploadingPicture(false);
    }
  };

  // Sửa lại cancelEdit cho đúng field
  const cancelEdit = () => {
    setIsEditing(false);
    setFormData({
      username: profile?.username || "",
      phonenumber: profile?.phonenumber || "",
      address: profile?.address || "",
      gender: profile?.gender || "",
      birthday: profile?.birthday || "",
    });
  };

  // Don't render during SSR
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  if (!isClient) {
    return null;
  }

  // Giữ lại loading UI chỉ khi profile chưa load xong
  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <DriveHeader />
      <main className="flex-1 container px-8 py-8">
        <div className="space-y-6 ">
          <div className="grid gap-6 md:grid-cols-3">
            {/* Profile Picture Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Picture</CardTitle>
                <CardDescription>Update your profile picture</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    className="object-cover"
                    src={profile.avatar || "/placeholder.svg"}
                    alt={profile.username || profile.email}
                  />
                  <AvatarFallback className="text-lg">
                    {(profile.username || profile.email || "U")
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                    id="profile-picture-upload"
                    disabled={isUploadingPicture}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("profile-picture-upload")?.click()
                    }
                    disabled={isUploadingPicture}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    {isUploadingPicture ? "Uploading..." : "Change Picture"}
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    JPG, PNG or GIF. Max size 5MB.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Profile Information Section */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Name</Label>
                    {isEditing ? (
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) =>
                          handleInputChange("username", e.target.value)
                        }
                        placeholder="Enter your name"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 border rounded-md bg-muted/50">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{profile.username}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center space-x-2 p-2 border rounded-md bg-muted/50">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.email}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phonenumber">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phonenumber"
                        value={formData.phonenumber}
                        onChange={(e) =>
                          handleInputChange("phonenumber", e.target.value)
                        }
                        placeholder="Enter your phone number"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 border rounded-md bg-muted/50">
                        <span>{profile.phonenumber || "-"}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder="Enter your address"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 border rounded-md bg-muted/50">
                        <span>{profile.address || "-"}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="gender">Gender</Label>
                    {isEditing ? (
                      <Input
                        id="gender"
                        value={formData.gender}
                        onChange={(e) =>
                          handleInputChange("gender", e.target.value)
                        }
                        placeholder="male/female/other"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 border rounded-md bg-muted/50">
                        <span>{profile.gender || "-"}</span>
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="birthday">Birthday</Label>
                    {isEditing ? (
                      <Input
                        id="birthday"
                        value={formData.birthday}
                        onChange={(e) =>
                          handleInputChange("birthday", e.target.value)
                        }
                        placeholder="YYYY-MM-DD"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2 border rounded-md bg-muted/50">
                        <span>{profile.birthday || "-"}</span>
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="flex items-center space-x-2 pt-4">
                    <Button onClick={handleSaveProfile} disabled={isSaving}>
                      <Save className="mr-2 h-4 w-4" />
                      {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={cancelEdit}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Account Statistics */}
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
