import { RPCConsumer } from "rabbitmq-rpc-wrapper";
import amqp, { Channel } from "amqplib";
import { GozintographGenerator } from "./graphLib/generators/gozintographGenerator";
import { sqlQueryGenerator } from "./workers/SQLTaskWorker";
import { PostgresWorker } from "./workers/PostgresWorker";
import { PgClient } from "./database/postgres/postgresDAO";
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;

// TODO generalize generators into serialisable functions
const generators: { [key: string]: any } = {
    GozintographGenerator: GozintographGenerator,
    sqlQueryGenerator: sqlQueryGenerator,
};

// load environment variables
import * as dotenv from "dotenv";
dotenv.config({ path: __dirname + "/.env" });

interface ISerializedQueues {
    [key: string]: {
        minConsumers: number;
        consumerInstructions: {
            [key: string]: {
                dependencies: Array<string>;
                body: string;
            };
        };
    };
}

(async () => {
    try {
        // start rabbitmq
        const connection = await amqp.connect("amqp://guest:guest@rabbitmq:5672"); //process.env.brokerConnection
        const channel: Channel = await connection.createChannel();

        // initialize db
        // Set up mongoDB
        // const mdb = await require("./database/mongodb/mongooseDAO")();

        // initialize postgres
        const dbName = "aladin";
        const aladinClient = new PgClient(dbName);
        const pgWorker = PostgresWorker(aladinClient, channel, dbName);

        // initialize maxima via docker-compose up maxima
        // const maximaWorker = MaximaWorker(channel);

        // initialize rabbitmq consumers
        // TODO generalize with supervisor and docker api
        // https://docs.docker.com/engine/api/v1.40/#operation/ContainerLogs
        // https://stackoverflow.com/questions/37581644/start-docker-container-from-another-application-in-another-docker-container

        // template and configure dockerfiles https://www.datanovia.com/en/courses/docker-compose-wait-for-dependencies/
        const queues: ISerializedQueues = {
            gozintographTask: {
                minConsumers: 1,
                consumerInstructions: {
                    generateGraph: {
                        dependencies: ["GozintographGenerator"],
                        body: `async (taskDescription) => {
                            const g = new GozintographGenerator(taskDescription.parameters); 
                            return g.generateGraph();
                        }`,
                    },
                },
            },
            sqlTask: {
                minConsumers: 1,
                consumerInstructions: {
                    generateQuery: {
                        dependencies: ["sqlQueryGenerator"],
                        body: `async (taskDescription) => {
                            return await sqlQueryGenerator(taskDescription);
                        }`,
                    },
                },
            },
        };

        for (let queue in queues) {
            const queueConfig = queues[queue];
            // forbidden black magic:
            // https://stackoverflow.com/questions/36517173/how-to-store-a-javascript-function-in-json
            // https://stackoverflow.com/questions/6396046/unlimited-arguments-in-a-javascript-function
            const parsedFunctions = Object.entries(queueConfig.consumerInstructions).reduce(
                (parsedFunctions, [instructionName, instruction]) => {
                    const parsedFunction = new AsyncFunction(
                        ...instruction.dependencies.map((dependency) => generators[dependency].name),
                        `"use strict"; return (${instruction.body});`
                    )(...instruction.dependencies.map((dependency) => generators[dependency]));
                    return { ...parsedFunctions, [instructionName]: parsedFunction };
                },
                {}
            );

            const consumer = new RPCConsumer(channel, queue, parsedFunctions);
            consumer.startConsuming();
        }
    } catch (error) {
        console.log(error);
    } finally {
    }
})();
