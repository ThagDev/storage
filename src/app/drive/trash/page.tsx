import { getValidAccessTokenServerSide } from "@/lib/server-auth";
import { FileGrid } from "@/components/drive/file-grid";
import { FileToolbar } from "@/components/drive/file-toolbar";
import { getTrashFiles } from "@/lib/file-service";

export default async function TrashPage() {
  // Lấy accessToken hợp lệ, tự động refresh nếu hết hạn
  await getValidAccessTokenServerSide();

  // Get files in trash
  const files = getTrashFiles();

  if (!files) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FileToolbar currentPath="/trash" isTrashView />
      <FileGrid files={files} />
    </div>
  );
}
