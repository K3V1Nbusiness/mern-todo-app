import axios from "axios";
import { useState, useEffect } from "react";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

export default function App() {
  const [todos, setTodos] = useState([]);

  const fetchtodos = () => {
    axios
      .get("http://localhost:3000/api/todos")
      .then((response) => setTodos(response.data))
      .catch((error) => console.error("Error fetching todos:", error));
  };

  useEffect(() => {
    fetchtodos();
  }, []);

  

  return (
    <div className="p-2">
      <TodoForm todos={todos} setTodos={setTodos} />
      <TodoList todos={todos} setTodos={setTodos} fetchtodos={fetchtodos} />
    </div>
  );
}



