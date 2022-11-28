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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var client_1 = require("@notionhq/client");
var dotenv = require("dotenv");
var cross_fetch_1 = require("cross-fetch");
var errors_1 = require("@notionhq/client/build/src/errors");
dotenv.config();
var notionKey = process.env.NOTION_KEY;
var notionDB = process.env.NOTION_DATABASE_ID;
var ampUser = process.env.AMPLITUDE_KEY;
var ampKey = process.env.AMPLITUDE_SECRET;
var notion = new client_1.Client({ auth: notionKey });
function getAmplitudeData() {
    return __awaiter(this, void 0, void 0, function () {
        var auth, res, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    auth = Buffer.from("".concat(ampUser, ":").concat(ampKey)).toString("base64");
                    return [4 /*yield*/, (0, cross_fetch_1["default"])("https://amplitude.com/api/3/chart/pvjy11z/query", {
                            method: "GET",
                            headers: { Authorization: "Basic ".concat(auth) }
                        })];
                case 1:
                    res = _a.sent();
                    if (res.status >= 400) {
                        throw new Error("Bad response from server: ".concat(res.status));
                    }
                    if (!(res.status === 200)) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data.data];
                case 3: return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    if ((0, errors_1.isHTTPResponseError)(err_1)) {
                        console.error(err_1);
                    }
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
var db_id = "3206b65977a445a0a01a10840aeff477";
function addItem(company, generators, foreignKeys) {
    return __awaiter(this, void 0, void 0, function () {
        var res, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, notion.pages.create({
                            parent: {
                                database_id: db_id
                            },
                            properties: {
                                Customer: {
                                    type: "title",
                                    title: [{ type: "text", text: { content: company } }]
                                },
                                Generators: {
                                    type: "number",
                                    number: generators
                                },
                                "Foreign Keys": {
                                    type: "number",
                                    number: foreignKeys
                                }
                            }
                        })];
                case 1:
                    res = _a.sent();
                    console.log(res);
                    return [3 /*break*/, 3];
                case 2:
                    err_2 = _a.sent();
                    console.error(err_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function updateItem(page_id, generators, foreignKeys) {
    return __awaiter(this, void 0, void 0, function () {
        var res, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, notion.pages.update({
                            page_id: page_id,
                            properties: {
                                Generators: {
                                    type: "number",
                                    number: generators
                                },
                                "Foreign Keys": {
                                    type: "number",
                                    number: foreignKeys
                                }
                            }
                        })];
                case 1:
                    res = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    err_3 = _a.sent();
                    console.error(err_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function queryDB(company) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var res, err_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, notion.databases.query({
                            database_id: db_id,
                            filter: {
                                property: "Customer",
                                rich_text: {
                                    equals: company
                                }
                            }
                        })];
                case 1:
                    res = _b.sent();
                    return [2 /*return*/, (_a = res.results[0]) === null || _a === void 0 ? void 0 : _a.id];
                case 2:
                    err_4 = _b.sent();
                    console.error(err_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function upsertRow(company, generators, foreignKeys) {
    return __awaiter(this, void 0, void 0, function () {
        var row_id;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, queryDB(company)];
                case 1:
                    row_id = _a.sent();
                    if (row_id) {
                        updateItem(row_id, generators, foreignKeys);
                    }
                    else {
                        addItem(company, generators, foreignKeys);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var data, labels, values;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, getAmplitudeData()];
            case 1:
                data = _a.sent();
                labels = data.labels.slice(1);
                values = data.values.slice(1);
                labels.forEach(function (_a, i) {
                    var company = _a[0];
                    var _b = values[i], generators = _b[0], foreignKeys = _b[1];
                    console.log(company, generators, foreignKeys);
                    upsertRow(company, +generators, +foreignKeys);
                });
                return [2 /*return*/];
        }
    });
}); })();
