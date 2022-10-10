"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.range = exports.minMaxScaler = exports.randomSample = exports.shuffle = exports.statefulCounter = exports.RNG = void 0;
var seedrandom_1 = require("seedrandom");
var RNG = /** @class */ (function () {
    function RNG(seed) {
        this.rng = seed ? seedrandom_1["default"](seed) : Math.random;
    }
    RNG.prototype.coinFlip = function () {
        return this.floatBetween(0, 1) > 0.5;
    };
    RNG.prototype.floatBetween = function (min, max) {
        if (min && max)
            return this.rng() * (max - min) + min;
        return this.rng();
    };
    RNG.prototype.intBetween = function (min, max) {
        return Math.round(this.rng() * (max - min) + min);
    };
    return RNG;
}());
exports.RNG = RNG;
var statefulCounter = function (start) {
    if (start === void 0) { start = 0; }
    function counter() {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 2];
                    return [4 /*yield*/, start];
                case 1:
                    _a.sent();
                    start++;
                    return [3 /*break*/, 0];
                case 2: return [2 /*return*/];
            }
        });
    }
    return counter();
};
exports.statefulCounter = statefulCounter;
// https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
function shuffle(iterable, rng) {
    if (!rng)
        rng = new RNG();
    var array = __spreadArray([], iterable);
    var j, x;
    for (var i = array.length - 1; i > 0; i--) {
        j = rng.intBetween(0, i);
        x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
    return array;
}
exports.shuffle = shuffle;
function randomSample(iterable, n, replace, rng) {
    if (!rng)
        rng = new RNG();
    var array = shuffle(iterable, rng);
    if (n > array.length)
        throw new Error("Samplesize is greater than number of elements in the given array.\n" + n + "\n" + array);
    function elementGenerator() {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!array.length) return [3 /*break*/, 2];
                    return [4 /*yield*/, array.splice(0, n)];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 0];
                case 2: return [2 /*return*/];
            }
        });
    }
    if (replace) {
        return elementGenerator().next().value;
    }
    return elementGenerator();
}
exports.randomSample = randomSample;
function minMaxScaler(measurementMin, measurementMax, targetMin, targetMax) {
    return function (value) { return ((value - measurementMin) / (measurementMax - measurementMin)) * (targetMax - targetMin) + targetMin; };
}
exports.minMaxScaler = minMaxScaler;
function range(min, max) {
    return Array(max - min)
        .fill(0)
        .map(function (e) { return min++; });
}
exports.range = range;
