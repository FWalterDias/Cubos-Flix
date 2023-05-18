const movies = document.querySelector('.movies');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const inputSearch = document.querySelector('.input');

const highlightVideo = document.querySelector('.highlight__video');
const highlightVideoOpacity = document.querySelector('.highlight__video__opacity');
const highlightVideoLink = document.querySelector('.highlight__video-link');

const highlightTitle = document.querySelector('.highlight__title');
const highlightRating = document.querySelector('.highlight__rating');
const highlightGenres = document.querySelector('.highlight__genres');
const highlightLaunch = document.querySelector('.highlight__launch');
const highlightDescription = document.querySelector('.highlight__description');

const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal__close');
const modalTitle = document.querySelector('.modal__title');
const modalImg = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalAverage = document.querySelector('.modal__average');
const modalGenres = document.querySelector('.modal__genres');

let moviesData = [];
let moviesSerach = [];
let indexCurrentMovies = 0;

async function getAllMovies() {
    try {
        const response = await api.get();
        moviesData = response.data.results;
        moviesSerach = response.data.results;

        renderMovies(moviesData);
    } catch (error) {
        console.log(error);
    }
}
getAllMovies();

async function renderMovies(moviesToRender) {

    const filmes = await moviesToRender;

    movies.innerHTML = '';

    filmes.slice(indexCurrentMovies, indexCurrentMovies + 6).forEach(movie => {

        const divMovie = document.createElement('div');
        divMovie.classList.add('movie');
        divMovie.style.backgroundImage = `url(${movie.poster_path})`;

        divMovie.addEventListener('click', () => {
            modal.classList.remove('hidden');

            getDataModal(movie.id);
        });

        const divMovieInfo = document.createElement('div');
        divMovieInfo.classList.add('movie__info');

        const spanMovieTitlle = document.createElement('span');
        spanMovieTitlle.classList.add('movie__title');
        spanMovieTitlle.textContent = movie.title;

        const spanMovieRating = document.createElement('span');
        spanMovieRating.classList.add('movie__rating');
        spanMovieRating.textContent = movie.vote_average.toFixed(1);

        const imgMovieStar = document.createElement('img');
        imgMovieStar.src = './assets/estrela.svg';

        spanMovieRating.appendChild(imgMovieStar);
        divMovieInfo.append(spanMovieTitlle, spanMovieRating);
        divMovie.append(divMovieInfo);
        movies.append(divMovie);
    });
}

async function getDataModal(idMovie) {
    try {
        const response = await api.get(`https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${idMovie}?language=pt-BR`);

        const { data } = response;

        modalTitle.textContent = data.title;
        modalImg.src = data.backdrop_path;
        modalDescription.textContent = data.overview;
        modalAverage.textContent = data.vote_average.toFixed(1);

        modalGenres.textContent = '';

        const { genres } = data;
        genres.forEach((item) => {
            const genre = document.createElement('span');
            genre.textContent = item.name;
            genre.classList.add('modal__genre');

            modalGenres.append(genre);
        });
    } catch (error) {
        console.log(error);
    }
}

modal.addEventListener('click', (event) => {
    event.stopPropagation();
    modal.classList.add('hidden');
});

modalClose.addEventListener('click', (event) => {
    event.stopPropagation();
    modal.classList.add('hidden');
});

async function renderHighLightMovie() {
    try {
        const response = await api.get('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR');
        const { data } = response;

        highlightVideo.style.background = `url(${data.backdrop_path}) 0% 0% / cover no-repeat`;

        highlightVideoOpacity.style.background = 'black';
        highlightVideoOpacity.style.opacity = '.6';

        highlightTitle.textContent = `${data.title}`;
        highlightRating.textContent = `${data.vote_average.toFixed(1)}`;

        const { genres } = data;
        genres.forEach((item, index) => {
            if (index === genres.length - 1) {
                highlightGenres.textContent += `${item.name}`;
            } else {
                highlightGenres.textContent += `${item.name}, `;
            }
        });

        highlightLaunch.textContent = new Date(data.release_date).toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC",
        });

        highlightDescription.textContent = data.overview;

    } catch (error) {
        console.log(error);
    }
}
renderHighLightMovie();

async function openHighLightMovie() {
    try {
        const response = await api.get('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR');
        const { results } = response.data;

        highlightVideoLink.href = `https://www.youtube.com/watch?v=${results[0].key}`;
    } catch (error) {
        console.log(error);
    }
}
openHighLightMovie();

btnNext.addEventListener('click', (event) => {
    event.stopPropagation();

    if (indexCurrentMovies < 12) {
        indexCurrentMovies += 6;
        renderMovies(moviesSerach);
        return;
    }
    indexCurrentMovies = 0;
    renderMovies(moviesSerach);
});

btnPrev.addEventListener('click', (event) => {
    event.stopPropagation();

    if (indexCurrentMovies >= 6) {
        indexCurrentMovies -= 6;
        renderMovies(moviesSerach);
        return;
    }
    indexCurrentMovies = 12;
    renderMovies(moviesSerach);
});

inputSearch.addEventListener('keypress', (event) => {

    if (event.key === 'Enter' && !inputSearch.value) {
        indexCurrentMovies = 0;
        moviesSerach = moviesData;

        renderMovies(moviesSerach);

    } else if (event.key === 'Enter' && inputSearch.value) {
        getSearchMovies(inputSearch.value);
        inputSearch.value = '';
    }
});

async function getSearchMovies(inputContent) {
    try {
        const response = await api.get(`https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${inputContent}`);

        const { data } = response;

        moviesSerach = data.results.filter(movie => movie.original_title.toLowerCase().includes(inputContent.toLowerCase()));

        if(!moviesSerach.length){
            movies.textContent = 'Nenhum filme encontrado!';
            // movies.style.justifyContent = 'center';
            inputSearch.value = '';
            return;
        }

        renderMovies(moviesSerach);

    } catch (error) {
        console.log(error);
    }
}