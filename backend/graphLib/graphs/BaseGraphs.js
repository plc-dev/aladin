"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.__esModule = true;
exports.DAG = exports.MultiDiGraph = exports.MultiGraph = exports.DiGraph = exports.Graph = void 0;
function idGenerator() {
    var i;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                _a.label = 1;
            case 1:
                if (!true) return [3 /*break*/, 3];
                return [4 /*yield*/, i++];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
}
var Graph = /** @class */ (function () {
    function Graph() {
        this.nodes = {};
        this.edges = [];
        this.idGenerator = idGenerator();
    }
    Graph.prototype.createNode = function (attributes) {
        var id = this.idGenerator.next()["value"];
        this.nodes[id] = __assign({ id: id }, attributes);
        return id;
    };
    Graph.prototype.createEdge = function (ancestor, descendant, attributes) {
        this.edges.push(__assign({ between: [ancestor, descendant] }, attributes));
    };
    Graph.prototype.createAdjacencyMatrix = function () {
        var nodeAmount = Object.keys(this.nodes).length;
        function initArray(n, v) {
            return Array(n).fill(v);
        }
        var adjacencyMatrix = Array(nodeAmount)
            .fill([0])
            .map(function () { return Array(nodeAmount).fill(0); });
        this.edges.forEach(function (edge) {
            var _a = edge.between, from = _a[0], to = _a[1];
            if (edge.weight && typeof edge.weight === "number") {
                adjacencyMatrix[from][to] = edge.weight;
            }
            else {
                adjacencyMatrix[from][to]++;
            }
        });
        this.adjacencyMatrix = adjacencyMatrix;
    };
    Graph.prototype.createValueVector = function () {
        this.valueVector = [Object.entries(this.nodes).map(function (_a) {
                var id = _a[0], node = _a[1];
                return node.value;
            })];
    };
    Graph.prototype.createLabelVector = function () {
        this.labelVector = Object.values(this.nodes).map(function (node) { return node.label; });
    };
    Graph.prototype.serialiseToJson = function () { };
    Graph.prototype.generateDotDescription = function () {
        return "";
    };
    return Graph;
}());
exports.Graph = Graph;
var DiGraph = /** @class */ (function (_super) {
    __extends(DiGraph, _super);
    function DiGraph() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isDirected = true;
        return _this;
    }
    return DiGraph;
}(Graph));
exports.DiGraph = DiGraph;
var MultiGraph = /** @class */ (function (_super) {
    __extends(MultiGraph, _super);
    function MultiGraph() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MultiGraph;
}(Graph));
exports.MultiGraph = MultiGraph;
var MultiDiGraph = /** @class */ (function (_super) {
    __extends(MultiDiGraph, _super);
    function MultiDiGraph() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MultiDiGraph;
}(Graph));
exports.MultiDiGraph = MultiDiGraph;
var DAG = /** @class */ (function (_super) {
    __extends(DAG, _super);
    function DAG() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return DAG;
}(DiGraph));
exports.DAG = DAG;
