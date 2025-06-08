import { FileGrid } from "@/components/drive/file-grid";
import { FileToolbar } from "@/components/drive/file-toolbar";
import { getTrashFiles } from "@/lib/file-service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function TrashPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  if (!accessToken) {
    redirect("/login");
  }

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
