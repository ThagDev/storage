import { getValidAccessTokenServerSide } from "@/lib/server-auth";
import { FileGrid } from "@/components/drive/file-grid";
import { FileToolbar } from "@/components/drive/file-toolbar";
import { getStarredFiles } from "@/lib/file-service";
import { notFound } from "next/navigation";

export default async function StarredPage() {
  // Lấy accessToken hợp lệ, tự động refresh nếu hết hạn
  await getValidAccessTokenServerSide();

  // Get starred files
  const files = getStarredFiles();

  if (!files) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!files.length) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <FileToolbar currentPath="/starred" isStarredView />
      <FileGrid files={files} />
    </div>
  );
}
