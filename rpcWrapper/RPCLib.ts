import amqp from "amqplib";

export class BrokerConnection {
    private connection: amqp.Connection;
    private connectionAttempts: number = 50;

    constructor(private connectionString: string) {}

    public async establishConnection() {
        try {
            this.connection = await amqp.connect(this.connectionString); // amqp://guest:guest@localhost:5672
            return await this.connection.createChannel();
        } catch (error) {
            if (this.connectionAttempts) {
                setTimeout(() => {
                    this.establishConnection();
                }, 2000);
            }
            this.connectionAttempts--;
        }
    }

    public tearDown() {
        this.connection.close();
    }
}

export { IRPCProducerSetup, RPCProducer } from "./RPCProducer";

export { IInstructionConfiguration, IInstructions, IInstruction, RPCConsumer } from "./RPCConsumer";
