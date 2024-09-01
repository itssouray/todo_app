import { useEffect, useState } from "react";
import Todo from "./Todo";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    async function getTodos() {
      const res = await fetch(`${process.env.URL}/api/todos/get`);
      const todos = await res.json();

      setTodos(todos);
    }
    getTodos();
  }, []);

  const createNewTodo = async (e) => {
    e.preventDefault();
    if (content.length > 3) {
      const res = await fetch(`${process.env.URL}/api/todos/add`, {
        method: "POST",
        body: JSON.stringify({ todo: content }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newTodo = await res.json();

      setContent("");
      setTodos([...todos, newTodo]);
    }
  }

  return (
    <main className="container">
      <h1 className="title text-center text-[3rem] p-[1.2rem]">Todos App</h1>
      <form className="form" onSubmit={createNewTodo}>
        <input 
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter a new todo..."
        className="form__input flex-1 py-[0.5rem] px-[0.75rem] text-black"
        required 
        />
        <button className="form__button p-2 bg-[#7100d4b3] rounded" type="submit">Create Todo</button>
      </form>
      <div className="todos">
        {(todos.length > 0) &&
          todos.map((todo) => (
            <Todo key={todo._id} todo={todo} setTodos={setTodos}   />
          ))
        }
      </div>
    </main>
  );
}
