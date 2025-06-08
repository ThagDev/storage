import { FileGrid } from "@/components/drive/file-grid";
import { FileToolbar } from "@/components/drive/file-toolbar";
import { getFiles } from "@/lib/file-service";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

export default async function FolderPage({
  params,
}: {
  params: Promise<{ path: string[] }>;
}) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken");
  if (!accessToken) {
    redirect("/login");
  }

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
