/* global Handlebars, dataSource, utils */

(() => {
  'use strict';

  // selectors
  const select = {
    template: '#template-book',
    list: '.books-list',
    image: '.book__image',
    item: '.book',
    filtersForm: '.filters form',
  };

  // compile template once
  const templateNode = document.querySelector(select.template);
  const templateBook = Handlebars.compile(templateNode.innerHTML);

  // state
  const favoriteIds = new Set();     // favorites: string IDs
  const activeFilters = new Set();   // "adults" | "nonFiction"

  // cache: id -> DOM node
  const coversById = new Map();      // id -> <a.book__image>
  const itemsById  = new Map();      // id -> <li.book>

  // determine rating background by thresholds
  function determineRatingBgc(rating) {
    if (rating < 6) {
      return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)'; // yellow
    } else if (rating <= 8) {
      return 'linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%)'; // light green
    } else if (rating <= 9) {
      return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)'; // dark green
    } else {
      return 'linear-gradient(to bottom, #ff0084 0%,#ff0084 100%)'; // pink
    }
  }

  // ----- render -----
  function render() {
    const list = document.querySelector(select.list);
    list.innerHTML = ''; // clear defensively

    for (const book of dataSource.books) {
      // compute rating visuals
      const ratingBgc = determineRatingBgc(book.rating);
      const ratingWidth = Math.max(0, Math.min(100, book.rating * 10));

      // pass extended data to template
      const view = Object.assign({}, book, {
        ratingBgc,
        ratingWidth,
      });

      const html = templateBook(view);
      const li = utils.createDOMFromHTML(html);

      const cover = li.querySelector(select.image);
      coversById.set(String(book.id), cover);
      itemsById.set(String(book.id), li);

      list.appendChild(li);
    }
  }

  // ----- favorites -----
  function toggleFavorite(id) {
    const cover = coversById.get(String(id));
    if (!cover) return;

    if (favoriteIds.has(String(id))) {
      favoriteIds.delete(String(id));
      cover.classList.remove('favorite');
    } else {
      favoriteIds.add(String(id));
      cover.classList.add('favorite');
    }
  }

  // ----- filters -----
  function bookMatchesFilters(book) {
    for (const f of activeFilters) {
      if (!book.details[f]) return false; // every active filter must be true
    }
    return true;
  }

  function applyFilters() {
    for (const book of dataSource.books) {
      const matches = bookMatchesFilters(book);
      const id = String(book.id);

      const item = itemsById.get(id);
      if (item) {
        item.classList.toggle('hidden', !matches);
      }
    }
  }

  // ----- events (delegation) -----
  function initActions() {
    const list = document.querySelector(select.list);
    const form = document.querySelector(select.filtersForm);

    // favorites: double-click on a cover (or its children)
    list.addEventListener('dblclick', (e) => {
      e.preventDefault();
      const cover = e.target.closest(select.image);
      if (!cover || !list.contains(cover)) return;

      const id = cover.dataset.id;
      if (!id) return;

      toggleFavorite(id);
    });

    // filters: react to checkbox changes
    form.addEventListener('change', (e) => {
      const input = e.target;
      if (!input.matches('input[name="filter"][type="checkbox"]')) return;

      const value = input.value;
      const checked = input.checked;

      if (checked) activeFilters.add(value);
      else activeFilters.delete(value);

      applyFilters();
    });
  }

  // ----- bootstrap -----
  document.addEventListener('DOMContentLoaded', () => {
    render();
    initActions();
    applyFilters(); // reflect pre-checked inputs if any
  });
})();










