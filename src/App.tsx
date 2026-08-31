import "./App.css";

import { Badge } from "@/components/ui/badge";
import filmReel from "@/assets/film-reel-96.png";
import { HomePage } from "./pages/HomePage";
import { MovieDetailsPage } from "./pages/MovieDetailsPage";
import { Routes, Route } from "react-router";

function App() {
  return (
    <div>
      <div className="p-4 mt-2 flex flex-col items-center gap-4">
        <Badge variant="outline" className="p-6 text-1xl sm:text-2xl">
          <img
            src={filmReel}
            alt="film reel"
            className="w-5 h-5 sm:w-8 sm:h-8"
          />
          TMDB Movie Explorer
        </Badge>
      </div>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetailsPage />} />
      </Routes>
    </div>
  );
}

export default App;
