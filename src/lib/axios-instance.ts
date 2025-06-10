import axios from "axios";
import Cookies from "js-cookie";
import { showToast } from "@/lib/toast";

// Axios instance cho API cần Bearer token
export const apiAuth = axios.create({
  baseURL: "https://hoquocthang.vercel.app",
});

// Axios instance cho API không cần Bearer token
export const apiNoAuth = axios.create({
  baseURL: "https://hoquocthang.vercel.app",
});

// Interceptor cho apiAuth: tự động gắn Bearer token và tự refresh nếu hết hạn
apiAuth.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = Cookies.get("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
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
        // Gọi API logout để backend xóa luôn cookie/token phía server
        await apiNoAuth.post("/mutiple-auth/logout");
        Cookies.remove("accessToken", { path: "/" });
        Cookies.remove("accessToken");
        sessionStorage.clear();
        showToast({
          message: "Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.",
          type: "error",
          duration: 3000,
        });
        setTimeout(() => {
          window.location.replace("/login");
        }, 1200);
        return Promise.reject(error);
      } catch (refreshError) {
        Cookies.remove("accessToken", { path: "/" });
        Cookies.remove("accessToken");
        sessionStorage.clear();
        showToast({
          message: "Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.",
          type: "error",
          duration: 3000,
        });
        setTimeout(() => {
          window.location.replace("/login");
        }, 1200);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
