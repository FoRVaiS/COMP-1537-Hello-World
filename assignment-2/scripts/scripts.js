'use strict';

const urlBuilder = ({ secure = false, base = '', path = [], keys = {} }) => {
    const _protocol = secure ? 'https' : 'http';
    const _base = base;
    const _joinedPath = path.join('/');
    const _joinedKeys = Object.entries(keys).map(entry => entry.join('=')).join('&');
    return `${_protocol}://${[[_base, _joinedPath].join('/'), _joinedKeys].join('?')}`;
};

const createCard = (title, description, posterUrl) => {
    const containerNode = document.createElement('article');
    containerNode.classList.add('card');

    if (posterUrl) {
        const posterNode = document.createElement('div');
        posterNode.classList.add('card__thumbnail');
        const posterImageNode = document.createElement('img');
        posterImageNode.classList.add('card__image');
        posterImageNode.src = posterUrl || '';
        posterNode.appendChild(posterImageNode);
        containerNode.appendChild(posterNode);
    }

    const headerNode = document.createElement('header');
    headerNode.classList.add('card__header');

    const titleNode = document.createElement('p');
    titleNode.classList.add('card__title');
    titleNode.textContent = title;
    headerNode.appendChild(titleNode);
    containerNode.appendChild(headerNode);

    const descriptionNode = document.createElement('p');
    descriptionNode.classList.add('card__description');
    descriptionNode.textContent = description;
    containerNode.appendChild(descriptionNode);

    const btnGroupNode = document.createElement('div');
    btnGroupNode.classList.add('card__buttons');

    const backdropBtnNode = document.createElement('button');
    backdropBtnNode.classList.add('card__button');
    backdropBtnNode.classList.add('text-black');
    backdropBtnNode.textContent = 'Add to Backdrop';
    btnGroupNode.appendChild(backdropBtnNode);

    backdropBtnNode.onclick = () => {
        if (posterUrl !== null) $('.backdrop__img').attr('src', urlBuilder({ secure: true, base: 'image.tmdb.org', path: ['t', 'p', 'original', posterUrl.substr(1)] }));
    };

    containerNode.appendChild(btnGroupNode);
    return containerNode;
};

(() => {
    const TMDB_API_KEY = '2a8d6efb5e9c782ea3f279e3b6c252c7';
    const Paginator = (results, selector) => {
        const _results = [...results];
        let currentPage = 0;
        let maxItemsPerPage = 0;

        function createPageButton(text, event) {
            const btn = document.createElement('button');
            btn.classList.add('text-black');
            btn.textContent = text;
            btn.onclick = event;
            return btn;
        }

        function render() {
            const ref = document.querySelector(selector);
            if (!ref) return console.warn('Render selector is invalid');
            ref.querySelector('div:nth-child(1)').innerHTML = '';
            ref.querySelector('div:nth-child(2)').innerHTML = '';

            ref.querySelector('div:nth-child(1)').append(createPageButton('First', first));
            ref.querySelector('div:nth-child(1)').append(createPageButton('Prev', prev));

            // Render the pagination buttons
            Array.from(Array(getMaxPages())).forEach((_, page) => {
                const pageBtn = createPageButton((page + 1).toString(), setPage.bind(null, page));
                ref.querySelector('div:nth-child(1)').append(pageBtn);
            });

            ref.querySelector('div:nth-child(1)').append(createPageButton('Next', next));
            ref.querySelector('div:nth-child(1)').append(createPageButton('Last', last));

            const slicedResults = _results.slice(currentPage * maxItemsPerPage, currentPage * maxItemsPerPage + maxItemsPerPage);

            // Render the movie cards
            slicedResults.forEach(({ poster_path: posterPath, overview, original_title: originalTitle }, index) => {
                const card = createCard(`#${currentPage * maxItemsPerPage + index + 1} | ${originalTitle}`, overview, posterPath ? urlBuilder({ secure: true, base: 'image.tmdb.org', path: ['t', 'p', 'w500', posterPath] }) : null);
                ref.querySelector('div:nth-child(2)').append(card);
            });

            return null;
        }

        function setPage(num) {
            currentPage = Math.min(Math.max(0, num), getMaxPages() - 1);
            render();
        }

        function getCurrentPage() {
            return currentPage;
        }

        function setItemsPerPage(num) {
            maxItemsPerPage = num;
            setPage(getCurrentPage());
        }

        function getItemsPerPage() {
            return maxItemsPerPage;
        }

        function getMaxPages() {
            return Math.ceil(_results.length / getItemsPerPage());
        }

        const next = () => setPage(getCurrentPage() + 1);
        const prev = () => setPage(getCurrentPage() - 1);
        const first = () => setPage(0);
        const last = () => setPage(getMaxPages());

        return {
            render,
            next,
            prev,
            first,
            last,
            setItemsPerPage,
        };
    };

    const query = (base, path, keys, cb) => $.ajax({ url: urlBuilder({ secure: true, base, path, keys: { api_key: TMDB_API_KEY, ...keys } }), type: 'GET', success: cb });
    let paginator = null;

    $('.movie__input').on('keypress', e => {
        if (e.which === 13) {
            const input = $('.movie__input').val();
            query('api.themoviedb.org', ['3', 'search', 'movie'], { query: input }, data => {
                const { results } = data;
                paginator = Paginator(results, '#results');
                paginator.setItemsPerPage(3);
                paginator.render();
            });
        }
    });

    document.querySelector('#in-page-size').onchange = () => {
        if (paginator) paginator.setItemsPerPage(parseInt(document.querySelector('#in-page-size').value, 10));
    };
})();
