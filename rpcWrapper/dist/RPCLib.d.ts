export declare class BrokerConnection {
    private connectionString;
    private connection;
    private connectionAttempts;
    constructor(connectionString: string);
    establishConnection(): Promise<any>;
    tearDown(): void;
}
export { IRPCProducerSetup, RPCProducer } from "./RPCProducer";
export { IInstructionConfiguration, IInstructions, IInstruction, RPCConsumer } from "./RPCConsumer";
