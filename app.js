const API_KEY = '42a23a10ae7e6e9f66ee82985ea0f595';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Fetch Trending Movies from TMDb API
async function fetchTrendingMovies() {
    const response = await fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`);
    const data = await response.json();
    displayMovies(data.results, 'trending-movies-grid');
}

// Fetch Movies based on search query
async function searchMovies(query) {
    const response = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
    const data = await response.json();
    displayMovies(data.results, 'search-results-grid');
}

// Display Movies in the given section (trending or search results)
function displayMovies(movies, elementId) {
    const movieGrid = document.getElementById(elementId);
    movieGrid.innerHTML = ''; // Clear previous content

    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.addEventListener('click', () => displayMovieDetails(movie.id)); // Add click event

        const moviePoster = document.createElement('img');
        moviePoster.src = movie.poster_path ? `${IMG_BASE_URL}${movie.poster_path}` : 'Images/Placeholder-image.jpg';
        moviePoster.alt = movie.title;

        const movieTitle = document.createElement('h3');
        movieTitle.textContent = movie.title;

        const movieRating = document.createElement('p');
        movieRating.textContent = `Rating: ${movie.vote_average}`;

        movieCard.appendChild(moviePoster);
        movieCard.appendChild(movieTitle);
        movieCard.appendChild(movieRating);
        movieGrid.appendChild(movieCard);
    });
}

// Fetch and display details of a specific movie
async function displayMovieDetails(movieId) {
    const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
    const movie = await response.json();

    const movieDetailsSection = document.getElementById('movie-details');
    const moviePoster = document.getElementById('movie-poster');
    const movieTitle = document.getElementById('movie-title');
    const movieDescription = document.getElementById('movie-description');

    moviePoster.src = movie.poster_path ? `${IMG_BASE_URL}${movie.poster_path}` : 'Images/Placeholder-image-large.jpg';
    movieTitle.textContent = movie.title;
    movieDescription.textContent = `Description: ${movie.overview}`;

    movieDetailsSection.style.display = 'block'; // Show movie details section
}

// Handle search input
document.getElementById('search-bar').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        const query = event.target.value.trim();
        if (query) {
            searchMovies(query);
            document.getElementById('search-results').style.display = 'block'; // Show search results section
            document.getElementById('trending-movies').style.display = 'none'; // Hide trending section
        }
    }
});

// Initialize the app by fetching trending movies
fetchTrendingMovies();
