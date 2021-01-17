import amqp from "amqplib";
import { EventEmitter } from "events";
import { v4 as uuid } from "uuid";
import { IInstructionConfiguration } from "./RPCConsumer";

export interface IRPCProducerSetup {
    replyQueue: amqp.Replies.AssertQueue;
    correlationId: string;
}

export class RPCProducer {
    private responseEmitter: EventEmitter;
    private correlationId: string;
    private consumerTag: string;

    constructor(private channel: amqp.Channel, private queue: string, private consumerConfiguration: IInstructionConfiguration) {
        this.responseEmitter = new EventEmitter();
        this.responseEmitter.setMaxListeners(0);
    }

    private async setup(): Promise<IRPCProducerSetup> {
        this.correlationId = uuid();
        const replyQueue = await this.channel.assertQueue(`${this.correlationId}`, { exclusive: true, autoDelete: true });

        return { replyQueue, correlationId: this.correlationId };
    }

    public async produceTask(): Promise<{ result: any; queue: string }> {
        const { replyQueue, correlationId } = await this.setup();
        const responseEmitter = this.responseEmitter;
        const callback = (msg: amqp.ConsumeMessage) => {
            responseEmitter.emit(msg.properties.correlationId, JSON.parse(msg.content.toString()));
        };
        this.consumerTag = (await this.channel.consume(replyQueue.queue, callback, { noAck: true })).consumerTag;

        return new Promise(async (resolve) => {
            this.responseEmitter.once(correlationId, resolve);
            this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(this.consumerConfiguration)), {
                correlationId: correlationId,
                replyTo: replyQueue.queue,
            });
        });
    }

    public teardown() {
        this.channel.cancel(this.consumerTag);
    }
}
