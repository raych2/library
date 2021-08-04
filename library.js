window.onload = function () {
  const currentLibrary = document.querySelector(".current");
  const form = document.querySelector(".modal-form");
  const newBookForm = document.getElementById("newBookForm");
  const addBtn = document.querySelector(".add-btn");
  const cancelBtn = document.querySelector(".cancel-btn");

  //retrieve from localStorage
  let myLibrary = JSON.parse(localStorage.getItem("myLibrary")) || [];

  displayBook();

  class Book {
    constructor(title, author, pages, read) {
      this.title = title;
      this.author = author;
      this.pages = pages;
      this.read = read;
    }
  }

  function generateElement(element, elemTxt, className) {
    let newEl = document.createElement(element);
    if (typeof elemTxt === "number") {
      newEl.textContent = `${elemTxt} pages`;
    } else {
      newEl.textContent = elemTxt;
    }
    newEl.classList.add(className);
    return newEl;
  }

  function addBookToLibrary(book) {
    myLibrary.push(book);
    //save to local storage
    localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
  }

  function clearCurrentLibrary() {
    currentLibrary.innerHTML = "";
  }

  function displayBook() {
    myLibrary.forEach((book, index) => {
      let bookCard = document.createElement("div");
      bookCard.style.backgroundColor = "#C9ADA7";
      bookCard.classList.add("bc");
      bookCard.dataset.order = index;
      let bcTitle = generateElement("div", book.title, "bcT");
      let bcAuthor = generateElement("div", book.author, "bcA");
      let bcPages = generateElement("div", book.pages, "bcP");
      let bcRead = generateElement("div", book.read, "bcR");
      let removeBtn = generateElement("button", "X", "remove");
      let updateBtn = generateElement("button", "Update Read Status", "update");
      bookCard.append(removeBtn);
      bookCard.append(bcTitle);
      bookCard.append(bcAuthor);
      bookCard.append(bcPages);
      bookCard.append(bcRead);
      bookCard.append(updateBtn);
      currentLibrary.append(bookCard);
      removeBtn.addEventListener("click", removeBook);
      updateBtn.addEventListener("click", isRead);
    });
  }

  function removeBook(e) {
    if (auth.currentUser) {
      let title = e.target.parentNode.querySelector(".bcT");
      removeBookFromDB(title.innerText);
    } else {
      let index = e.target.parentNode.dataset.order;
      myLibrary.splice(index, 1);
      localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
    }
    clearCurrentLibrary();
    displayBook();
  }

  function isRead(e) {
    let status = e.target.parentNode.querySelector(".bcR");
    if (auth.currentUser) {
      let title = e.target.parentNode.querySelector(".bcT");
      changeReadStatus(status.innerText, title.innerText);
    } else {
      let index = e.target.parentNode.dataset.order;
      let book = myLibrary[index];
      if (book.read === "Read") {
        book.read = "Not Yet Read";
        status.innerText = "Not Yet Read";
      } else {
        book.read = "Read";
        status.innerText = "Read";
      }
      localStorage.setItem("myLibrary", JSON.stringify(myLibrary));
    }
  }

  function openForm(e) {
    newBookForm.style.display = "block";
  }

  function closeForm(e) {
    newBookForm.style.display = "none";
  }

  addBtn.addEventListener("click", openForm);
  cancelBtn.addEventListener("click", closeForm);

  window.onclick = function (e) {
    if (e.target === newBookForm) {
      newBookForm.style.display = "none";
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nbTitle = document.getElementById("title").value;
    const nbAuthor = document.getElementById("author").value;
    const nbPages = document.getElementById("pages").value;
    let nbRead = document.getElementById("read");
    let readStatus = '';

    if (nbRead.checked) {
      readStatus = "Read";
    } else {
      readStatus = "Not Yet Read";
    }

    const newBook = new Book(nbTitle, nbAuthor, nbPages, readStatus);
    if (auth.currentUser) {
      addBookToDB(newBook);
    } else {
      addBookToLibrary(newBook);
      clearCurrentLibrary();
      displayBook();
    }
    form.reset();
  });

  //add auth and firestore
  const auth = firebase.auth();
  const db = firebase.firestore();
  const login = document.querySelector(".login-btn");
  const logout = document.querySelector(".logout-btn");
  logout.style.display = "none";

  const signIn = (e) => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  const signOut = (e) => {
    auth.signOut();
  };
  const initFirebaseAuth = () => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        getRealTimeUpdate();
        login.style.display = "none";
        logout.style.display = "block";
      } else {
        // user signed out. switch to localStorage
        myLibrary = JSON.parse(localStorage.getItem("myLibrary")) || [];
        clearCurrentLibrary();
        displayBook();
        login.style.display = "block";
        logout.style.display = "none";
      }
    });
  };
  const getRealTimeUpdate = () => {
    db.collection("books")
      .where("ownerId", "==", auth.currentUser.uid)
      .onSnapshot((snapshot) => {
        myLibrary = getBookFromDoc(snapshot.docs);
        clearCurrentLibrary();
        displayBook();
      });
  };
  const addBookToDB = (newBook) => {
    db.collection("books").add(getDocFromBook(newBook));
  };
  const removeBookFromDB = (title) => {
    let title_query = db.collection("books").where("title", "==", title);
    title_query.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
  };
  const changeReadStatus = (read, title) => {
    let title_query = db.collection("books").where("title", "==", title);
    title_query.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        if (read === "Read") {
          doc.ref.update({ read: "Not Yet Read" });
        } else {
          doc.ref.update({ read: "Read" });
        }
      });
    });
  };
  const getBookFromDoc = (docs) => {
    return docs.map((doc) => {
      let data = doc.data();
      return new Book(data.title, data.author, data.pages, data.read);
    });
  };
  const getDocFromBook = (book) => {
    return {
      ownerId: auth.currentUser.uid,
      title: book.title,
      author: book.author,
      pages: book.pages,
      read: book.read,
    };
  };

  login.addEventListener("click", signIn);
  logout.addEventListener("click", signOut);
  initFirebaseAuth();
};
