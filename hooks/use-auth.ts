import { TOKEN_KEY, USER_KEY } from "@/constants/keys";
import { Routes } from "@/constants/routes";
import { axiosInstance } from "@/lib/axios-instance";
import { LoginSchema } from "@/schemas/login";
import { RegisterSchema } from "@/schemas/register";
import { AuthResponse, UserResponse } from "@/types/auth";
import { useLocalStorage } from "@mantine/hooks";

export const useAuth = () => {
  const [token, setToken] = useLocalStorage<string>({
    key: TOKEN_KEY,
    defaultValue: "",
  });

  const [user, setUser] = useLocalStorage<UserResponse | null>({
    key: USER_KEY,
    defaultValue: null,
    serialize: (value) => JSON.stringify(value),
    deserialize: (value) => JSON.parse(value),
  });

  const login = async (body: LoginSchema) => {
    const res = await axiosInstance.post<AuthResponse>(Routes.loginApi, body);
    if (res.data.success) {
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res;
  };

  const register = async (body: RegisterSchema) => {
    const res = await axiosInstance.post(Routes.registerApi, body);
    if (res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res;
  };

  const logout = () => {
    setToken("");
    setUser(null);
  };

  return { token, user, login, register, logout };
};
