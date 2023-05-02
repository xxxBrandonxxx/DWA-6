/**
 * Importing data and setting up initial variables.
 *
 * @module
 */
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js';

let page = 1;
let matches = books;

const starting = document.createDocumentFragment();

/**
 * Generates the HTML for each book preview.
 *
 * @function
 * @param {Object} book - The book object containing information about the book.
 * @returns {string} The HTML for the book preview.
 */
function createBookPreviewHtml(book) {
  const { author, id, image, title } = book;
  return `
    <img class="preview__image" src="${image}" />
    <div class="preview__info">
      <h3 class="preview__title">${title}</h3>
      <div class="preview__author">${authors[author]}</div>
    </div>
  `;
}

/**
 * Renders the book previews on the page.
 */
for (const book of matches.slice(0, BOOKS_PER_PAGE)) {
  const element = document.createElement('button');
  element.classList = 'preview';
  element.setAttribute('data-preview', book.id);

  element.innerHTML = createBookPreviewHtml(book);

  starting.appendChild(element);
}

  
  /*// below i wrapped the code in a function*/
  function createListItems(starting, genres, authors) {
    const genreHtml = document.createDocumentFragment()
    const firstGenreElement = document.createElement('option')
    firstGenreElement.value = 'any'
    firstGenreElement.innerText = 'All Genres'
    genreHtml.appendChild(firstGenreElement)
  
    for (const [id, name] of Object.entries(genres)) {
      const element = document.createElement('option')
      element.value = id
      element.innerText = name
      genreHtml.appendChild(element)
    }
  
    document.querySelector('[data-search-genres]').appendChild(genreHtml)
  
    const authorsHtml = document.createDocumentFragment()
    const firstAuthorElement = document.createElement('option')
    firstAuthorElement.value = 'any'
    firstAuthorElement.innerText = 'All Authors'
    authorsHtml.appendChild(firstAuthorElement)
  
    for (const [id, name] of Object.entries(authors)) {
      const element = document.createElement('option')
      element.value = id
      element.innerText = name
      authorsHtml.appendChild(element)
    }
  
    document.querySelector('[data-search-authors]').appendChild(authorsHtml)
  
    document.querySelector('[data-list-items]').appendChild(starting)
  }
  
  // Usage:
  createListItems(starting, genres, authors)
  


// Used the Turnery operator in the code
//
const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
document.querySelector('[data-settings-theme]').value = isDarkMode ? 'night' : 'day';
document.documentElement.style.setProperty('--color-dark', isDarkMode ? '255, 255, 255' : '10, 10, 20');
document.documentElement.style.setProperty('--color-light', isDarkMode ? '10, 10, 20' : '255, 255, 255');


// wrapped all the querySelectors in an object
//good way of abstraction 
/**
 * wrapping querySelector calls in a function can make your code more maintainable. 
 * If you ever need to change the way elements are selected from the DOM,
 *  you can simply update the function implementation rather than searching through your 
 * codebase for every instance of querySelector.
 */

/**
 * @typedef {Object} Elements
 * @property {HTMLElement} listButton - The element representing the "Show more" button.
 * @property {HTMLElement} searchCancel - The element representing the cancel button in the search overlay.
 * @property {HTMLElement} settingsCancel - The element representing the cancel button in the settings overlay.
 * @property {HTMLElement} headerSearch - The element representing the search icon in the header.
 * @property {HTMLElement} headerSettings - The element representing the settings icon in the header.
 * @property {HTMLElement} listClose - The element representing the close button in the list overlay.
 */
// Displaying elements of the code:
/**
 * @type {Elements} 
 */
const elements = {
    listButton: document.querySelector('[data-list-button]'),
    searchCancel: document.querySelector('[data-search-cancel]'),
    settingsCancel: document.querySelector('[data-settings-cancel]'),
    headerSearch: document.querySelector('[data-header-search]'),
    headerSettings: document.querySelector('[data-header-settings]'),
    listClose: document.querySelector('[data-list-close]')
}

// Displaying elements of the code:

elements.listButton.innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
elements.listButton.disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0

elements.listButton.innerHTML = `
      <span>Show more</span>
      <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
  `

/**
 * Event listener for the search cancel button.
 * @function
 */
elements.searchCancel.addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false
})

/**
 * Event listener for the settings cancel button.
 * @function
 */
elements.settingsCancel.addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false
})

/**
 * Event listener for the header search button.
 * @function
 */
elements.headerSearch.addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = true
    document.querySelector('[data-search-title]').focus()
})

/**
 * Event listener for the header settings button.
 * @function
 */
elements.headerSettings.addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true
})

/**
 * Event listener for the list close button.
 * @function
 */
elements.listClose.addEventListener('click', () => {
    document.querySelector('[data-list-active]').open = false
})


// Added a Const settings for the form in an object
// i Think was a good way of abstraction then you can just call it as a function
const settingsForm = {
    form: document.querySelector('[data-settings-form]'),
    overlay: document.querySelector('[data-settings-overlay]'),
    addListener: function () {
        this.form.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(event.target);
            const { theme } = Object.fromEntries(formData);

            if (theme === 'night') {
                document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
                document.documentElement.style.setProperty('--color-light', '10, 10, 20');
            } else {
                document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
                document.documentElement.style.setProperty('--color-light', '255, 255, 255');
            }

            this.overlay.open = false;
        });
    }
};

// Call addListener() to attach the event listener to the form
settingsForm.addListener();


document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const result = []

    for (const book of books) {
        let genreMatch = filters.genre === 'any'

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) &&
            (filters.author === 'any' || book.author === filters.author) &&
            genreMatch
        ) {
            result.push(book)
        }
    }

    page = 1;
    matches = result

    //Used the ! operator instead of the if else
    //witch i think was bad Reason being
    /**
     * Using the ! operator in place of an if statement can be a form of abstraction in JavaScript, 
     * but it's important to consider the context in which you're using it and whether it makes your 
     * code more readable and maintainable.

   The ! operator is a logical NOT operator, which can be used to invert a boolean expression. 
    For example, instead of writing an if statement to check if a variable is falsy and then execute some code if it is,
     you can use the ! operator to check if the variable is truthy and execute the code if it is:
     */

     
    const listMessage = document.querySelector('[data-list-message]');
    listMessage.classList.toggle('list__message_show', !(result.length >= 1));


    document.querySelector('[data-list-items]').innerHTML = ''
    const newItems = document.createDocumentFragment()

    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)

        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        newItems.appendChild(element)
    }

    document.querySelector('[data-list-items]').appendChild(newItems)
    document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1

    document.querySelector('[data-list-button]').innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `

    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector('[data-search-overlay]').open = false
})

document.querySelector('[data-list-button]').addEventListener('click', () => {
    const fragment = document.createDocumentFragment()

    for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)

        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        fragment.appendChild(element)
    }

    document.querySelector('[data-list-items]').appendChild(fragment)
    page += 1
})

document.querySelector('[data-list-items]').addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath())
    let active = null

    for (const node of pathArray) {
        if (active) break

        if (node?.dataset?.preview) {
            let result = null

            for (const singleBook of books) {
                if (result) break;
                if (singleBook.id === node?.dataset?.preview) result = singleBook
            }

            active = result
        }
    }

    if (active) {
        document.querySelector('[data-list-active]').open = true
        document.querySelector('[data-list-blur]').src = active.image
        document.querySelector('[data-list-image]').src = active.image
        document.querySelector('[data-list-title]').innerText = active.title
        document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        document.querySelector('[data-list-description]').innerText = active.description
    }
})