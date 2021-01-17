import amqp from "amqplib";

export class BrokerConnection {
    private connection: amqp.Connection;

    constructor(private connectionString: string) {}

    public async establishConnection() {
        this.connection = await amqp.connect(this.connectionString); // amqp://guest:guest@localhost:5672
        return await this.connection.createChannel();
    }

    public tearDown() {
        this.connection.close();
    }
}

export { IRPCProducerSetup, RPCProducer } from "./RPCProducer";

export { IInstructionConfiguration, IInstructions, IInstruction, RPCConsumer } from "./RPCConsumer";
