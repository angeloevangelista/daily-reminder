import "dotenv/config";

import fs from "fs";
import path from "path";
import cors from "cors";
import express from "express";

import { TaskScheduler } from "./TasksScheduler";
import { defineRemindDailyTask } from "./functions";

const PORT = process.env.PORT || 3333;

defineRemindDailyTask();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (_, response) =>
  response.json({
    message: "healthy",
    timestamp: new Date().toISOString(),
  })
);

app.get("/api/quotes", async (request, response) => {
  try {
    return response.json(
      JSON.parse(
        fs.readFileSync(path.resolve(__dirname, "quotes.json")).toString()
      )
    );
  } catch (error) {
    console.dir({ error }, { depth: null });
  }

  return response.status(201).send();
});

app.get("/api/events", async (request, response) => {
  try {
    return response.json({
      tasks: TaskScheduler.getInstance().getTasks(),
    });
  } catch (error) {
    console.dir({ error }, { depth: null });
  }

  return response.status(201).send();
});

app.post("/api/events", async (request, response) => {
  try {
    TaskScheduler.getInstance().resumeAllTasks();
  } catch (error) {
    console.dir({ error }, { depth: null });
  }

  return response.status(201).send();
});

app.delete("/api/events", async (request, response) => {
  try {
    TaskScheduler.getInstance().pauseAllTasks();
  } catch (error) {
    console.dir({ error }, { depth: null });
  }

  return response.status(204).send();
});

app.listen(PORT, () =>
  console.log(`server is listening on http://127.0.0.1:${PORT}`)
);
