import { FileGrid } from "@/components/drive/file-grid";
import { FileToolbar } from "@/components/drive/file-toolbar";
import { getSharedFiles } from "@/lib/file-service";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function SharedPage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  if (!accessToken) {
    redirect("/login");
  }

  // Get shared files
  const files = getSharedFiles();

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
      <FileToolbar currentPath="/shared" isSharedView />
      <FileGrid files={files} />
    </div>
  );
}
