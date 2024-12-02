import {
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";
// import { logout } from '@/features/signIn/services/api';
// import useLoggedInStore from '@/store/useLoggedInStore';

export interface ConsoleError {
  status: number;
  data: unknown;
}

// requestInterceptor
export const requestInterceptor = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  // add token
  const token = localStorage.getItem("my_app_logged_in");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

// successInterceptor
export const successInterceptor = (response: AxiosResponse): AxiosResponse => {
  return response;
};

// errorInterceptor

export const errorInterceptor = async (error: AxiosError): Promise<void> => {
  // logout the user
  if (error.response?.status === 401) {
    // useLoggedInStore.getState().setIsLogout();
    console.error("hihi logout");
    await Promise.reject(error);
  } else if (
    error.response?.status === 400 &&
    (error.response?.data as { message?: string })?.message ===
      "userinifo api error: TokenExpiredError: jwt expired"
  ) {
    // await logout();
    // useLoggedInStore.getState().setIsLogout();

    await Promise.reject(error);
  } else {
    if (error.response) {
      const errorMessage: ConsoleError = {
        status: error.response.status,
        data: error.response.data,
      };
      console.error(errorMessage);
    } else if (error.request) {
      console.error(error.request);
    } else {
      console.error("Error", error.message);
    }
    await Promise.reject(error);
  }
};
