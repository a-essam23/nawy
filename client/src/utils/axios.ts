import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { IErrorResponse } from "@server";

export type ApiResponse<T> = {
  data: T | null;
  error: IErrorResponse | null;
};

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3100/",
  withCredentials: true,
});

const apiRequest = async <T = any>(
  config: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response = await axiosInstance.request<T>({
      ...config,
      headers: {
        ...config.headers,
      },
    });
    return { data: response.data, error: null };
  } catch (error) {
    const axiosError = error as AxiosError<IErrorResponse>;
    if (axiosError.response) {
      return {
        data: null,
        error: {
          message: axiosError.response?.data?.message || axiosError.message,
          details: axiosError.response.data,
        },
      };
    }
    if (axiosError.request) {
      return {
        data: null,
        error: { message: "Network error - no response received" },
      };
    }
    return { data: null, error: { message: axiosError.message } };
  }
};
export default apiRequest;
