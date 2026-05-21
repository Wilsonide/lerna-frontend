import { Axios } from "@/lib/axios";
import useAuth from "@/app/hooks/useAuth";

let isRefreshing = false;
let queue: any[] = [];

export default function useAxiosPrivate() {
  const { accessToken, refreshUser } = useAuth();

  Axios.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  Axios.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        if (isRefreshing) {
          return new Promise((resolve) => {
            queue.push((token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(Axios(originalRequest));
            });
          });
        }

        isRefreshing = true;

        const newToken = await refreshUser();

        isRefreshing = false;

        queue.forEach((cb) => cb(newToken));
        queue = [];

        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return Axios(originalRequest);
      }

      return Promise.reject(error);
    },
  );

  return Axios;
}
