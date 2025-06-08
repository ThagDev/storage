import axios from "axios";
import Cookies from "js-cookie";

// Axios instance cho API cần Bearer token
export const apiAuth = axios.create({
  baseURL: "https://hoquocthang.vercel.app/mutiple-auth/",
});

// Axios instance cho API không cần Bearer token
export const apiNoAuth = axios.create({
  baseURL: "https://hoquocthang.vercel.app/mutiple-auth/",
});

// Interceptor cho apiAuth: tự động gắn Bearer token và tự refresh nếu hết hạn
apiAuth.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

apiAuth.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Nếu lỗi 401 và chưa thử refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Gọi API refresh token
        const refreshRes = await apiNoAuth.post("refresh");
        const newToken = refreshRes.data?.accessToken;
        if (newToken) {
          Cookies.set("accessToken", newToken, { expires: 7, sameSite: "lax" });
          // Gắn lại token mới và retry request cũ
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return apiAuth(originalRequest);
        }
      } catch (refreshError) {
        // Nếu refresh cũng fail thì xóa token và logout
        Cookies.remove("accessToken");
        sessionStorage.clear();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
