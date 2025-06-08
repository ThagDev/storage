import { FileGrid } from "@/components/drive/file-grid";
import { FileToolbar } from "@/components/drive/file-toolbar";
import { getStarredFiles } from "@/lib/file-service";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function StarredPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  if (!accessToken) {
    redirect("/login");
  }

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
