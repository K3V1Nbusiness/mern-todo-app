import { useRef, useState } from "react";
import axios from "axios";

export default function TodoForm({ todos, setTodos }) {
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  const submitHandler = (e) => {
    e.preventDefault();
    if(!titleRef.current.value.trim() || !descriptionRef.current.value.trim()) {
        return alert("Both fields(*) are required");
    }
    const newTodo = {
        title: titleRef.current.value.trim(),
        description: descriptionRef.current.value.trim()
    }

    axios.post(`http://localhost:3000/api/todos`, newTodo)
    .then(response => {
        setTodos([...todos,response.data])
        titleRef.current.value = "";
        descriptionRef.current.value = "";
    })


  }

  return (
      <form onSubmit={submitHandler}>
        <div className="flex my-2">
          <input
            className="p-2 border"
            ref={titleRef}
            type="text"
            name="title"
            id="titleElement"
            placeholder="Title*"
          />
          <input
            className="p-2 mx-2 border"
            ref={descriptionRef}
            type="text"
            name="description"
            id="descriptionElement"
            placeholder="description"
          />
          <button 
          className="text-white bg-green-500 hover:bg-green-600 px-3 py-1"
          type="submit">Add</button>
        </div>
      </form>
  );
}
