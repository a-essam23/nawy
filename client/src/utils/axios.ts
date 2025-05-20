import axios, { AxiosError, AxiosRequestConfig } from "axios";

export interface IErrorResponse {
  statusCode: number;
  timestamp: string;
  path?: string;
  message: string;

  details?: string;
}

export type ApiResponse<T> = {
  data: T | null;
  error: IErrorResponse | null;
};

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3100/",
  withCredentials: true,
});
// eslint-disable-next-line
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
          details: JSON.stringify(axiosError.response.data),
          timestamp: new Date().toISOString(),
          path: config.url,
          statusCode: axiosError.response.status,
        },
      };
    }
    if (axiosError.request) {
      return {
        data: null,
        error: {
          message: "Network error - no response received",
          timestamp: new Date().toISOString(),
          path: config.url,
          statusCode: 500,
        },
      };
    }
    return {
      data: null,
      error: {
        message: axiosError.message,
        timestamp: new Date().toISOString(),
        path: config.url,
        // eslint-disable-next-line
        statusCode: axiosError.status || 500,
      },
    };
  }
};
export default apiRequest;
