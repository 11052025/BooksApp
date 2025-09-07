/* global Handlebars, dataSource, utils */

(() => {
  'use strict';

  class BooksList {
    constructor() {
      // state
      this.data = [];
      this.favoriteIds = new Set();   // e.g. {"1","3"}
      this.activeFilters = new Set(); // e.g. {"adults","nonFiction"}

      // caches
      this.coversById = new Map();    // id -> <a.book__image>
      this.itemsById  = new Map();    // id -> <li.book>

      // templates holder
      this.templates = {};

      // bootstrap
      this.initData();
      this.getElements();
      this.initTemplates();
      this.render();
      this.initActions();
      this.applyFilters(); // reflect pre-checked inputs if any
    }

    // ---- data ----
    initData() {
      // keep a direct copy of books array
      this.data = dataSource.books;
    }

    // ---- DOM refs ----
    getElements() {
      this.dom = {};
      this.dom.list = document.querySelector('.books-list');
      this.dom.form = document.querySelector('.filters form');
    }

    // ---- templates ----
    initTemplates() {
      const tplNode = document.querySelector('#template-book');
      this.templates.book = Handlebars.compile(tplNode.innerHTML);
    }

    // ---- helpers ----
    determineRatingBgc(rating) {
      if (rating < 6) {
        return 'linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%)'; // yellow
      } else if (rating <= 8) {
        return 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)'; // light green
      } else if (rating <= 9) {
        return 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)'; // dark green
      }
      return 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)';     // pink
    }

    bookMatchesFilters(book) {
      // every active filter must be true on book.details
      for (const f of this.activeFilters) {
        if (!book.details[f]) return false;
      }
      return true;
    }

    // ---- render ----
    render() {
      const list = this.dom.list;
      list.innerHTML = ''; // defensive clear

      for (const book of this.data) {
        // compute rating visuals
        const ratingBgc = this.determineRatingBgc(book.rating);
        const ratingWidth = Math.max(0, Math.min(100, book.rating * 10)); // clamp 0..100

        // prepare view model
        const view = Object.assign({}, book, {
          ratingBgc,
          ratingWidth,
        });

        // create DOM and cache refs
        const html = this.templates.book(view);
        const li = utils.createDOMFromHTML(html);
        const cover = li.querySelector('.book__image');

        this.itemsById.set(String(book.id), li);
        this.coversById.set(String(book.id), cover);

        list.appendChild(li);
      }
    }

    // ---- UI actions ----
    initActions() {
      // favorites via double click (event delegation on the list)
      this.dom.list.addEventListener('dblclick', (e) => {
        e.preventDefault();
        const cover = e.target.closest('.book__image');
        if (!cover || !this.dom.list.contains(cover)) return;

        const id = cover.dataset.id;
        if (!id) return;
        this.toggleFavorite(id);
      });

      // filters via change event on the form (works with labels)
      this.dom.form.addEventListener('change', (e) => {
        const input = e.target;
        if (!input.matches('input[name="filter"][type="checkbox"]')) return;

        const value = input.value;     // "adults" | "nonFiction"
        const checked = input.checked;

        if (checked) this.activeFilters.add(value);
        else this.activeFilters.delete(value);

        this.applyFilters();
      });
    }

    toggleFavorite(id) {
      const cover = this.coversById.get(String(id));
      if (!cover) return;

      if (this.favoriteIds.has(String(id))) {
        this.favoriteIds.delete(String(id));
        cover.classList.remove('favorite');
      } else {
        this.favoriteIds.add(String(id));
        cover.classList.add('favorite');
      }
    }

    applyFilters() {
      for (const book of this.data) {
        const matches = this.bookMatchesFilters(book);
        const li = this.itemsById.get(String(book.id));
        if (li) {
          li.classList.toggle('hidden', !matches); // gray out whole tile
        }
      }
    }
  }

  // single app instance
  // eslint-disable-next-line no-unused-vars
  const app = new BooksList();
})();











