import amqp from "amqplib";

export interface IInstructionConfiguration extends Object {
    instruction: string;
    parameters: { [key: string]: string | number | Array<any> | object };
}

export interface IInstruction {
    (instructionConfiguration: IInstructionConfiguration): Promise<object>;
}

export interface IInstructions {
    [key: string]: IInstruction;
}

export class RPCConsumer {
    constructor(private channel: amqp.Channel, private queue: string, private tasks: IInstructions | any) {}

    private async setup() {
        await this.channel.assertQueue(this.queue, { durable: false });
        await this.channel.prefetch(1);
    }

    public async startConsuming() {
        try {
            await this.setup();

            await this.channel.consume(this.queue, async (msg: amqp.ConsumeMessage) => {
                const instructionConfiguration: IInstructionConfiguration = JSON.parse(msg.content.toString());
                const { instruction } = instructionConfiguration;
                const result = await this.tasks[instruction](instructionConfiguration);
                this.channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(result)), {
                    correlationId: msg.properties.correlationId,
                });
                this.channel.ack(msg);
            });
        } catch (error) {
            console.log(error);
        }
    }
}
