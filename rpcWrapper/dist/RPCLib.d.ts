import amqp from "amqplib";
export declare class BrokerConnection {
    private connectionString;
    private connection;
    constructor(connectionString: string);
    establishConnection(): Promise<amqp.Channel>;
    tearDown(): void;
}
export { IRPCProducerSetup, RPCProducer } from "./RPCProducer";
export { IInstructionConfiguration, IInstructions, IInstruction, RPCConsumer } from "./RPCConsumer";
