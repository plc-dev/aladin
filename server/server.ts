import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { BrokerConnection } from "rabbitmq-rpc-wrapper";
import { TaskRouteManager, ISerializedTaskRoute } from "./api/TaskRouteManager";

// load environment variables
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

const app: express.Application = express();
const broker = new BrokerConnection("amqp://guest:guest@rabbitmq:5672" || process.env.AMQP_BROKER);

const serializedRoutes: Array<ISerializedTaskRoute> = [
    {
        task: "gozintograph",
        name: "generateGraph",
        httpMethod: "post",
        params: {
            parameters: "object",
        },
    },
    {
        task: "sql",
        name: "generateQuery",
        httpMethod: "post",
        params: { parameters: "object", schema: "string", language: "string" },
    },
    {
        task: "sql",
        name: "validateQuery",
        httpMethod: "post",
        params: { parameters: "object" },
    },
    {
        task: "sql",
        name: "generateERD",
        httpMethod: "post",
        params: { parameters: "object" },
    },
    {
        task: "geointerpolation",
        name: "generateGeo",
        httpMethod: "post",
        params: { parameters: "object" },
    },
    {
        task: "shortestpath",
        name: "generateSP",
        httpMethod: "post",
        params: { parameters: "object" },
    },
];

(async () => {
    try {
        const port: string = process.env.PORT || "8000";

        app.use(cors());
        app.use(bodyParser.json({ limit: "50mb" }));
        app.use(
            bodyParser.urlencoded({
                limit: "50mb",
                extended: true,
                parameterLimit: 50000,
            })
        );

        // initialize API
        const channel = await broker.establishConnection();
        const taskRouteManager = new TaskRouteManager(app, channel);
        taskRouteManager.addRoute(serializedRoutes);

        const { dbRoutes } = await import("./api/DB");
        const { maximaRoutes } = await import("./api/Maxima");
        const { taskGraph } = await import("./api/taskGraphManager");
        const { replayRoutes } = await import("./api/Replay");
        app.use("/api", dbRoutes(express.Router(), channel));
        app.use("/api", maximaRoutes(express.Router(), channel));
        app.use("/api", taskGraph(express.Router()));
        app.use("/api", replayRoutes(express.Router(), channel));

        app.get("/", (req: express.Request, res: express.Response) => {
            res.send("Hello world!");
        });

        app.listen(port, () => {
            // tslint:disable-next-line:no-console
            console.log(`server started at http://localhost:${port}`);
        });
    } catch (error) {
        throw Error(error);
    } finally {
        // const cleanup = () => broker.tearDown();
        // [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
        //     process.on(eventType, cleanup.bind(null, eventType));
        // });
    }
})();
