import amqp from "amqplib";
export interface IInstructionConfiguration extends Object {
    instruction: string;
    parameters: {
        [key: string]: string | number | Array<any> | object;
    };
}
export interface IInstruction {
    (instructionConfiguration: IInstructionConfiguration): Promise<object>;
}
export interface IInstructions {
    [key: string]: IInstruction;
}
export declare class RPCConsumer {
    private channel;
    private queue;
    private tasks;
    constructor(channel: amqp.Channel, queue: string, tasks: IInstructions | any);
    private setup;
    startConsuming(): Promise<void>;
}
