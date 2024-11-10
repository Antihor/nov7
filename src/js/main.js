import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const contRef = document.querySelector('.container');
const formRef = document.querySelector('.form');
const galRef = document.querySelector('.gallery');

formRef.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();

  loaderOn();

  galRef.innerHTML = '';

  const query = e.target.elements.query.value;

  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = '42059071-0978dc0d7158b742eee7c30f5';
  const END_POINT = '?key=';
  const url = `${BASE_URL}${END_POINT}${KEY}&q=${encodeURIComponent(
    query
  )}&image_type=photo&orientation=horizontal&safeserch=true`;

  fetch(url)
    .then(resp => {
      if (!resp.ok) {
        throw new Error(resp.statusText);
      }
      return resp.json();
    })
    .then(data => {
      if (data.hits.length === 0 || query === '') {
        iziToast.error({
          title: '',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
          position: 'center',
        });
      } else {
        const markup = data.hits
          .map(
            ({
              webformatURL,
              largeImageURL,
              tags,
              likes,
              views,
              comments,
              downloads,
            }) => {
              return `<a href=${webformatURL} class='link'
      ><li class='item'>
        <img class='image' src=${largeImageURL} alt=${tags} />
        <p><b>Likes:</b>${likes}</p>
        <p><b>Views:</b>${views}</p>
        <p><b>Comments:</b>${comments}</p>
        <p><b>Downloads:</b>${downloads}</p></li
    ></a>`;
            }
          )
          .join('');

        galRef.insertAdjacentHTML('beforeend', markup);

        lightbox.refresh();

        formRef.reset();
      }
    })
    .catch(err => {
      console.log(err);
    })
    .finally(() => {
      loaderOff();
      formRef.reset();
    });
}

const options = {
  captions: true,
  captionSelector: 'img',
  captionsData: 'alt',
  captionPosition: 'bottom',
  animation: 250,
};

const lightbox = new SimpleLightbox('.gallery a', options);
lightbox.on('show.simplelightbox');

function loaderOn() {
  const loader = document.createElement('span');
  loader.classList.add('loader');
  contRef.append(loader);
}
function loaderOff() {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.remove();
  }
}
