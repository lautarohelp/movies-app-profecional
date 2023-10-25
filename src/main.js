const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  Headers:{
    'Content-Type': 'application/json;charset=utf-8',
  },
  params: {
    'api_key': API_KEY,
  }
})

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
    movieContainer.addEventListener('click', () => {
      location.hash = '#movie=' + movie.id;
    });

    const movieImg = document.createElement('img');
    movieImg.classList.add('movie-img');
    movieImg.setAttribute('alt', movie.title);
    movieImg.setAttribute(
      lazyLoad ? 'data-img' : 'src', 
      'https://image.tmdb.org/t/p/w300' + movie.poster_path
      );
    movieImg.addEventListener('error', () => {
      movieImg.setAttribute('src', 'https://innovating.capital/wp-content/uploads/2021/05/vertical-placeholder-image.jpg')
    })

    if (lazyLoad) {
      lazyLoader.observe(movieImg);
    }

    movieContainer.appendChild(movieImg)
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
  const movies = data.results

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
  const { data } = await api('/discover/movie', {
    params: {
      with_genres: id,
    },
  });
  const movies = data.results

  createMovies(movies, genericSection, true);

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

async function getMoviesBySearch(query)  {
  const { data } = await api('/search/movie', {
    params: {
      query, //ya que se llaman igual no hace falta poner las dos.
    },
  });
  const movies = data.results

  createMovies(movies, genericSection);
} 

/* const btnLoadMore = document.createElement('button');
btnLoadMore.innerText = 'Cargar más';
btnLoadMore.addEventListener('click', getPaginatedTrendingMovies); */

async function getTrendingMovies()  {
  const { data } = await api('/trending/movie/day');
  const movies = data.results

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

  if (scrollIsBottom) {
    page++;
    const { data } = await api('/trending/movie/day?page=2' , {
      params: {
        page,
      }
    })
      
    const movies = data.results
  
    createMovies(movies, genericSection, {lazyLoad:true, clean:false});
  
  }

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
