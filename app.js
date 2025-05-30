async function main(searchTerm) {
  const movies = await fetch(
    `https://www.omdbapi.com/?s=${searchTerm}&apikey=6719cb69`
  );
  const moviesData = await movies.json();
  const moviesListEl = document.querySelector(".movies__list");
  const welcomeRow = document.querySelector("#welcome .row"); // Select the row

  moviesListEl.innerHTML = moviesData.Search.map((movie) =>
    moviesHTML(movie)
  ).join("");
  welcomeRow.style.display = "none"; // Hide the welcome row
}

function moviesHTML(movie) {
  return `<div class="movie-card">
            <div class="movie-card__wrapper">
              <img class=movie__img src= ${movie.Poster} alt=""/>
              <h3 class=movie__title>${movie.Title}</h3>
              <p class=movie__year><b>${movie.Year}</b></p>
            </div>
          </div>`;
}

function searchMovies(event) {
  main(event.target.value);
  console.log(event.target.value);
}

const loaderWrapper = document.querySelector(".loader__wrapper");

function handleLoader() {
  loaderWrapper.innerHTML = '<i class="fa-solid fa-circle-notch"></i>';
  loaderWrapper.classList += " loader__clicked";

  setTimeout(() => {
    loaderWrapper.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
  }, 350);
}
