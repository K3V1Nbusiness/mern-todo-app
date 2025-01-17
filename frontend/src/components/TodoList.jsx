import axios from "axios";
import { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faPen,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";

function TodoList({ todos, setTodos, fetchtodos }) {
  const [inputTitle, setInputTitle] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [allTodos, setAllTodos] = useState(todos);

  const searchInputRef = useRef(null);
  const debounceTimeout = useRef(null); // Keep track of the timeout
  useEffect(() => {
    setAllTodos(todos);
    console.log("todos ::>", todos);
  }, [todos]); // Triggered whenever `todos` changes

  console.log("allTodos ::>", allTodos);

  function handleClearSearch() {
    searchInputRef.current.value = "";
    fetchtodos();
  }
  function handleSearch(value) {
    if (!value) {
      fetchtodos();
      return;
    }
    const objKeys = ["title", "description"];
    const filteredTodos = todos.filter((todo) =>
      objKeys.some((key) =>
        todo[key]?.toLowerCase().includes(value.toLowerCase())
      )
    );

    setAllTodos(filteredTodos);
  }

  function handleInputChange(e) {
    const value = e.target.value;

    // Clear the previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set a new timeout
    debounceTimeout.current = setTimeout(() => {
      handleSearch(value);
    }, 300); // 300ms debounce delay
  }

  const handleCheckTodo = (e, id) => {
    axios
      .put(`http://localhost:3000/api/todos/${id}`, {
        isCompleted: e.target.checked,
      })
      .then(() => {
        fetchtodos();
      })
      .catch((error) => console.error("Error updating todo:", error));
  };

  const handlePinTodo = async (id, currentPinnedStatus) => {
    try {
      await axios.put(`http://localhost:3000/api/todos/${id}`, {
        isPinned: !currentPinnedStatus,
      });
      fetchtodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleUpdate = (id) => {
    const title = inputTitle.trim();
    const description = inputDescription.trim();

    if (!title || !description) {
      alert("Title and Description fields can't be empty!");
      return;
    }

    axios
      .put(`http://localhost:3000/api/todos/${id}`, { title, description })
      .then(() => {
        fetchtodos();
        setEditingId(null);
        setInputTitle("");
        setInputDescription("");
      })
      .catch((error) => console.error("Error updating todo:", error));
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:3000/api/todos/${id}`)
      .then(() => setTodos(todos.filter((todo) => todo._id !== id)))
      .catch((error) => console.error("Error deleting todo:", error));
  };

  return (
    <ul>
      <div className="flex space-x-4 mt-10">
        <div className="flex rounded-md overflow-hidden min-w-[80%] border border-indigo-600">
          <input
            type="text"
            className="px-4 py-2 w-full rounded-md outline-none"
            placeholder="Search Todo"
            ref={searchInputRef}
            onChange={handleInputChange}
          />
          {searchInputRef.current?.value && (
            <button
              className="text-red-500 px-5 text-lg font-semibold py-2 rounded-r-md"
              onClick={handleClearSearch}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>
      </div>

      {allTodos.map((todo) => (
        <li
          key={todo._id}
          className="flex items-center p-4 border-b border-gray-100 hover:bg-gray-100"
        >
          {editingId === todo._id ? (
            <div className="flex flex-col mr-auto">
              <input
                type="text"
                className="px-2 font-semibold text-lg border"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
              />
              <input
                type="text"
                className="px-2 text-gray-500 mt-1 border"
                value={inputDescription}
                onChange={(e) => setInputDescription(e.target.value)}
              />
            </div>
          ) : (
            <div className="flex items-start">
              <input
                type="checkbox"
                className="mr-2 p-2 mt-1 translate-y-1/2"
                checked={todo.isCompleted}
                onChange={(e) => handleCheckTodo(e, todo._id)}
              />
              <div className="flex flex-col">
                <span className="font-semibold text-lg">{todo.title}</span>
                <span className="text-gray-500 mt-1">{todo.description}</span>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 ml-auto">
            <button
              className={`${
                todo.isPinned
                  ? "bg-yellow-500 text-white"
                  : "text-yellow-500 border border-yellow-300"
              } font-medium py-1 px-3 hover:bg-yellow-300 hover:text-white rounded`}
              onClick={() => handlePinTodo(todo._id, todo.isPinned)}
            >
              {todo.isPinned ? "★" : "☆"}
            </button>
            {editingId === todo._id ? (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded"
                onClick={() => handleUpdate(todo._id)}
              >
                <FontAwesomeIcon icon={faFloppyDisk} />
              </button>
            ) : (
              <button
                className="text-green-500 border border-green-500 hover:bg-green-600 hover:text-white font-medium py-1 px-3 rounded"
                onClick={() => {
                  setEditingId(todo._id);
                  setInputTitle(todo.title);
                  setInputDescription(todo.description);
                }}
              >
                <FontAwesomeIcon icon={faPen} />
              </button>
            )}
            <button
              className="text-red-500 border border-red-500 hover:bg-red-600 hover:text-white font-medium py-1 px-3 rounded"
              onClick={() => handleDelete(todo._id)}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default TodoList;
