import { notFound } from "next/navigation";
import { FileGrid } from "@/components/drive/file-grid";
import { FileToolbar } from "@/components/drive/file-toolbar";
import { getFiles } from "@/lib/file-service";
import { getValidAccessTokenServerSide } from "@/lib/server-auth";

export default async function FolderPage({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  // Lấy accessToken hợp lệ, tự động refresh nếu hết hạn
  await getValidAccessTokenServerSide();
  const resolvedParams = await params;
  // Construct the path from the URL segments
  const path = `/${resolvedParams.path.join("/")}`;

  try {
    // Get files for this directory
    const files = getFiles(path);

    if (!files) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <p>Loading...</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <FileToolbar currentPath={path} />
        <FileGrid files={files} />
      </div>
    );
  } catch {
    // If the folder doesn't exist, show a 404 page
    notFound();
  }
}
