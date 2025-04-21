const API_KEY = "90263591"; // ✅ Correctly only the key

function MovieCard({ movie }) {
  return (
    <div className="card">
      <img
        src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300x450"}
        alt={movie.Title}
      />
      <h3>{movie.Title}</h3>
      <p>{movie.Year}</p>
      {movie.imdbRating && (
        <div className="rating-badge">⭐ {movie.imdbRating}</div>
      )}
      {movie.Genre && (
        <p style={{ marginTop: "0.5rem", color: "#a5d6ff" }}>{movie.Genre}</p>
      )}
    </div>
  );
}

function App() {
  const [query, setQuery] = React.useState("");
  const [movies, setMovies] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const searchMovies = async () => {
    if (!query) return;
    setLoading(true);
    setError("");
    setMovies([]);

    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
      const data = await res.json();

      if (data.Response === "True") {
        const detailedMovies = await Promise.all(
          data.Search.map(async (movie) => {
            const detailRes = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`);
            const detailData = await detailRes.json();
            return detailData;
          })
        );
        setMovies(detailedMovies);
      } else {
        setError(data.Error);
      }
    } catch (e) {
      setError("Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>🎬 Movie Search App</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={searchMovies}>Search</button>
      </div>

      {loading && <p>Loading movies...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="grid">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie} />
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
