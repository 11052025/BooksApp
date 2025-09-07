/* global Handlebars, dataSource, utils */

(() => {
  'use strict';

  // selectors
  const select = {
    template: '#template-book',
    list: '.books-list',
    image: '.book__image',
  };

  // precompiled Handlebars template
  const templateBook = Handlebars.compile(
    document.querySelector(select.template).innerHTML
  );

  // store IDs of favorite books
  const favoriteBooks = [];

  // render function (creates DOM for all books)
  function render() {
    const list = document.querySelector(select.list);

    for (const book of dataSource.books) {
      const html = templateBook(book);
      const element = utils.createDOMFromHTML(html);
      list.appendChild(element);
    }
  }

  // set up UI actions (double-click to toggle favorites)
  function initActions() {
    const images = document.querySelectorAll(`${select.list} ${select.image}`);

    for (const image of images) {
      image.addEventListener('dblclick', (event) => {
        event.preventDefault();

        const id = image.dataset.id;

        if (image.classList.contains('favorite')) {
          // already favorite → remove
          image.classList.remove('favorite');

          const index = favoriteBooks.indexOf(id);
          if (index !== -1) {
            favoriteBooks.splice(index, 1);
          }
        } else {
          // not favorite yet → add
          image.classList.add('favorite');

          if (id && !favoriteBooks.includes(id)) {
            favoriteBooks.push(id);
          }
        }

        // (optional) debug
        // console.log('favoriteBooks:', favoriteBooks);
      });
    }
  }

  // run after DOM is ready: render first, then bind actions
  document.addEventListener('DOMContentLoaded', () => {
    render();
    initActions();
  });
})();
