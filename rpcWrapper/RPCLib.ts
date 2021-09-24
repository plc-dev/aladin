import amqp from "amqplib";

const asyncSleep = async (fn: Function, timeOut: number = 2000): Promise<any> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(fn()), timeOut);
    });
};

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
                this.connectionAttempts--;
                return await asyncSleep(this.establishConnection);
            } else {
                throw new Error(error);
            }
        }
    }

    public tearDown() {
        this.connection.close();
    }
}

export { IRPCProducerSetup, RPCProducer } from "./RPCProducer";

export { IInstructionConfiguration, IInstructions, IInstruction, RPCConsumer } from "./RPCConsumer";
