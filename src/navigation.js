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
window.addEventListener('hashchange', navigator1, false)

function navigator1() {
  console.log({ location });

  scrollTop();

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
}


function homePage() {
  console.log('home!!');
  headerSection.classList.remove('header-container--long');
  headerSection.style.background = '';
  arrowBtn.classList.add('inactive');
  headerTitle.classList.remove('inactive');
  headerCategoryTitle.classList.add('inactive');
  searchForm.classList.remove('inactive');

  trendingPreviewSection.classList.remove('inactive');
  categoriesPreviewSection.classList.remove('inactive');
  genericSection.classList.add('inactive');
  movieDetailSection.classList.add('inactive');
  
  getTrendingMoviesPreview();
  getCategoriesPreview();
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

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  const [_, categoryData] = location.hash.split('=') //devolvera un array con dos parametros dentro
  const [categoryId, categoryName] = categoryData.split('-')

  headerCategoryTitle.innerHTML = categoryName;


  getMoviesByCategory(categoryId);
  
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

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  const [_, query] = location.hash.split('=');
  getMoviesBySearch(query);
  headerCategoryTitle.textContent = `Results`;
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

  trendingPreviewSection.classList.add('inactive');
  categoriesPreviewSection.classList.add('inactive');
  genericSection.classList.remove('inactive');
  movieDetailSection.classList.add('inactive');

  headerCategoryTitle.innerHTML = 'Trending';


  getTrendingMovies();
}