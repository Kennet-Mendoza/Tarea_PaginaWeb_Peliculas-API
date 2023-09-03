const apiKey = 'bb7abbcea0251e406b9e2d37d08924a1'; // Tu API key de TMDb
const baseUrl = 'https://api.themoviedb.org/3';
let language = 'es'; // Idioma inicial (español)
let selectedGenreId = ''; // Género seleccionado
let currentPage = 1; // Página actual, inicia en 1

const genreSelect = document.getElementById('genreSelect');
const toggleLanguageButton = document.getElementById('toggleLanguage');
const movieList = document.getElementById('movieList');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');

// Función para cambiar el idioma de la página
function toggleLanguage() {
    if (language === 'es') {
        language = 'en'; // Cambiar a inglés
        toggleLanguageButton.textContent = 'English';
    } else {
        language = 'es'; // Cambiar a español
        toggleLanguageButton.textContent = 'Español';
    }

    // Recargar géneros y películas con el nuevo idioma
    loadGenres();
    loadPopularMoviesByGenreAndPage(selectedGenreId, currentPage); // Cargar películas con el género seleccionado guardado
}

toggleLanguageButton.addEventListener('click', toggleLanguage);

// Función para cargar géneros desde la API
async function loadGenres() {
    try {
        const response = await axios.get(`${baseUrl}/genre/movie/list`, {
            params: {
                language: language,
                api_key: apiKey,
            },
        });

        const genres = response.data.genres;
        genreSelect.innerHTML = ''; // Limpiar opciones anteriores

        genres.forEach((genre) => {
            const option = document.createElement('option');
            option.value = genre.id;
            option.textContent = genre.name;
            genreSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar géneros:', error);
    }
}

// Función para cargar películas populares según el género seleccionado y página actual
async function loadPopularMoviesByGenreAndPage(genreId, page) {
    try {
        selectedGenreId = genreId; // Guardar el género seleccionado

        const response = await axios.get(`${baseUrl}/discover/movie`, {
            params: {
                page: page, // Página actual
                language: language,
                with_genres: genreId,
                api_key: apiKey,
            },
        });

        const movies = response.data.results;
        movieList.innerHTML = ''; // Limpiar la lista anterior

        movies.forEach((movie) => {
            const movieCard = document.createElement('div');
            movieCard.classList.add('movie-card');

            const poster = document.createElement('img');
            poster.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
            poster.alt = movie.title;

            const title = document.createElement('h2');
            title.textContent = movie.title;

            const description = document.createElement('p');
            description.textContent = movie.overview;

            movieCard.appendChild(poster);
            movieCard.appendChild(title);
            movieCard.appendChild(description);
            movieList.appendChild(movieCard);
        });

        // Actualizar el estado de los botones de paginación
        prevPageButton.disabled = page === 1; // Inhabilitar el botón "Anterior" en la primera página
    } catch (error) {
        console.error('Error al cargar películas:', error);
    }
}

// Event listener para cambiar la página al hacer clic en "Siguiente"
nextPageButton.addEventListener('click', () => {
    currentPage++; // Incrementar la página actual
    loadPopularMoviesByGenreAndPage(selectedGenreId, currentPage);
});

// Event listener para cambiar la página al hacer clic en "Anterior"
prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--; // Decrementar la página actual, evita ir a una página negativa
        loadPopularMoviesByGenreAndPage(selectedGenreId, currentPage);
    }
});

// Event listener para cambiar el género seleccionado
genreSelect.addEventListener('change', () => {
    const newGenreId = genreSelect.value;
    currentPage = 1; // Reiniciar la página al cambiar el género
    loadPopularMoviesByGenreAndPage(newGenreId, currentPage);
});

// Carga inicial de géneros y películas en la página 1
loadGenres();
loadPopularMoviesByGenreAndPage(selectedGenreId, currentPage);
