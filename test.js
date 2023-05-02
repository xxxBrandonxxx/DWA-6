// Import necessary data
import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'

// Set up initial state
let page = 1;
let matches = books
const starting = document.createDocumentFragment()
for (const { author, id, image, title } of matches.slice(0, BOOKS_PER_PAGE)) {
    // Create a button element for each book and append it to the starting document fragment
    const element = document.createElement('button')
    // Add class and data attributes to the button element
    // Set the innerHTML of the button element
    starting.appendChild(element)
}

// Set up the dropdown menus for genres and authors
const genreHtml = document.createDocumentFragment()
for (const [id, name] of Object.entries(genres)) {
    // Create an option element for each genre and append it to the genre document fragment
    const element = document.createElement('option')
    // Add value and text to the option element
    genreHtml.appendChild(element)
}
// Append the genre document fragment to the page

const authorsHtml = document.createDocumentFragment()
for (const [id, name] of Object.entries(authors)) {
    // Create an option element for each author and append it to the authors document fragment
    const element = document.createElement('option')
    // Add value and text to the option element
    authorsHtml.appendChild(element)
}
// Append the authors document fragment to the page

// Determine the color scheme of the app based on the user's preferences
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    // Set the color scheme to dark mode
} else {
    // Set the color scheme to light mode
}

// Set up event listeners for different buttons and forms
document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    // Close the search overlay
})

document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    // Close the settings overlay
})

document.querySelector('[data-header-search]').addEventListener('click', () => {
    // Open the search overlay
})

document.querySelector('[data-header-settings]').addEventListener('click', () => {
    // Open the settings overlay
})

document.querySelector('[data-list-close]').addEventListener('click', () => {
    // Close the active list
})

document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    // Prevent the default form submission behavior
    // Get the form data
    // Set the color scheme based on the user's preferences
    // Close the settings overlay
})

document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    // Prevent the default form submission behavior
    // Get the form data
    // Filter the books based on user input
})
// A function that takes an array of book objects and a page number, and displays a subset of those books on the page
function displayBooks(books, page) {
    // Calculate the start and end index of the books to display on the current page
    const startIndex = (page - 1) * BOOKS_PER_PAGE;
    const endIndex = startIndex + BOOKS_PER_PAGE;

    // Select the DOM elements we need to update
    const listMessage = document.querySelector('[data-list-message]');
    const listItems = document.querySelector('[data-list-items]');
    const listButton = document.querySelector('[data-list-button]');

    // Slice the books array to get the subset of books to display on the current page
    const booksToDisplay = books.slice(startIndex, endIndex);

    // Update the display of the list message based on whether there are any books to display
    if (booksToDisplay.length < 1) {
        listMessage.classList.add('list__message_show');
    } else {
        listMessage.classList.remove('list__message_show');
    }

    // Clear the list items container and create a new document fragment to hold the new items
    listItems.innerHTML = '';
    const newItemsFragment = document.createDocumentFragment();

    // Loop through the books to display and create a new button element for each one
    for (const book of booksToDisplay) {
        const { id, title, author, image } = book;
        const buttonElement = createButtonElement(id, title, author, image);
        newItemsFragment.appendChild(buttonElement);
    }

    // Append the new button elements to the list items container
    listItems.appendChild(newItemsFragment);

    // Disable the show more button if there are no more books to display
    listButton.disabled = endIndex >= books.length;

    // Update the display of the show more button to show how many books are left to display
    const booksRemaining = books.length - endIndex;
    const booksRemainingText = `(${booksRemaining > 0 ? booksRemaining : 0})`;
    listButton.innerHTML = `<span>Show more</span><span class="list__remaining">${booksRemainingText}</span>`;

    // Scroll to the top of the page and close the search overlay
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector('[data-search-overlay]').open = false;
}

// A function that creates a new button element for a book
function createButtonElement(id, title, author, image) {
    const buttonElement = document.createElement('button');
    buttonElement.classList = 'preview';
    buttonElement.setAttribute('data-preview', id);

    buttonElement.innerHTML = `
        <img class="preview__image" src="${image}" />
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${author}</div>
        </div>
    `;

    return buttonElement;
}
// Abstracted function to create the book preview element
function createBookPreviewElement(book) {
    const element = document.createElement('button')
    element.classList = 'preview'
    element.setAttribute('data-preview', book.id)

    element.innerHTML = `
        <img
            class="preview__image"
            src="${book.image}"
        />
        
        <div class="preview__info">
            <h3 class="preview__title">${book.title}</h3>
            <div class="preview__author">${authors[book.author]}</div>
        </div>
    `

    return element
}

// Abstracted function to add a list of book previews to the DOM
function addBookPreviewsToDOM(books) {
    const fragment = document.createDocumentFragment()

    for (const book of books) {
        const element = createBookPreviewElement(book)
        fragment.appendChild(element)
    }

    document.querySelector('[data-list-items]').appendChild(fragment)
}

// Abstracted function to handle "show more" button click
function handleShowMoreClick(matches, page) {
    const fragment = document.createDocumentFragment()

    for (const book of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
        const element = createBookPreviewElement(book)
        fragment.appendChild(element)
    }

    document.querySelector('[data-list-items]').appendChild(fragment)
    page += 1

    return page
}

// Abstracted function to handle book preview click
function handleBookPreviewClick(event) {
    const pathArray = Array.from(event.path || event.composedPath())
    let active = null

    for (const node of pathArray) {
        if (active) break

        if (node?.dataset?.preview) {
            let result = null
    
            for (const book of books) {
                if (result) break;
                if (book.id === node?.dataset?.preview) result = book
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
}

// Add event listener to "show more" button
document.querySelector('[data-list-button]').addEventListener('click', () => {
    page = handleShowMoreClick(matches, page)
    document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) < 1

    document.querySelector('[data-list-button]').innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
    `
})

// Add event listener to book previews
document.querySelector('[data-list-items]').addEventListener('click', handleBookPreviewClick)
