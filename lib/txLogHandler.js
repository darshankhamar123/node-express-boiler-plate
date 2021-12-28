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
const logger_1 = require("./logger");
let logger;
class TransactionLogHandlerClass {
    constructor(config) {
        logger = logger_1.LogFactory.getLogger(config).logger;
    }
    isSuccess(res) {
        return ((res.statusCode >= 200) && (res.statusCode < 300));
    }
    ;
    handle(req, res, next) {
        res.once('finish', () => __awaiter(this, void 0, void 0, function* () {
            try {
                logger.debug('logging transaction');
                if (this.isSuccess(res)) {
                    // log successful transactions
                    logger.info('Transaction Successful %s', this.createPayload(req));
                }
                else {
                    logger.error('Transaction Failed %s', this.createPayload(req));
                }
            }
            catch (err) {
                logger.error(err);
            }
        }));
        next();
    }
    createPayload(req) {
        return JSON.stringify({
            url: req.url,
            params: req.params,
            method: req.method,
            body: req.body,
            headers: req.headers
        });
    }
}
exports.default = TransactionLogHandlerClass;
