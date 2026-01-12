import React, { useEffect, useState } from 'react';

const API_URL = 'http://localhost:3001/books';

function App() {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    fetchBooks();
  }, []);

  function fetchBooks() {
    fetch(API_URL)
      .then(res => res.json())
      .then(setBooks);
  }

  function addBook(e) {
    e.preventDefault();
    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, author })
    })
      .then(res => res.json())
      .then(book => {
        setBooks([...books, book]);
        setTitle("");
        setAuthor("");
      });
  }

  function deleteBook(id) {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(() => setBooks(books.filter(b => b.id !== id)));
  }

  return (
    <div>
      <h1>图书管理系统</h1>
      <form onSubmit={addBook}>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="书名" required />
        <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="作者" required />
        <button>添加</button>
      </form>
      <ul>
        {books.map(book => (
          <li key={book.id}>
            《{book.title}》 by {book.author}
            <button onClick={() => deleteBook(book.id)}>删除</button>
            {/* 可以加上“修改”功能，如有需要再补充 */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
