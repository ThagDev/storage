import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Lấy accessToken hợp lệ ở server, tự động refresh nếu hết hạn.
 * Nếu không thể refresh, sẽ xóa cookie và redirect về /login.
 * @returns accessToken string hoặc { accessToken, refreshToken }
 */
export async function getValidAccessTokenServerSide() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  // Nếu có accessToken, thử gọi API xác thực (ví dụ /profile/me)
  if (accessToken) {
    try {
      await axios.get("https://hoquocthang.vercel.app/profile/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return accessToken;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status !== 401) throw err;
      // Nếu 401 thì thử refresh
    }
  }

  // Nếu không có accessToken hoặc bị 401, thử refreshToken
  if (refreshToken) {
    try {
      const res = await axios.post(
        "https://hoquocthang.vercel.app/mutiple-auth/refresh",
        {},
        {
          headers: { Authorization: `Bearer ${refreshToken}` },
        }
      );
      const newAccessToken = res.data?.data?.accessToken;
      const newRefreshToken = res.data?.data?.refreshToken;
      if (newAccessToken) {
        // Trả về token mới để page.tsx set lại cookie qua action hoặc response
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
      }
    } catch {
      // refreshToken hết hạn hoặc lỗi
    }
  }

  // Xóa cookie và redirect về /login
  redirect("/login");
}
