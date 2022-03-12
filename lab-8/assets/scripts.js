'use strict';
const urlBuilder = ({ secure = false, base = '', path = [], keys = {} }) => {
  const _protocol = secure ? 'https' : 'http';
  const _base = base;
  const _joinedPath = path.join('/');
  const _joinedKeys = Object.entries(keys).map(entry => entry.join('=')).join('&');
  return `${_protocol}://${[[_base, _joinedPath].join('/'), _joinedKeys].join('?')}`;
};

(() => {
  const TMDB_API_KEY = '2a8d6efb5e9c782ea3f279e3b6c252c7';
    
  const query = (base, path, keys, cb) => $.ajax({ url: urlBuilder({ secure: true, base, path, keys: { api_key: TMDB_API_KEY, ...keys } }), type: 'GET', success: cb });

  const setup = () => {
    $('.movie__input').on('keypress', e => {
      if (e.which === 13) {
        $('#results').html('');
        const input = $('.movie__input').val();

        query('api.themoviedb.org', ['3', 'search', 'movie'], { query: input }, data => {
          const { results } = data;

          results.forEach(({ poster_path, overview, original_title }) => {
            const titleEl = document.createElement('h1');
            titleEl.textContent = original_title;
            $('#results').append(titleEl);

            const overviewEl = document.createElement('p');
            overviewEl.textContent = overview;
            $('#results').append(overviewEl);

            if (poster_path !== null) {
              const posterEl = document.createElement('img');
              posterEl.src = urlBuilder({ secure: true, base: 'image.tmdb.org', path: ['t', 'p', 'w500', poster_path] });
              $('#results').append(posterEl);
            }

            const addToBackdropBtn = document.createElement('button');
            addToBackdropBtn.textContent = 'Add to Backdrop';
            addToBackdropBtn.className = ['text-black'].join(' ');
            $('#results').append(addToBackdropBtn);

            addToBackdropBtn.onclick = () => {
              if (poster_path !== null) $('.backdrop__img').attr('src', urlBuilder({ secure: true, base: 'image.tmdb.org', path: ['t', 'p', 'original', poster_path.substr(1)] }));
            };
          });
        });
      }
    });
  };
  $(document).ready(setup);
})();
