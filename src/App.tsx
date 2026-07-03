import './App.css'
import { useEffect } from 'react'

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;


function App() {

  type Movie = {
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    release_date: string;
    softcore: boolean;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  }

  const callAPI = async <T,>(endpoint: string): Promise<T> => {
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

  useEffect(() => {
    const fetchPopularMovies = async () => {
      const popularMovies = await callAPI<Movie>("/movie/popular");

      console.log(popularMovies)
    }
    
    fetchPopularMovies();
  }, [])

  return (
    <div>
        Hello
    </div>
  )
}

export default App
