let maxPage;
let page = 1;
let infiniteScroll;
/* let lang = "en-Us"; */



function scrollTop() {
  
  window.scrollTo({
    top: 0,
    behavior:"smooth" 
  });
}

searchFormBtn.addEventListener('click', () => {
  location.hash = '#search=' + searchFormInput.value;
})
trendingBtn.addEventListener('click', () => {
  location.hash = '#trends';
  
})

arrowBtn.addEventListener('click', () => {
  console.log('si clikea');
    /* history.go(-2); */
    history.back();
})


window.addEventListener('DOMContentLoaded', navigator1, false)
window.addEventListener('hashchange', navigator1, false);
window.addEventListener('scroll', infiniteScroll, false);



function navigator1() {
  console.log({ location });

  scrollTop();

  if (infiniteScroll) {
    window.removeEventListener("scroll", infiniteScroll, { passive: false });
    infiniteScroll = undefined;
  }

  if (location.hash.startsWith('#trends')) {
    trendsPage();
  }  else if (location.hash.startsWith('#search=')) {
    searchPage()
  } else if (location.hash.startsWith('#movie=')) {
    movieDetailsPage() 
  } else if (location.hash.startsWith('#category=')) {
    categoriesPage()
  }else{
    homePage(); 
  }

  if (infiniteScroll) {
    window.addEventListener("scroll", infiniteScroll, { passive: false });
  }
}


function homePage() {
  console.log('home!!');
  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.add('inactive');
  headerTitle.classList.remove('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.remove('inactive');
  likedContainer.classList.remove('inactive');


  trendingPreviewSection.classList.remove('inactive');
  categoriesPreviewSection.classList.remove('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.add('inactive');

  switch(lan.value){
    case 'en':
        trendingPreviewTitle.innerHTML = 'Trends';
        trendingBtn.innerHTML = 'See more';
        categoriesPreviewTitle.innerHTML = 'Categories';
        likedTitle.innerHTML = 'Favorite movies';
        break;
    case 'fr':
        trendingPreviewTitle.innerHTML = 'Les tendances';
        trendingBtn.innerHTML = 'Voir plus';
        categoriesPreviewTitle.innerHTML = 'Catégories';
        likedTitle.innerHTML = 'Films préférés';
        break;
        case 'pt-BR':
            trendingPreviewTitle.innerHTML = 'Tendências';
            trendingBtn.innerHTML = 'Ver mais'
            categoriesPreviewTitle.innerHTML = 'Categorias';
            likedTitle.innerHTML = 'Filmes favoritos';
        break;
    default:
        trendingPreviewTitle.innerHTML = 'Tendencias';
        break;
  }
  
  getTrendingMoviesPreview();
  getCategoriesPreview();
  getLikedMovies();
}

function categoriesPage() {
  console.log('Categories!!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.add('header-arrow--white');
  arrowBtn.classList.remove('inactive');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.add('inactive');
  likedContainer.classList.add('inactive');


  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  const [_, categoryData] = location.hash.split('=') //devolvera un array con dos parametros dentro
  const [categoryId, categoryName] = categoryData.split('-')

  headerCategoryTitle.innerHTML = categoryName;

  getMoviesByCategory(categoryId);
  
  infiniteScroll = getPaginatedMoviesByCategories(categoryId);
}

function movieDetailsPage() {
  console.log('MOVIE!!');

  headerSection.classList.add('header-container--long');
  /* headerSection.style.background = ''; */
  arrowBtn.classList.remove('inactive');
  arrowBtn.classList.remove('header-arrow--white');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.add('inactive');
  likedContainer.classList.add('inactive');

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.remove('inactive');

  const [_, movieId] = location.hash.split('=');
  getMovieById(movieId);
}

function searchPage() {
  console.log('SEARCH!!');

  
  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.remove('inactive');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.remove('inactive');
  likedContainer.classList.add('inactive');


  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  const [_, query] = location.hash.split('=');
  getMoviesBySearch(query);
  headerCategoryTitle.textContent = `Results`;

  infiniteScroll = getPaginatedMoviesBySearch(query);


}

function trendsPage() {
  console.log('TRENDS!!');

  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.add('header-arrow--white');
  arrowBtn.classList.remove('inactive');
  headerTitle.classList.add('inactive');
  headerCategoryTitle.classList.remove('inactive');
  searchForm.classList.add('inactive');
  likedContainer.classList.add('inactive');


  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  headerCategoryTitle.innerHTML = 'Trending';


  getTrendingMovies();

  infiniteScroll = getPaginatedTrendingMovies;
}

