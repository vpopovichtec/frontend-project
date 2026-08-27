import { buildApiUrl } from "@/helpers/buildApiUrl";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

export const callAPI = async <T>(
  endpoints: string[],
  signal?: AbortSignal,
): Promise<T> => {
  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      accept: "application/json",
    },
    signal,
  };

  const response = await fetch(buildApiUrl(...endpoints), options);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  return data as T;
};
