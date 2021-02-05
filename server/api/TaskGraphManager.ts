const fs = require("fs");
const path = require("path");
import { Router } from "express";

function readTasks(dir: string) {
    const tasks: { [key: string]: { API: object; Worker: object; UI: { [key: string]: object } } } = {};
    fs.readdirSync(dir).forEach((filename: string) => {
        const name: string = path.parse(filename).name;
        const filepath = path.resolve(dir, filename);
        const task: { API: object; Worker: object; UI: { [key: string]: object } } = JSON.parse(fs.readFileSync(filepath));
        tasks[name] = task;
    });
    return tasks;
}

const tasks: { [key: string]: { API: object; Worker: object; UI: { [key: string]: any } } } = readTasks(
    `${__dirname}/../tempTaskGraphStorage/tasks`
);

const taskParts = Object.entries(tasks).reduce(
    (taskParts, [name, task]) => {
        taskParts.API.push(task.API);
        taskParts.Worker = { ...taskParts.Worker, ...task.Worker };
        taskParts.UI[name] = task.API;
        return taskParts;
    },
    ({
        API: [],
        Worker: [],
        UI: {},
    } as unknown) as { API: any[]; Worker: object; UI: { [key: string]: any } }
);

export const taskGraph = (router: Router) => {
    router.post("/fetchTaskGraph", async (req, res) => {
        try {
            const { task } = req.body;
            res.status(200).json(JSON.stringify(tasks[task]));
        } catch (error) {
            res.status(400).json(JSON.stringify(error));
        }
    });

    return router;
};
