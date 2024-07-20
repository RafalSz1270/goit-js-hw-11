import axios from 'axios';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '45026380-4529b8f9b335b30238156ee8d';
const searchForm = document.querySelector('.search-form');
const searchQueryInput = document.getElementById('searchQuery');
const searchButton = document.getElementById('searchButton');
const gallery = document.getElementById('gallery');
const loader = document.querySelector('.loader');

const fetchImages = async (query) => {
  loader.style.display = 'block';
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true
      }
    });
    return response.data.hits;
  } catch (error) {
    console.error('Error fetching images:', error);
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Please try again later.'
    });
  } finally {
    loader.style.display = 'none';
  }
};

const displayImages = (images) => {
  gallery.innerHTML = '';

  if (images.length === 0) {
    iziToast.info({
      title: 'Info',
      message: 'Sorry, there are no images matching your search query. Please try again!'
    });
    return;
  }

  const imageItems = images.map(image => {
    return `
      <a href="${image.largeImageURL}" class="gallery-item">
        <img src="${image.webformatURL}" alt="${image.tags}" />
        <p>Likes: ${image.likes} Views: ${image.views} Comments: ${image.comments} Downloads: ${image.downloads}</p>
      </a>
    `;
  }).join('');

  gallery.insertAdjacentHTML('beforeend', imageItems);
  new SimpleLightbox('.gallery a', { captionsData: 'alt',
  captionDelay: 250 }).refresh();
};

searchButton.addEventListener('click', async () => {
  const query = searchQueryInput.value.trim();
  if (!query) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query.'
    });
    return;
  }

  const images = await fetchImages(query);
  displayImages(images);
});
