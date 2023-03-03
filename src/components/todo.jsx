import React, { useEffect, useState } from "react";
import "../components/todo.css";
import axios from "axios";

function Todo() {
  const [itemText, setItemText] = useState("");
  const [listItem, setListItem] = useState([]);
  const [isUpdating, setIsUpdating] = useState("");
  const [editItemText, setEditItemText] = useState("");

  const addItem = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("http://localhost:8080/todo", {
        item: itemText,
      });
      console.log(result);
      setItemText("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getItem();
  }, [itemText]);

  const getItem = async () => {
    try {
      const result = await axios.get("http://localhost:8080/todo");
      setListItem(result.data.todo);
      //   console.log("render");
    } catch (error) {
      console.log(error);
    }
  };

  const deleteItem = async (id) => {
    try {
      const result = await axios.delete(`http://localhost:8080/todo/${id}`);
      console.log(result.data);
      const newList = listItem.filter((item) => item._id !== id);
      setListItem(newList);
    } catch (error) {
      console.log(error);
    }
  };

  const editItem = async(e)=>{
    e.preventDefault()
    try {
        const result = await axios.put(`http://localhost:8080/todo/${isUpdating}`, {item : editItemText});
        console.log(result.data);
        const updated = listItem.findIndex((item) => item._id === isUpdating);
        const updatedItem = listItem[updated].item=editItemText
        setEditItemText("")
        setIsUpdating("")
        
    } catch (error) {
        console.log(error);
    }
  }

  const renderEditForm = () => {
    return (
      <form className="edit-form">
        <input
          type="text"
          placeholder="Edit item..."
          className="add-todo"
          onChange={e=>{setEditItemText(e.target.value)}} value={editItemText}
        />
        <button className="edit-button" onClick={(e)=>{editItem(e)}}>Update</button>
      </form>
    );
  };

  return (
    <>
      <h1>Todo Application</h1>
      <div className="container">
        <form>
          <input
            type="text"
            placeholder="Add something..."
            className="add-todo"
            onChange={(e) => {
              setItemText(e.target.value);
            }}
            value={itemText}
          />
          <button className="submit-button" onClick={(e) => addItem(e)}>
            Add
          </button>
        </form>

        <div className="todo-list">
          {listItem?.map((items, id) => {
            return (
              <div className="todo-items" key={id}>
                {isUpdating === items._id ? (
                  renderEditForm()
                ) : (
                  <>
                    <p className="item-content">{items.item}</p>
                    <button
                      className="edit-button"
                      onClick={() => {
                        setIsUpdating(items._id);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-button"
                      onClick={() => {
                        deleteItem(items._id);
                      }}
                    >
                      Remove
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default Todo;
