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
      // generate HTML using template and book data
      const html = templateBook(book);

      // convert HTML string into DOM element
      const element = utils.createDOMFromHTML(html);

      // append element to the list
      list.appendChild(element);
    }
  }

  // set up UI actions (double-click to add to favorites)
  function initActions() {
    const images = document.querySelectorAll(`${select.list} ${select.image}`);

    for (const image of images) {
      image.addEventListener('dblclick', (event) => {
        // prevent default link behavior
        event.preventDefault();

        // add favorite class to the clicked cover
        image.classList.add('favorite');

        // read book id from data-id
        const id = image.dataset.id;

        // push id to favorites (avoid duplicates)
        if (id && !favoriteBooks.includes(id)) {
          favoriteBooks.push(id);
        }

        // (optional) debug in console:
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
