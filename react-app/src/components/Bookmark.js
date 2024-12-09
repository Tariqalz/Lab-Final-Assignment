import React, { useState, useEffect } from "react";
import axios from "axios";
import './Bookmark.css';

const Bookmark = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [title, setTitle] = useState("");
  const [link, setLink] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editLink, setEditLink] = useState("");

  // create
  const addBookmark = async (e) => {
    e.preventDefault();
    if (!title || !link) {
      alert("Title and link are required");
      return;
    }
    try {
      await axios.post("http://localhost:3000/api/create.php", {
        title,
        link,
      });
      setTitle("");
      setLink("");
      fetchBookmarks();
    } catch (error) {
      console.error("Error creating bookmark:", error);
    }
  };

  // readAll
  const fetchBookmarks = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/readAll.php");
      setBookmarks(response.data);
    } catch (error) {
      console.error("Error in readAll bookmarks:", error);
    }
  };

  //update
  const updateBookmark = async (e) => {
    e.preventDefault();
    if (!editTitle || !editLink) {
      alert("title and link are required");
      return;
    }
    try {
      await axios.put("http://localhost:3000/api/update.php", {
        id: editId,
        title: editTitle,
        link: editLink,
      });
      setEditId(null);
      fetchBookmarks();
    } catch (error) {
      console.error("Error update bookmark:", error);
    }
  };


  // delete
  const deleteBookmark = async (id) => {
    try {
      await axios.delete("http://localhost:3000/api/delete.php", {
        data: { id },
      });
      fetchBookmarks();
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };


  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <div className="bookmark-container">
      <h1>Bookmarking App</h1>
      <form onSubmit={addBookmark}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="url"
          placeholder="Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button type="submit">Add Bookmark</button>
      </form>
      <h2>Bookmarks</h2>
      <ul>
        {Array.isArray(bookmarks) && bookmarks.length > 0 ? (
          bookmarks.map((bookmark) => (
            <li key={bookmark.id}>
              {editId === bookmark.id ? (
                <form onSubmit={updateBookmark}>

                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="New Title"
                  />

                  <input
                    type="url"
                    value={editLink}
                    onChange={(e) => setEditLink(e.target.value)}
                    placeholder="New Link"
                  />
                  <button type="submit">Update</button>
                  <button type="button" onClick={() => setEditId(null)}>
                    Cancel
                  </button>

                </form>
              ) : (
                <>
                  <div>
                    <a href={bookmark.link} target="_blank" rel="noopener noreferrer">
                      {bookmark.title} <span className="link">{bookmark.link}</span>
                    </a>
                  </div>
                  <div>
                    <button onClick={() => {
                      setEditId(bookmark.id);
                      setEditTitle(bookmark.title);
                      setEditLink(bookmark.link);
                    }}>
                      Edit
                    </button>

                    <button onClick={() => deleteBookmark(bookmark.id)}>Delete</button>
                  </div>
                </>
              )}
            </li>
          ))
        ) : (
          <p>No bookmarks</p>
        )}
      </ul>
    </div>
  );

};

export default Bookmark;
