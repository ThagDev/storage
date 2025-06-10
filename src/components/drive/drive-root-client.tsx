"use client";
import { useEffect, useState } from "react";
import { getDriveContents } from "@/lib/file-service";
import { FileGrid } from "./file-grid";
import { FileToolbar } from "./file-toolbar";
import Cookies from "js-cookie";

interface DriveFileOrFolder {
  id: string;
  name: string;
  type: "file" | "folder";
  path: string;
  size: number;
  createdAt: string;
  modifiedAt: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
  userId?: string;
  mimeType?: string;
  url?: string;
}

export default function DriveRootClient() {
  const [items, setItems] = useState<DriveFileOrFolder[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchDrive() {
    setLoading(true);
    try {
      const token = Cookies.get("accessToken");
      const res = await getDriveContents({
        headers: { Authorization: `Bearer ${token}` },
      });
      const folders = res?.data?.folders || [];
      const files = res?.data?.files || [];
      setItems([
        ...folders.map((f: Record<string, unknown>) => ({
          id: String(f._id),
          name: String(f.name),
          type: "folder",
          path: f.parent ? String(f.parent) : "",
          size: 0,
          createdAt: String(f.createdAt),
          modifiedAt: String(f.updatedAt),
          isDeleted: Boolean(f.isDeleted),
          deletedAt: f.deletedAt ? String(f.deletedAt) : null,
          userId: f.userId ? String(f.userId) : undefined,
        })),
        ...files.map((f: Record<string, unknown>) => ({
          id: String(f._id),
          name: String(f.name),
          type: "file",
          path: f.parent ? String(f.parent) : "",
          size: typeof f.size === "number" ? f.size : 0,
          createdAt: String(f.createdAt),
          modifiedAt: String(f.updatedAt),
          mimeType: f.mimeType ? String(f.mimeType) : undefined,
          url: f.url ? String(f.url) : undefined,
          isDeleted: Boolean(f.isDeleted),
          deletedAt: f.deletedAt ? String(f.deletedAt) : null,
          userId: f.userId ? String(f.userId) : undefined,
        })),
      ]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDrive();
    const handler = () => fetchDrive();
    window.addEventListener("driveRefresh", handler);
    return () => window.removeEventListener("driveRefresh", handler);
  }, []);

  return (
    <div className="space-y-4">
      <FileToolbar currentPath="/" />
      {loading ? (
        <div className="p-8 text-center text-gray-500">Loading...</div>
      ) : (
        <FileGrid files={items} />
      )}
    </div>
  );
}
