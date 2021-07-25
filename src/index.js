const express = require("express");
const app = express();
const { v4: uuid } = require("uuid");
app.use(express.json());

const repositories = [];

class Repository {
  constructor(title, url, techs) {
    this.id = uuid();
    this.title = title;
    this.url = url;
    this.techs = techs;
    this.likes = 0;
  }
  set(title,url,techs) {
    this.title = title || this.title;
    this.url = url || this.url;
    this.techs = techs || this.techs;
  }
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  const repository = new Repository(title, url, techs)
  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs} = request.body;

  const repository = repositories.find(repository => repository.id === id);
  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }
  repository.set(title, url, techs)
  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(404).json({ error: "Repository not found" });
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(404).json({ error: "Repository not found" });
  }

  const likes = ++repository.likes;

  return response.json({ 
    likes: likes
  });
});

module.exports = app;
