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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RPCConsumer = exports.RPCProducer = exports.BrokerConnection = void 0;
const amqplib_1 = __importDefault(require("amqplib"));
class BrokerConnection {
    constructor(connectionString) {
        this.connectionString = connectionString;
    }
    establishConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            this.connection = yield amqplib_1.default.connect(this.connectionString); // amqp://guest:guest@localhost:5672
            return yield this.connection.createChannel();
        });
    }
    tearDown() {
        this.connection.close();
    }
}
exports.BrokerConnection = BrokerConnection;
var RPCProducer_1 = require("./RPCProducer");
Object.defineProperty(exports, "RPCProducer", { enumerable: true, get: function () { return RPCProducer_1.RPCProducer; } });
var RPCConsumer_1 = require("./RPCConsumer");
Object.defineProperty(exports, "RPCConsumer", { enumerable: true, get: function () { return RPCConsumer_1.RPCConsumer; } });
//# sourceMappingURL=RPCLib.js.map