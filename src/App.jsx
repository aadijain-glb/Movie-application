import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import "./App.css";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import Moviecard from "./components/Moviecard";
import VideoPlayer from "./components/VideoPlayer";
import { getTrendingMovies, updateSearchCount } from "./appwrite";

const App = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [moviesList, setMoviesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);

  const API_BASE_URL = "https://api.themoviedb.org/3";
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const API_OPTIONS = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
  };

  useDebounce(() => setDebouncedSearch(search), 500, [search]);

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch {
      setErrorMessage("Error fetching movies");
    }
  };

  const fetchMovies = async (query = "") => {
    setLoading(true);
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) throw new Error();
      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        setErrorMessage("No movies found");
        setMoviesList([]);
        return;
      }
      setMoviesList(data.results);
      if (query) updateSearchCount(query, data.results[0]);
    } catch {
      setErrorMessage("Error fetching movies. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        {selectedMovie ? (
          <div className="player-container">
            <button className="px-5 py-2 mb-5 bg-blue-600 rounded-lg text-white font-bold" onClick={() => setSelectedMovie(null)}>
              ← Back to Home
            </button>
            <VideoPlayer movieId={selectedMovie.id} />
            <h2 className="text-white mt-5 text-3xl font-bold">{selectedMovie.title}</h2>
          </div>
        ) : (
          <>
            <header>
              <img src="/hero.png" alt="hero" />
              <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
              <Search search={search} setSearch={setSearch} />
            </header>

            {trendingMovies.length > 0 && (
              <section className="trending">
                <h2>Trending Movies</h2>
                <ul>
                  {trendingMovies.map((movie, index) => (
                    <li key={movie.$id} onClick={() => setSelectedMovie({ id: movie.movie_id, title: movie.title })}>
                      <p>{index + 1}</p>
                      <img src={movie.poster_url} alt={movie.title} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="all-movies">
              <h2>All Movies</h2>
              {loading ? (
                <Spinner />
              ) : errorMessage ? (
                <p className="text-red-500">{errorMessage}</p>
              ) : (
                <ul>
                  {moviesList.map((movie) => (
                    <Moviecard key={movie.id} movie={movie} onClick={() => setSelectedMovie(movie)} />
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
};

export default App;