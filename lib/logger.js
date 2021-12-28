"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogFactory = void 0;
const winston_1 = __importDefault(require("winston"));
const redisTransport = require('winston-redis');
const { combine, label, timestamp, printf } = winston_1.default.format;
const DEFAULT_FORMAT = 'json';
class LogFactory {
    constructor(config) {
        this.logger = this.configure(config);
    }
    static getLogger(config) {
        if (!LogFactory.instance) {
            LogFactory.instance = new LogFactory(config);
        }
        return LogFactory.instance;
    }
    configure(config) {
        if (config) {
            const formatter = winston_1.default.format.json();
            let format = combine(formatter, winston_1.default.format.splat());
            const isTimestamp = config.has('log.notimestamp') ? false : true;
            format = isTimestamp ? combine(timestamp(), format, winston_1.default.format.splat()) : format;
            let transport = config.has('log.redis') && config.get('log.redis') && config.has('log.redis.host') && config.has('log.redis.port') ? new redisTransport({ host: config.get('log.redis.host'), port: config.get('log.redis.port'), timestamp: true }) : new winston_1.default.transports.File({ filename: 'application.log' });
            const logger = winston_1.default.createLogger({
                format: format,
                transports: [
                    new winston_1.default.transports.Console(),
                    transport
                ]
            });
            return logger;
        }
        const logger = winston_1.default.createLogger({
            format: combine(timestamp(), winston_1.default.format.json(), winston_1.default.format.simple()),
            transports: [
                new winston_1.default.transports.Console()
            ]
        });
        return logger;
    }
}
exports.LogFactory = LogFactory;
;
