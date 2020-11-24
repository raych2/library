const currentLibrary = document.querySelector('.current');
const form = document.getElementById("#new-book");
const newBook = document.createElement('div');
const addBtn = document.querySelector(".add");

let book1 = {
    title: 'Lord of the Rings',
    author: 'J. R. R. Tolkien',
    pages: 1216,
    read: 'Not Yet Read'
};

let book2 = {
    title: 'Becoming',
    author: 'Michelle Obama',
    pages: 448,
    read: 'Read'
};

const myLibrary = [book1, book2];

function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

function addBookToLibrary(book) {
    myLibrary.push(book);
    return myLibrary;
}

function generateElement(element, elemTxt, className) {
    let newEl = document.createElement(element);
    newEl.textContent = elemTxt;
    newEl.classList.add(className);
    return newEl;
}

function displayBook(myLibrary) {
    myLibrary.forEach(book => {
        let bookCard = document.createElement('div');
        bookCard.style.backgroundColor = '#C0A9B0';
        bookCard.classList.add('bc');
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

displayBook(myLibrary);