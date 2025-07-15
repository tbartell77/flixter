let currentMovies = [];

// Function to redirect to search.html with the search term
function redirectToSearch() {
  const searchInput = document.getElementById("landing-search-input");
  const searchTerm = searchInput ? searchInput.value.trim() : ''; // Get value from landing page input
  if (searchTerm) {
    // Encode the search term to handle special characters
    window.location.href = `search.html?query=${encodeURIComponent(searchTerm)}`;
  } else {
    // If no search term, just redirect to search.html or show a message
    window.location.href = `search.html`;
  }
}

// Main function to fetch and display movies
async function main(searchTerm) {
  const moviesListEl = document.querySelector(".movies__list");
  const welcomeRow = document.querySelector("#welcome .row");
  const loaderWrapper = document.querySelector(".loader__wrapper"); // Get the search button loader wrapper

  // Display loading state
  if (moviesListEl) { // Check if element exists (only on search.html)
    moviesListEl.innerHTML = "";
    if (welcomeRow) { // Hide welcome row only if it exists (on search.html)
        welcomeRow.style.display = "none";
    }
    moviesListEl.innerHTML = `
      <div class="loader">
          <h2 class="loader_text">Searching for movies...</h2>
          <i class="loader-icon fa-solid fa-circle-notch fa-spin"></i>
      </div>
    `;
    moviesListEl.classList.add("loader--active");
  }

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call delay

    const movies = await fetch(
      `https://www.omdbapi.com/?s=${searchTerm}&apikey=6719cb69`
    );
    const moviesData = await movies.json();

    if (moviesData.Search) {
      currentMovies = moviesData.Search;
      displayMovies(currentMovies);
    } else {
      currentMovies = [];
      if (moviesListEl) {
        moviesListEl.innerHTML = "<p>No movies found matching your search.</p>";
      }
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    if (moviesListEl) {
      moviesListEl.innerHTML =
        "<p>Failed to fetch movies. Please try again later.</p>";
    }
  } finally {
    if (loaderWrapper) { // Ensure loaderWrapper exists before manipulating
      loaderWrapper.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
      loaderWrapper.classList.remove("loader--active");
    }
    if (moviesListEl) {
        moviesListEl.classList.remove("loader--active"); // Remove loader class from movies list
    }
  }
}

function moviesHTML(movie) {
  return `<div class="movie-card">
            <div class="movie-card__wrapper">
              <img class="movie__img" src="${movie.Poster}" alt="${movie.Title} Poster" onerror="this.onerror=null;this.src='https://placehold.co/200x300/000000/FFFFFF?text=No+Image';"/>
              <h3 class="movie__title">${movie.Title}</h3>
              <p class="movie__year"><b>${movie.Year}</b></p>
            </div>
          </div>`;
}

function displayMovies(movies) {
  const moviesListEl = document.querySelector(".movies__list");
  if (moviesListEl) {
    moviesListEl.innerHTML = movies.map((movie) => moviesHTML(movie)).join("");
  }
}

function sortMoviesByYear() {
  const sortOrder = document.getElementById("sort-select").value;

  if (sortOrder === "asc") {
    currentMovies.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
  } else if (sortOrder === "desc") {
    currentMovies.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
  }

  displayMovies(currentMovies);
}

// This function is called when the input on search.html changes
function searchMovies(event) {
  const searchTerm = event.target.value.trim();
  if (searchTerm) {
    main(searchTerm);
  } else {
    const moviesListEl = document.querySelector(".movies__list");
    const welcomeRow = document.querySelector("#welcome .row");
    if (moviesListEl) {
      moviesListEl.innerHTML = "";
    }
    if (welcomeRow) {
      welcomeRow.style.display = "flex";
    }
  }
}

// Logic to run when search.html loads
document.addEventListener("DOMContentLoaded", () => {
  // Hamburger Menu Logic
  const menuButton = document.getElementById("menu__button");
  const navLinks = document.getElementById("nav__links--list");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      navLinks.classList.toggle("menu--open");
    });
  }

  // Check if we are on the search.html page
  if (window.location.pathname.includes("search.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query');
    const searchInput = document.querySelector(".movie__search--input"); // Get the search input on search.html

    if (query) {
      // Set the input value and trigger the search
      if (searchInput) {
        searchInput.value = decodeURIComponent(query);
      }
      main(decodeURIComponent(query));
    } else {
      // If no query parameter, show the welcome message on search.html
      const moviesListEl = document.querySelector(".movies__list");
      const welcomeRow = document.querySelector("#welcome .row");
      if (moviesListEl) {
        moviesListEl.innerHTML = ""; // Clear any initial loading state if no search
      }
      if (welcomeRow) {
        welcomeRow.style.display = "flex";
      }
    }
  } else if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
    // Add event listener for Enter key on the landing page search input
    const landingSearchInput = document.getElementById("landing-search-input");
    if (landingSearchInput) {
      landingSearchInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          redirectToSearch();
        }
      });
    }
  }
});