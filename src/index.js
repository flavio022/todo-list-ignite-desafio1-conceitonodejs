const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');
const { runCLI } = require('jest');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const userExist = users.find((user) => user.username === username);

  if (!userExist) {
    return response.status(404).json({ error: "User not found!" });
  }
  request.user = userExist;
  return next();
}

function checksIfUserAlreadyExists(request, response, next) {
  const { username } = request.body;

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: "user already exists!" });
  }

  return next();

}
function checkIfTaskExist(request, response, next) {
  const { user } = request;
  const { id } = request.params;
  const todo = user.todos.find((task) => task.id === id);
  if (!todo) {
    return response.status(404).json({ error: "task does not exists!" });
  }
  request.todo = todo;
  return next();
}

app.post('/users', checksIfUserAlreadyExists, (request, response) => {
  const { name, username } = request.body;

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user);

  return response.status(201).json(user);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const todos = user.todos;
  return response.status(201).json(todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { user } = request;
  const { title, deadline } = request.body;

  const task = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }

  user.todos.push(task);

  return response.status(201).json(task);

});

app.put('/todos/:id', checksExistsUserAccount, checkIfTaskExist, (request, response) => {
  // Complete aqui
  const { todo } = request;
  const { title, deadline } = request.body;
  todo.title = title;
  todo.deadline = deadline;


  return response.status(201).json(todo);

});

app.patch('/todos/:id/done', checksExistsUserAccount, checkIfTaskExist, (request, response) => {
  // Complete aqui
  const { todo } = request;

  todo.done = true;


  return response.status(201).json(todo);
});

app.delete('/todos/:id', checksExistsUserAccount, checkIfTaskExist, (request, response) => {
  // Complete aqui
  const { id } = request.params;
  const { user } = request;
  user.todos.splice(id, 1);
  return response.status(204).json(user);
});

module.exports = app;