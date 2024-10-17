const API_KEY = '42a23a10ae7e6e9f66ee82985ea0f595'; // Your TMDB API key
const searchButton = document.getElementById('search-button');
const searchBar = document.getElementById('search-bar');
const trendingMoviesSection = document.getElementById('trending-movies');
const searchResultsSection = document.getElementById('search-results');
const movieDetailsSection = document.getElementById('movie-details');
const movieTitleElement = document.getElementById('movie-title');
const movieDescriptionElement = document.getElementById('movie-description');
const favoritesSection = document.getElementById('favorites');

let favorites = [];

// Fetch and display trending movies
async function fetchTrendingMovies() {
    const response = await fetch(`https://api.themoviedb.org/3/trending/movie/day?api_key=${API_KEY}`);
    const data = await response.json();
    displayTrendingMovies(data.results);
}

// Display trending movies on the page
function displayTrendingMovies(movies) {
    const movieGrid = trendingMoviesSection.querySelector('.movie-grid');
    movieGrid.innerHTML = ''; // Clear existing content

    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        movieGrid.appendChild(movieCard);
    });
}

// Create a movie card
function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';

    const img = document.createElement('img');
    img.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
    img.alt = movie.title;

    const title = document.createElement('h3');
    title.textContent = movie.title;

    const rating = document.createElement('p');
    rating.textContent = `Rating: ${movie.vote_average}`;

    const addToFavoritesButton = document.createElement('button');
    addToFavoritesButton.className = 'add-to-favorites';
    addToFavoritesButton.setAttribute('data-movie-id', movie.id);
    addToFavoritesButton.textContent = 'Add to Favorites';

    const viewDetailsButton = document.createElement('button');
    viewDetailsButton.className = 'view-details';
    viewDetailsButton.setAttribute('data-movie-id', movie.id);
    viewDetailsButton.textContent = 'View Details';

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(rating);
    card.appendChild(addToFavoritesButton);
    card.appendChild(viewDetailsButton);

    return card;
}

// Handle the search functionality
searchButton.addEventListener('click', async () => {
    const query = searchBar.value;
    if (query) {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`);
        const data = await response.json();
        displaySearchResults(data.results);
    }
});

// Display search results
function displaySearchResults(movies) {
    const movieGrid = searchResultsSection.querySelector('.movie-grid');
    movieGrid.innerHTML = ''; // Clear existing content
    searchResultsSection.style.display = 'block';

    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        movieGrid.appendChild(movieCard);
    });
}

// Add to favorites functionality
function addToFavorites(movie) {
    if (!favorites.some(fav => fav.id === movie.id)) {
        favorites.push(movie);
        alert(`${movie.title} has been added to favorites!`);
    } else {
        alert(`${movie.title} is already in your favorites.`);
    }
}

// Show movie details
async function showMovieDetails(movieId) {
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
    const movie = await response.json();
    movieTitleElement.textContent = movie.title;
    movieDescriptionElement.textContent = `Description: ${movie.overview}`;
    movieDetailsSection.style.display = 'block';
}

// Event listener for "Add to Favorites" and "View Details" buttons
document.addEventListener('click', function (event) {
    if (event.target.classList.contains('add-to-favorites')) {
        const movieId = event.target.getAttribute('data-movie-id');
        const movieTitle = event.target.previousElementSibling.innerText; // Assuming h3 is before the button
        const movieRating = event.target.previousElementSibling.nextElementSibling.innerText; // Assuming p is after the h3
        const moviePoster = event.target.parentElement.querySelector('img').src; // Get the image source

        const movie = {
            id: movieId,
            title: movieTitle,
            rating: movieRating,
            poster: moviePoster,
        };

        addToFavorites(movie);
    } else if (event.target.classList.contains('view-details')) {
        const movieId = event.target.getAttribute('data-movie-id');
        showMovieDetails(movieId);
    }
});

// Initial fetch of trending movies on page load
fetchTrendingMovies();
