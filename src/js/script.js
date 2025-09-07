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

  // event delegation: single listener on the list
  function initActions() {
    const list = document.querySelector(select.list);

    // listen for double-clicks on the whole list
    list.addEventListener('dblclick', (event) => {
      event.preventDefault();

      // go from clicked IMG (or child) to its positioned ancestor (the link)
      const candidate = event.target && event.target.offsetParent;

      // ensure we actually hit a book cover link
      if (!candidate || !candidate.classList.contains('book__image')) return;

      const cover = candidate;                 // <a class="book__image" ...>
      const id = cover.dataset.id;             // book id from data-id

      // toggle favorite state
      if (cover.classList.contains('favorite')) {
        // remove from favorites
        cover.classList.remove('favorite');

        const index = favoriteBooks.indexOf(id);
        if (index !== -1) favoriteBooks.splice(index, 1);
      } else {
        // add to favorites
        cover.classList.add('favorite');

        if (id && !favoriteBooks.includes(id)) {
          favoriteBooks.push(id);
        }
      }

      // (optional) debug:
      // console.log('favoriteBooks:', favoriteBooks);
    });
  }

  // run after DOM is ready: render first, then bind actions
  document.addEventListener('DOMContentLoaded', () => {
    render();
    initActions();
  });
})();

