import './App.css'
import { useEffect } from 'react'
import { callAPI } from './api/callAPI';


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
