import { useState, useEffect } from "react";
import { MdModeEdit, MdOutlineFileUpload, MdDelete } from "react-icons/md";

export default function Todo(props) {
  const { todo, setTodos } = props;
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(todo.todo);
  const [editStatus, setEditStatus] = useState(todo.status);

  useEffect(() => {
    setEditContent(todo.todo);
    setEditStatus(todo.status);
  }, [todo]);

  const updateTodo = async (todoId, newContent, newStatus) => {
    const res = await fetch(`${process.env.URL}/api/todos/update/${todoId}`, {
      method: "PUT",
      body: JSON.stringify({ todo: newContent, status: newStatus }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await res.json();
    if (json.acknowledged) {
      setTodos((currentTodos) =>
        currentTodos.map((currentTodo) => {
          if (currentTodo._id === todoId) {
            return { ...currentTodo, todo: newContent, status: newStatus };
          }
          return currentTodo;
        })
      );
      setIsEditing(false);
    }
  };

  const deleteTodo = async (todoId) => {
    const res = await fetch(`${process.env.URL}/api/todos/delete/${todoId}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (json.acknowledged) {
      setTodos((currentTodos) =>
        currentTodos.filter((currentTodo) => currentTodo._id !== todoId)
      );
    }
  };

  const saveEdit = () => {
    updateTodo(todo._id, editContent, editStatus);
  };

  return (
    <div className="todo flex flex-col sm:flex-row justify-between items-center bg-[#ffffff1a] hover:bg-[#ffffff33] w-full sm:w-[80%] md:w-[60%] lg:w-[50%] rounded shadow-md mt-2 p-3">
      {isEditing ? (
        <div className="flex flex-col sm:flex-row items-center w-full mb-2">
          <input
            type="text"
            value={editContent}
            placeholder="Edit your todo"
            onChange={(e) => setEditContent(e.target.value)}
            className="text-black border rounded px-2 py-1 w-full mb-2 sm:w-[60%] sm:mb-0 focus:outline-none focus:ring focus:border-blue-300"
          />
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={editStatus}
              onChange={(e) => setEditStatus(e.target.checked)}
              className="mr-2"
            />
            <label>{editStatus ? "Completed" : "Pending"}</label>
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center w-full">
          <p className={`flex-1 text-center sm:text-left ${todo.status ? "line-through text-gray-500" : ""}`}>
            {todo.todo}
          </p>
          <span className={`mt-2 sm:mt-0 sm:ml-4 text-sm px-2 ${todo.status ? "text-green-600" : "text-yellow-600"}`}>
            {todo.status ? "Completed" : "Pending"}
          </span>
        </div>
      )}
      <div className="mutations flex space-x-2 mt-2 sm:mt-0">
        {isEditing ? (
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={saveEdit}
          >
            <MdOutlineFileUpload fontSize={16} />
          </button>
        ) : (
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => setIsEditing(true)}
          >
            <MdModeEdit fontSize={16} />
          </button>
        )}
        <button
          className="text-red-600 hover:text-red-800 cursor-pointer"
          onClick={() => deleteTodo(todo._id)}
        >
          <MdDelete fontSize={16} />
        </button>
      </div>
    </div>
  );
}
