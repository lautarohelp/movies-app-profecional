const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  Headers:{
    'Content-Type': 'application/json;charset=utf-8',
  },
  params: {
    'api_key': API_KEY,
    'language': lan.value,
  }
}); 

const lang = localStorage.language;
lan.value = lang !== '' ? lang : 'en';

if(lan.value == "en"){
    trendingPreviewTitle.innerHTML = 'Trends'
}
lan.addEventListener('change', () => {
    localStorage.setItem('language', lan.value);
    location.reload();
})

function likedMovieList() {
  const item = JSON.parse(localStorage.getItem("liked_movies"));
  let movies;
  if (item) {
    movies = item;
  } else {
    movies = {};
  }

  return movies;
}

function likedMovie(movie) {

  const likedMovies = likedMovieList();
  console.log(likedMovies);
  if (likedMovies[movie.id]) {
    likedMovies[movie.id] = undefined;
  }else {
    likedMovies[movie.id] = movie;
  }

  localStorage.setItem("liked_movies", JSON.stringify(likedMovies));
}


// Utils

const lazyLoader = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const url = entry.target.getAttribute('data-img');
      entry.target.setAttribute('src', url);
    }
  })
});

function createMovies(
  movies,
  container, 
  {
    lazyLoad = false, 
    clean = true
  } = {},
  ) {

  if (clean) {
    container.innerHTML = '';
  }

  movies.forEach(movie => {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');

    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute(
      lazyLoad ? 'data-img' : 'src', 
      'https://image.tmdb.org/t/p/w300' + movie.poster_path
      );

        movieImg.addEventListener('click', () => {
          location.hash = '#movie=' + movie.id;
        });

    movieImg.addEventListener('error', () => {
      movieImg.setAttribute('src', 'https://innovating.capital/wp-content/uploads/2021/05/vertical-placeholder-image.jpg')
    });

    const movieBtn = document.createElement("button");
    movieBtn.classList.toggle("movie-btn");
    likedMovieList()[movie.id] && movieBtn.classList.add("movie-btn--liked");


    movieBtn.addEventListener("click", () => {
      movieBtn.classList.toggle("movie-btn--liked");
      likedMovie(movie);
      getLikedMovies();
    })

    if (lazyLoad) {
      lazyLoader.observe(movieImg);
    }

    movieContainer.appendChild(movieImg);
    movieContainer.appendChild(movieBtn);
    container.appendChild(movieContainer);
  });
}

function createCategory(categories, container) {
  container.innerHTML = '';

  categories.forEach(category => {
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');

    const categoryTitle = document.createElement('button');
    categoryTitle.classList.add('category-title');
    categoryTitle.setAttribute('id', 'id' + category.id);
    categoryTitle.addEventListener('click', () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    container.appendChild(categoryContainer);
  }); 
}

//Llamados a la API

async function getTrendingMoviesPreview()  {
  const { data } = await api('/trending/movie/day');
  const movies = data.results;
  maxPage = data.total_pages;

  createMovies(movies, trendingMoviesPreviewList, true);

  /* movies.forEach(movie => {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');

    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300' + movie.poster_path);

    movieContainer.appendChild(movieImg)
    trendingMoviesPreviewList.appendChild(movieContainer);
  }); */
}


async function getCategoriesPreview()  {
  const { data } = await api('/genre/movie/list');
  
  //gracias a axios no hace falta cargar ni la apikey tampoco data xq ya lo parcea solo y se lo mandamos como parametros.

  const categories = data.genres;
  createCategory(categories, categoriesPreviewList);
  //categoriesPreviewList

  /* 
    categories.forEach(category => {
    const categoryContainer = document.createElement('div');
    categoryContainer.classList.add('category-container');

    const categoryTitle = document.createElement('button');
    categoryTitle.classList.add('category-title');
    categoryTitle.setAttribute('id', 'id' + category.id);
    categoryTitle.addEventListener('click', () => {
      location.hash = `#category=${category.id}-${category.name}`;
    });
    const categoryTitleText = document.createTextNode(category.name);

    categoryTitle.appendChild(categoryTitleText);
    categoryContainer.appendChild(categoryTitle);
    categoriesPreviewList.appendChild(categoryContainer);
  });  */
}

async function getMoviesByCategory(id)  {
  const { data } = await api('/discover/movie?language=en-US', {
    params: {
      with_genres: id,
    },
  });
  const movies = data.results;
  maxPage = data.total_pages;

  createMovies(movies, genericSection, {lazyLoad: true });

/*   movies.forEach(movie => {
    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');

    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute(
      'src', 
      'https://image.tmdb.org/t/p/w300' + movie.poster_path
    );

    movieContainer.appendChild(movieImg)
    genericSection.appendChild(movieContainer);
  }); */
} 


function getPaginatedMoviesByCategories(id) {
  return async function (){
    const { 
      scrollTop, 
      scrollHeight, 
      clientHeight
    } = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;
    
    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const { data } = await api('/discover/movie', {
        params: {
          with_genres: id,
          page,
        },
      });
      const movies = data.results
      
      maxPage = data.total_pages;
      console.log(maxPage);

      createMovies(movies, genericSection, {lazyLoad:true, clean:false});
    
    }
  
  }
}


async function getMoviesBySearch(query)  {
  const { data } = await api('/search/movie', {
    params: {
      query, //ya que se llaman igual no hace falta poner las dos.
    },
  });
  const movies = data.results

  createMovies(movies, genericSection);
} 

function getPaginatedMoviesBySearch(query) {
  return async function (){
    const { 
      scrollTop, 
      scrollHeight, 
      clientHeight
    } = document.documentElement;
    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;
    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const { data } = await api('/search/movie', {
        params: {
          query,
          page,
        }
      });
    
      const movies = data.results;
      
      maxPage = data.total_pages;
      console.log(maxPage);

      createMovies(movies, genericSection, {lazyLoad:true, clean:false});
    
    }
  
  }
}

/* const btnLoadMore = document.createElement('button');
btnLoadMore.innerText = 'Cargar más';
btnLoadMore.addEventListener('click', getPaginatedTrendingMovies); */

async function getTrendingMovies()  {
  const { data } = await api('/trending/movie/day');
  const movies = data.results;
  maxPage = data.total_pages;

  createMovies(movies, genericSection, {lazyLoad:true, clean:true});

  /* genericSection.appendChild(btnLoadMore); */


}



async function getPaginatedTrendingMovies() {
  const { 
    scrollTop, 
    scrollHeight, 
    clientHeight
  } = document.documentElement;
  const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
  const pageIsNotMax = page < maxPage;

  if (scrollIsBottom && pageIsNotMax ) {
    page++;
    const { data } = await api('/trending/movie/day?page=2' , {
      params: { 
        page,
      }
    })
      
    const movies = data.results
  
    createMovies(
      movies, 
      genericSection, 
      {lazyLoad:true, clean:false},
      );
    };
/*   genericSection.appendChild(btnLoadMore); */
}

async function getMovieById(id)  {
  const { data: movie } = await api('/movie/' + id);

  const movieImgUrl = 'https://image.tmdb.org/t/p/w500' + movie.poster_path;
  headerSection.style.background = `
  linear-gradient(
    180deg, 
    rgba(0, 0, 0, 0.35) 19.27%, 
    rgba(0, 0, 0, 0) 29.17%
    ),
  url(${movieImgUrl})`;


  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;

  createCategory(movie.genres , movieDetailCategoriesList);

  getRelatedMoviesId(id);
}


async function getRelatedMoviesId(id) {
  const { data } = await api(`/movie/${id}/recommendations`);
  const relatedMovies = data.results; 

  createMovies(relatedMovies, relatedMoviesContainer);
}

function getLikedMovies() {
  const likedMovies = likedMovieList();
  const moviesArray = Object.values(likedMovies);

  createMovies(moviesArray, likedMoviesListArticle, {lazyLoad:true, clean:true});

  console.log(likedMovies);
}





