import { FileGrid } from "@/components/drive/file-grid";
import { FileToolbar } from "@/components/drive/file-toolbar";
import { getFiles } from "@/lib/file-service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DrivePage() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  if (!accessToken) {
    redirect("/login");
  }

  // Get files for the root directory
  const files = getFiles("/");

  if (!files) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <FileToolbar currentPath="/" />
      <FileGrid files={files} />
    </div>
  );
}
