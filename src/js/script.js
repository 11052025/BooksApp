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
  if (!templateNode) {
    console.error('Template not found:', select.template);
    return;
  }
  const templateBook = Handlebars.compile(templateNode.innerHTML);

  // state
  const favoriteIds = new Set();     // favorites: string IDs
  const activeFilters = new Set();   // "adults" | "nonFiction"

  // cache: id -> DOM node
  const coversById = new Map();      // id -> <a.book__image>
  const itemsById  = new Map();      // id -> <li.book>

  // ----- render -----
  function render() {
    const list = document.querySelector(select.list);
    if (!list) {
      console.error('List not found:', select.list);
      return;
    }

    // clear (defensive)
    list.innerHTML = '';

    for (const book of dataSource.books) {
      const html = templateBook(book);
      const li = utils.createDOMFromHTML(html);

      const cover = li.querySelector(select.image);
      if (!cover) {
        console.error('Cover not found inside rendered item for id=', book.id);
      } else {
        coversById.set(String(book.id), cover);
      }
      itemsById.set(String(book.id), li);

      list.appendChild(li);
    }

    // basic info
    console.log(`Rendered ${dataSource.books.length} books.`);
  }

  // ----- favorites -----
  function toggleFavorite(id) {
    const cover = coversById.get(String(id));
    if (!cover) {
      console.warn('toggleFavorite: cover not found for id=', id);
      return;
    }

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
      if (!book.details[f]) return false;
    }
    return true;
  }

  function applyFilters() {
    let hiddenCount = 0;

    for (const book of dataSource.books) {
      const matches = bookMatchesFilters(book);
      const id = String(book.id);

      const cover = coversById.get(id);
      const item  = itemsById.get(id);

      if (cover) cover.classList.toggle('hidden', !matches);
      if (item)  item.classList.toggle('hidden', !matches);

      if (!matches) hiddenCount++;
    }

    console.log('applyFilters → active:', Array.from(activeFilters), 'hidden:', hiddenCount);
  }

  // ----- events (delegation) -----
  function initActions() {
    const list = document.querySelector(select.list);
    const form = document.querySelector(select.filtersForm);

    if (!list)  console.error('initActions: list not found', select.list);
    if (!form)  console.error('initActions: form not found', select.filtersForm);

    // dblclick on cover (or its children)
    list && list.addEventListener('dblclick', (e) => {
      e.preventDefault();
      const cover = e.target.closest(select.image);
      if (!cover || !list.contains(cover)) return;

      const id = cover.dataset.id;
      if (!id) {
        console.warn('dblclick: missing data-id on cover');
        return;
      }
      toggleFavorite(id);
    });

    // filter changes (works with label clicks)
    form && form.addEventListener('change', (e) => {
      const input = e.target;
      if (!input.matches('input[name="filter"][type="checkbox"]')) return;

      const value = input.value;       // "adults" | "nonFiction"
      const checked = input.checked;

      if (checked) activeFilters.add(value);
      else activeFilters.delete(value);

      applyFilters();
    });
  }

  // ----- bootstrap -----
  document.addEventListener('DOMContentLoaded', () => {
    console.log('BooksApp bootstrap…');
    render();
    initActions();

    // reflect pre-checked inputs if any:
    applyFilters();
  });
})();









