const currentLibrary = document.querySelector('.current');
const form = document.getElementById('new-book');
const addBtn = document.querySelector('.add-btn');
const cancelBtn = document.querySelector('.cancel-btn');

const myLibrary = [];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function generateElement(element, elemTxt, className) {
    let newEl = document.createElement(element);
    if(typeof elemTxt === 'number' || elemTxt.match(/\d/)) {
        newEl.textContent = `${elemTxt} pages`;
    } else {
        newEl.textContent = elemTxt;
    }
    newEl.classList.add(className);
    return newEl;
}

function addBookToLibrary(book) {
    myLibrary.push(book);
    return myLibrary;
}

function clearCurrentLibrary() {
    currentLibrary.innerHTML = '';
}

function displayBook() {
    myLibrary.forEach((book, index) => {
        let bookCard = document.createElement('div');
        bookCard.style.backgroundColor = '#C0A9B0';
        bookCard.classList.add('bc');
        bookCard.setAttribute('data-order', index);
        let bcTitle = generateElement('div', book.title, 'bcT');
        let bcAuthor = generateElement('div', book.author, 'bcA');
        let bcPages = generateElement('div', book.pages, 'bcP');
        let bcRead = generateElement('div', book.read, 'bcR');
        bookCard.append(bcTitle);
        bookCard.append(bcAuthor);
        bookCard.append(bcPages);
        bookCard.append(bcRead);
        currentLibrary.append(bookCard);
    });
}

let normalPeople = new Book("Normal People", "Sally Rooney", 235, "Read");
let btwm = new Book("Between the World and Me", "Ta-Nehisi Coates", 163, "Not Yet Read");

addBookToLibrary(normalPeople);
addBookToLibrary(btwm);

displayBook();

function openForm(e) {
    document.getElementById('newBookForm').style.display = 'block';
}

function closeForm(e) {
    document.getElementById('newBookForm').style.display = 'none';
}

addBtn.addEventListener('click', openForm);
cancelBtn.addEventListener('click', closeForm);

form.addEventListener('submit', (e) => {
    event.preventDefault();

    const nbTitle = document.getElementById('title').value;
    const nbAuthor = document.getElementById('author').value;
    const nbPages = document.getElementById('pages').value;
    const readCheck = document.querySelector('input[value="read"]');
    let nbRead = '';

    if(readCheck.checked) {
        nbRead = 'Read';
    } else {
        nbRead = 'Not Yet Read';
    }

    const newBook = new Book(nbTitle, nbAuthor, nbPages, nbRead);
    addBookToLibrary(newBook);
    clearCurrentLibrary();
    displayBook();
    form.reset();
});