const express = require("express");

const server = express();
server.use(express.json());

let requests = 0;

server.use(function(req, res, next) {
  requests++;
  console.log("Requests:", requests);
  next();
});

const projects = [];

function validateId(req, res, next) {
  const { id } = req.params;

  let project = projects.find(project => project.id === id);
  if (!project) {
    res.status(400).send({ error: "Project does not exist" });
  }

  return next();
}

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  if (id.trim() === "" || title.trim() === "") {
    res.status(400).send({ error: "Incomplete data" });
  }

  const project = { id, title, tasks: [] };
  projects.push(project);

  return res.send(project);
});

server.get("/projects", (req, res) => {
  return res.send(projects);
});

server.put("/projects/:id", validateId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  let project = projects.find(project => project.id === id);
  project.title = title;

  return res.send(project);
});

server.delete("/projects/:id", validateId, (req, res) => {
  const { id } = req.params;

  const project = projects.find(project => project.id === id);
  projects.slice(projects.indexOf(project), 1);

  return res.status(204).send();
});

server.post("/projects/:id/task", validateId, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => project.id === id);
  project.tasks.push(title);

  return res.send(project);
});

const port = process.env.PORT || 3333;
server.listen(port, () => {
  console.log(`Server is running port ${port}`);
});
