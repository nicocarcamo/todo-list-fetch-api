import React, { useState } from 'react';

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [todo, setTodo] = useState('');
    const [username, setUsername] = useState('');

    const handleChange = (event) => {
        setTodo(event.target.value);
    };

    const handleSubmitUser = (event) => {
        event.preventDefault();
        console.log(event);
        const inputFieldValue = event.target.elements.inputField.value;
        fetch(`https://assets.breatheco.de/apis/fake/todos/user/${inputFieldValue}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ todo: todo }),
        })
        event.target.reset();
    }

    const handleGetUser = (event) => {
        event.preventDefault();
        console.log(event);
        const inputFieldValue = event.target.elements.inputField.value;
        setUsername(inputFieldValue);
        fetch(`https://assets.breatheco.de/apis/fake/todos/user/${inputFieldValue}`)
            .then(response => response.json())
            .then(data => {
                setTodos(data);
            })
            .catch(error => console.log(error));
        event.target.reset();
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (todo.trim() !== '') {
            fetch(`https://assets.breatheco.de/apis/fake/todos/user/${username}`)
                .then(response => response.json())
                .then(data => {
                    const newTodos = [...data, { label: todo, done: false }];
                    fetch(`https://assets.breatheco.de/apis/fake/todos/user/${username}`, {
                        method: 'PUT',
                        body: JSON.stringify(newTodos),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);
                            setTodos(newTodos);
                            setTodo('');
                        })
                        .catch(error => console.log(error));
                })
                .catch(error => console.log(error));
        }
    };

    const handleDelete = (index) => {
        const newTodos = todos.filter((_, i) => i !== index);
        setTodos(newTodos);
        fetch(`https://assets.breatheco.de/apis/fake/todos/user/${username}`, {
            method: 'PUT',
            body: JSON.stringify(newTodos),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.result) {
                    console.log('Todo list updated successfully');
                } else {
                    console.error('Error updating todo list:', data.message);
                }
            })
            .catch(error => console.log(error));
    };

    const handleDeleteAll = () => {
        fetch(`https://assets.breatheco.de/apis/fake/todos/user/${username}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'ok') {
                    console.log('User and todo list deleted successfully');
                    setTodos([]);
                } else {
                    console.error('Error deleting user and todo list:', data.message);
                }
            })
            .catch(error => console.log(error));
    };

    return (
        <div className="container mt-5">
            <h1 className="todos-title text-center mb-5">TODOS</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        name="inputField"
                        className="form-control"
                        id="todo"
                        placeholder='What needs to be done?'
                        value={todo}
                        onChange={handleChange}
                    />
                </div>
            </form>
            <ul className="list-group mt-5">
                {todos.length === 0 ? (
                    <li className="list-group-item text-center">No tasks, add a task.</li>
                ) : (
                    todos.map((todo, index) => (
                        <li
                            key={index}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            {todo.label}
                            <button
                                type="button"
                                className="btn-close delete-button"
                                onClick={() => handleDelete(index)}
                            >
                            </button>
                        </li>
                    ))
                )}
            </ul>
            <button type="button" className="btn btn-danger mt-3 mb-5" onClick={handleDeleteAll}>
                Delete User & Todos
            </button>

            <form className="d-flex my-2" onSubmit={handleSubmitUser}>
                <input className="form-control user-input" type="text" name="inputField" id="inputField" placeholder="Enter new username..." />
                <button className="btn btn-secondary btn-sm ms-2" type="submit">Create New User</button>
            </form>
            <form className="d-flex my-2" onSubmit={handleGetUser}>
                <input className="form-control user-input" type="text" name="inputField" id="inputField" placeholder="Enter username..." />
                <button className="btn btn-secondary btn-sm ms-2" type="submit">Get User Todos List</button>
            </form>

        </div>
    );
}

export default TodoList;

