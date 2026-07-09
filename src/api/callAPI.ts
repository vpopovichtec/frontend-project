const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
  
export const callAPI = async <T,>(endpoint: string): Promise<T> => {
    try {
        const options = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${TMDB_TOKEN}`,
                accept: "application/json"
            }
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, options);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return(data.results) as T;
    } catch (error) {
        console.error(error);
        throw error;
    }
}