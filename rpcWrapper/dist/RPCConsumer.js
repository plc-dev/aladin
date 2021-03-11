"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPCConsumer = void 0;
class RPCConsumer {
    constructor(channel, queue, tasks) {
        this.channel = channel;
        this.queue = queue;
        this.tasks = tasks;
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.channel.assertQueue(this.queue, { durable: false });
            yield this.channel.prefetch(1);
        });
    }
    startConsuming() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setup();
            yield this.channel.consume(this.queue, (msg) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const instructionConfiguration = JSON.parse(msg.content.toString());
                    const { instruction } = instructionConfiguration;
                    const result = yield this.tasks[instruction](instructionConfiguration);
                    this.channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(result)), {
                        correlationId: msg.properties.correlationId,
                    });
                    this.channel.ack(msg);
                }
                catch (error) {
                    console.error(error);
                    console.error(JSON.parse(msg.content.toString()));
                }
            }));
        });
    }
}
exports.RPCConsumer = RPCConsumer;
//# sourceMappingURL=RPCConsumer.js.map