import { TOKEN_KEY, USER_KEY } from "@/constants/keys";
import { Routes } from "@/constants/routes";
import { UserResponse } from "@/types/auth";
import { useLocalStorage } from "@mantine/hooks";
import axios from "axios";

export const useAuth = () => {
  const [token, setToken] = useLocalStorage<string>({
    key: TOKEN_KEY,
    defaultValue: "",
  });

  const [user, setUser] = useLocalStorage<UserResponse | null>({
    key: USER_KEY,
    defaultValue: null,
  });

  const login = async (citizenId: string, password: string) => {
    const res = await axios.post(Routes.loginApi, { citizenId, password });
    if (res.status === 200) {
      setToken(res.data.token);
      setUser(res.data.user);
    }
    return res;
  };

  const register = async (citizenId: string, password: string) => {
    const res = await axios.post(Routes.registerApi, { citizenId, password });
    if (res.status === 200) {
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
