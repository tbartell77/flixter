async function main(searchTerm) {
  const moviesListEl = document.querySelector(".movies__list");
  const welcomeRow = document.querySelector("#welcome .row");
  const loaderWrapper = document.querySelector(".loader__wrapper");

  // Display the loading state
moviesListEl.innerHTML = ""; // Clear previous results
welcomeRow.style.display = "none"; // Ensure welcome row is hidden
moviesListEl.innerHTML = `
    <div class="loader">
        <h2 class="loader_text">Searching for movies...</h2>
        <i class="loader-icon fa-solid fa-circle-notch fa-spin"></i>
    </div>
`;
moviesListEl.classList.add("loader--active");

  try {
    // Simulate a delay for demonstration purposes (remove in production if not needed)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const movies = await fetch(
      `https://www.omdbapi.com/?s=${searchTerm}&apikey=6719cb69`
    );
    const moviesData = await movies.json();

    // Check if there are any search results
    if (moviesData.Search) {
      moviesListEl.innerHTML = moviesData.Search.map((movie) =>
        moviesHTML(movie)
      ).join("");
    } else {
      moviesListEl.innerHTML = "<p>No movies found matching your search.</p>";
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    moviesListEl.innerHTML =
      "<p>Failed to fetch movies. Please try again later.</p>";
  } finally {
    // Remove the loading state, regardless of success or failure
    loaderWrapper.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
    loaderWrapper.classList.remove("loader--active");
  }
}

function moviesHTML(movie) {
  return `<div class="movie-card">
          <div class="movie-card__wrapper">
            <img class="movie__img" src="${movie.Poster}" alt="${movie.Title} Poster"/>
            <h3 class="movie__title">${movie.Title}</h3>
            <p class="movie__year"><b>${movie.Year}</b></p>
          </div>
        </div>`;
}

function searchMovies(event) {
  const searchTerm = event.target.value.trim();
  if (searchTerm) {
    main(searchTerm);
  } else {
    const moviesListEl = document.querySelector(".movies__list");
    const welcomeRow = document.querySelector("#welcome .row");
    moviesListEl.innerHTML = ""; // Clear results if search term is empty
    welcomeRow.style.display = "flex"; // Show welcome row if search term is empty
  }
}

// You might want to trigger handleLoader on input focus or search button click
const searchInput = document.querySelector(".search__input");
searchInput.addEventListener("input", searchMovies);

// You can remove the handleLoader function as the loading logic is now within the main function
// function handleLoader() {
//   const loaderWrapper = document.querySelector(".loader__wrapper");
//   loaderWrapper.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i>';
//   loaderWrapper.classList.add("loader--active");

//   setTimeout(() => {
//     loaderWrapper.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
//     loaderWrapper.classList.remove("loader--active");
//   }, 350);
// }
