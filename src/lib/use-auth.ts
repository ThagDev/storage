import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export function useAuth() {
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [roles, setRoles] = useState<string[]>([]);
  const [verified, setVerified] = useState<boolean | undefined>(undefined);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    setAccessToken(Cookies.get("accessToken") || undefined);
    setUserEmail(sessionStorage.getItem("userEmail") || undefined);
    const rolesStr = sessionStorage.getItem("roles");
    setRoles(rolesStr ? JSON.parse(rolesStr) : []);
    const verifiedStr = sessionStorage.getItem("verified");
    setVerified(verifiedStr ? JSON.parse(verifiedStr) : undefined);
    setIsAuthReady(true);
  }, []);

  const logout = () => {
    // Xóa accessToken ở mọi path, domain (nếu có thể)
    Cookies.remove("accessToken", { path: "/" });
    Cookies.remove("accessToken");
    sessionStorage.clear();
    // Reload để đảm bảo cookie biến mất ở mọi nơi
    window.location.replace("/login");
  };

  return {
    accessToken,
    userEmail,
    roles,
    verified,
    isLoggedIn: !!accessToken,
    isAuthReady,
    logout,
  };
}
