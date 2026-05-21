import { useEffect } from "react";

import { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

import { Axios } from "@/lib/axios";
import useAuth from "@/app/hooks/useAuth";

let isRefreshing = false;

let queue: ((token: string) => void)[] = [];

export default function useAxiosPrivate() {
  const { accessToken, refreshUser } = useAuth();

  useEffect(() => {
    // ======================
    // REQUEST INTERCEPTOR
    // ======================
    const requestInterceptor = Axios.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (!config.headers) {
          config.headers = new AxiosHeaders();
        }

        if (accessToken) {
          config.headers.set("Authorization", `Bearer ${accessToken}`);
        }

        return config;
      },
    );

    // ======================
    // RESPONSE INTERCEPTOR
    // ======================
    const responseInterceptor = Axios.interceptors.response.use(
      (response) => response,

      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          // ======================
          // WAIT IF REFRESHING
          // ======================
          if (isRefreshing) {
            return new Promise((resolve) => {
              queue.push((token: string) => {
                if (!originalRequest.headers) {
                  originalRequest.headers = new AxiosHeaders();
                }

                originalRequest.headers.set("Authorization", `Bearer ${token}`);

                resolve(Axios(originalRequest));
              });
            });
          }

          isRefreshing = true;

          try {
            // ======================
            // REFRESH TOKEN
            // ======================
            const newToken = await refreshUser();

            if (!newToken) {
              return Promise.reject(error);
            }

            // ======================
            // RELEASE QUEUE
            // ======================
            queue.forEach((cb) => cb(newToken));

            queue = [];

            // ======================
            // RETRY ORIGINAL REQUEST
            // ======================
            if (!originalRequest.headers) {
              originalRequest.headers = new AxiosHeaders();
            }

            originalRequest.headers.set("Authorization", `Bearer ${newToken}`);

            return Axios(originalRequest);
          } catch (err) {
            queue = [];

            return Promise.reject(err);
          } finally {
            isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      Axios.interceptors.request.eject(requestInterceptor);

      Axios.interceptors.response.eject(responseInterceptor);
    };
  }, [accessToken, refreshUser]);

  return Axios;
}
