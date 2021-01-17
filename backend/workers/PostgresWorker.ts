import { RPCConsumer } from "rabbitmq-rpc-wrapper";
import { Channel } from "amqplib";
import { PgClient } from "../database/postgres/postgresDAO";

// TODO EXTRACT INTO HELPER PACKAGE
const templateString = (template: string, valueObject: { [key: string]: string[] }, concatWidth: string = " ") => {
    let output = template;
    Object.entries(valueObject).forEach(([key, values]) => {
        output = output.replace(new RegExp("\\$" + `{${key}}`, "g"), () =>
            values.reduce((string, value, i) => (!i ? value : string + concatWidth + value), "")
        );
    });
    return output;
};

interface ISQLStatements {
    [key: string]: { query: string; formatResult: Function };
}

interface INarrowInstructionParameters {
    instruction: string;
    parameters: { [key: string]: [string] };
}

// TODO generic db error handling, row unpacking, before handling individual result formatting
const handleDBResult = () => {};

const sqlStatements: ISQLStatements = {
    taskList: { query: 'SELECT name from "task"."task";', formatResult: () => {} },
    taskGraph: { query: `SELECT * from "task"."parameter" where param_name = '\${taskName}';`, formatResult: () => {} },
};

const prepareQueryFunctions = (sqlStatements: ISQLStatements, dbClient: PgClient) =>
    Object.entries(sqlStatements).reduce(
        (queryFunctions, [key, instruction]) => ({
            ...queryFunctions,
            [key]: (args: INarrowInstructionParameters) =>
                instruction.formatResult(dbClient.queryDB(templateString(instruction.query, args.parameters))),
        }),
        {}
    );

export const PostgresWorker = async (dbClient: PgClient, channel: Channel, dbName: string): Promise<RPCConsumer> => {
    const consumer = new RPCConsumer(channel, `DB_${dbName}`, prepareQueryFunctions(sqlStatements, dbClient));
    consumer.startConsuming();
    return consumer;
};
