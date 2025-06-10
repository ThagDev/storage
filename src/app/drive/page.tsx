import { getValidAccessTokenServerSide } from "@/lib/server-auth";
import { FileGrid } from "@/components/drive/file-grid";
import { FileToolbar } from "@/components/drive/file-toolbar";
import { getDriveContents } from "@/lib/file-service";

export default async function DrivePage() {
  // Lấy accessToken hợp lệ, tự động refresh nếu hết hạn
  const tokenResult = await getValidAccessTokenServerSide();
  const accessToken =
    typeof tokenResult === "string" ? tokenResult : tokenResult.accessToken;

  // Lấy contents cho My Drive (root)
  let res;
  try {
    res = await getDriveContents({
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  } catch (err) {
    // Check for AxiosError 401
    if (
      typeof err === "object" &&
      err !== null &&
      "response" in err &&
      typeof (err as { response?: { status?: number } }).response === "object" &&
      (err as { response?: { status?: number } }).response?.status === 401
    ) {
      // Đã xử lý redirect trong getValidAccessTokenServerSide
    }
    throw err;
  }
  const folders = res?.data?.folders || [];
  const files = res?.data?.files || [];

  // Gộp folders và files thành 1 mảng để truyền cho FileGrid
  const items = [
    ...folders.map((f: Record<string, unknown>) => ({
      id: f._id as string,
      name: f.name as string,
      type: "folder",
      path: f.parent ? String(f.parent) : "",
      size: 0,
      createdAt: f.createdAt as string,
      modifiedAt: f.updatedAt as string,
      isDeleted: Boolean(f.isDeleted),
      deletedAt: f.deletedAt ? String(f.deletedAt) : null,
      userId: f.userId ? String(f.userId) : undefined,
    })),
    ...files.map((f: Record<string, unknown>) => {
      // Nếu url là localhost thì chuyển sang domain production
      let url = f.url ? String(f.url) : undefined;
      if (url && url.startsWith("http://localhost:8888/")) {
        url = url.replace(
          "http://localhost:8888/",
          "https://hoquocthang.vercel.app/"
        );
      }
      return {
        id: f._id as string,
        name: f.name as string,
        type: "file",
        path: f.parent ? String(f.parent) : "",
        size: typeof f.size === "number" ? f.size : 0,
        createdAt: f.createdAt as string,
        modifiedAt: f.updatedAt as string,
        mimeType: f.mimeType ? String(f.mimeType) : undefined,
        url,
        isDeleted: Boolean(f.isDeleted),
        deletedAt: f.deletedAt ? String(f.deletedAt) : null,
        userId: f.userId ? String(f.userId) : undefined,
      };
    }),
  ];

  return (
    <div className="space-y-4">
      <FileToolbar currentPath="/" />
      <FileGrid files={items} />
    </div>
  );
}
