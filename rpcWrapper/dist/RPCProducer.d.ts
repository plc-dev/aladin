import amqp from "amqplib";
import { IInstructionConfiguration } from "./RPCConsumer";
export interface IRPCProducerSetup {
    replyQueue: amqp.Replies.AssertQueue;
    correlationId: string;
}
export declare class RPCProducer {
    private channel;
    private queue;
    private consumerConfiguration;
    private responseEmitter;
    private correlationId;
    private consumerTag;
    constructor(channel: amqp.Channel, queue: string, consumerConfiguration: IInstructionConfiguration);
    private setup;
    produceTask(): Promise<{
        result: any;
        queue: string;
    }>;
    teardown(): void;
}
