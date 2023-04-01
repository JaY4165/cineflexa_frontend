import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const client = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

const TMDB_TOKEN: string = import.meta.env.VITE_APP_TOKEN;

export const request = async ({
  ...options
}: AxiosRequestConfig): Promise<AxiosResponse> => {
  client.defaults.headers.common.Authorization = `Bearer ${TMDB_TOKEN}`;
  console.log("working");

  try {
    const response = await client(options);
    return response;
  } catch (error) {
    console.error("Request Failed:");
    throw error;
  }
};
