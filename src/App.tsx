import './App.css'
import { useEffect } from 'react'

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;


function App() {
  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const options = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TMDB_TOKEN}`,
            accept: "application/json"
          }
        }

        const response = await fetch(`${BASE_URL}/movie/popular`, options);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
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
