import { useDispatch } from "react-redux";
import { api } from "../services/api";
import { setAccessToken } from "../features/auth/authSlice";

const useRefreshToken = () => {
  const dispatch = useDispatch();
  const refresh = async () => {
    try {
      const response = await api.get("/refresh", {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      dispatch(setAccessToken({ accessToken: response.data.accessToken }));
      return response.data.accessToken;
    } catch (err) {
      console.log(err);
    }
  };
  return refresh;
};

export default useRefreshToken;
