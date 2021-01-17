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
exports.RPCProducer = void 0;
const events_1 = require("events");
const uuid_1 = require("uuid");
class RPCProducer {
    constructor(channel, queue, consumerConfiguration) {
        this.channel = channel;
        this.queue = queue;
        this.consumerConfiguration = consumerConfiguration;
        this.responseEmitter = new events_1.EventEmitter();
        this.responseEmitter.setMaxListeners(0);
    }
    setup() {
        return __awaiter(this, void 0, void 0, function* () {
            this.correlationId = uuid_1.v4();
            const replyQueue = yield this.channel.assertQueue(`${this.correlationId}`, { exclusive: true, autoDelete: true });
            return { replyQueue, correlationId: this.correlationId };
        });
    }
    produceTask() {
        return __awaiter(this, void 0, void 0, function* () {
            const { replyQueue, correlationId } = yield this.setup();
            const responseEmitter = this.responseEmitter;
            const callback = (msg) => {
                responseEmitter.emit(msg.properties.correlationId, JSON.parse(msg.content.toString()));
            };
            this.consumerTag = (yield this.channel.consume(replyQueue.queue, callback, { noAck: true })).consumerTag;
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                this.responseEmitter.once(correlationId, resolve);
                this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(this.consumerConfiguration)), {
                    correlationId: correlationId,
                    replyTo: replyQueue.queue,
                });
            }));
        });
    }
    teardown() {
        this.channel.cancel(this.consumerTag);
    }
}
exports.RPCProducer = RPCProducer;
//# sourceMappingURL=RPCProducer.js.map