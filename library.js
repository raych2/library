const currentLibrary = document.querySelector('.current');
const form = document.getElementById('new-book');
const addBtn = document.querySelector('.add-btn');
const cancelBtn = document.querySelector('.cancel-btn');

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

Book.prototype.info = function() {
    console.log(`${this.title} by ${this.author}\n${this.pages} pages\n${this.read}`);
    return `${this.title} by ${this.author}\n${this.pages} pages\n${this.read}`;
}

function generateElement(element, elemTxt, className) {
    let newEl = document.createElement(element);
    newEl.textContent = elemTxt;
    newEl.classList.add(className);
    return newEl;
}

function addBookToLibrary(book) {
    myLibrary.push(book);
    return myLibrary;
}

function createBookCard(book) {
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
    return bookCard;
}


function displayBook() {
    myLibrary.forEach(book => {
        let bcard = createBookCard(book);
        currentLibrary.append(bcard);
    });
}

let normalPeople = new Book("Normal People", "Sally Rooney", 235, "Read");
console.log(normalPeople.info);
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
    const nbRead = document.getElementById('read').value;

    let newBook = new Book(nbTitle, nbAuthor, nbPages, nbRead);
    addBookToLibrary(newBook);
    let nBookCard = createBookCard(newBook);
    currentLibrary.append(nBookCard);
    console.log(myLibrary);
    form.reset();
});