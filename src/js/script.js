/* global Handlebars, dataSource, utils */

(() => {
  'use strict';

  // selectors
  const select = {
    template: '#template-book',
    list: '.books-list',
  };

  // precompiled Handlebars template
  const templateBook = Handlebars.compile(
    document.querySelector(select.template).innerHTML
  );

  // render function
  function render() {
    const list = document.querySelector(select.list);

    // loop through all books
    for (const book of dataSource.books) {
      // generate HTML using template and book data
      const html = templateBook(book);

      // convert HTML string into DOM element
      const element = utils.createDOMFromHTML(html);

      // append element to the list
      list.appendChild(element);
    }
  }

  // run render when DOM is ready
  document.addEventListener('DOMContentLoaded', render);
})();
