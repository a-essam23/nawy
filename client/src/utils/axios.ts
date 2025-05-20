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

const IS_SERVER = typeof window === "undefined";

const clientSideBaseURL =
  process.env.NEXT_PUBLIC_API_URL_CLIENT || "http://localhost:3100";
const serverSideBaseURL = process.env.INTERNAL_API_URL || "http://server:3100";

const baseURL = IS_SERVER ? serverSideBaseURL : clientSideBaseURL;

// THIS CONSOLE LOG IS CRITICAL FOR DEBUGGING IN DOCKER
console.log(`[AXIOS_CONFIG] Running on: ${IS_SERVER ? "SERVER" : "CLIENT"}`);
console.log(`[AXIOS_CONFIG] Determined baseURL: ${baseURL}`);
if (IS_SERVER) {
  console.log(
    `[AXIOS_CONFIG] Server-side check: INTERNAL_API_URL = ${process.env.INTERNAL_API_URL}`
  );
} else {
  console.log(
    `[AXIOS_CONFIG] Client-side check: NEXT_PUBLIC_API_URL_CLIENT = ${process.env.NEXT_PUBLIC_API_URL_CLIENT}`
  );
}

export const axiosInstance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  timeout: IS_SERVER ? 5000 : 10000, // Shorter timeout for internal, longer for client
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
      console.log(axiosError.response.data);
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
      console.log(`Network error - no response received`);
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
