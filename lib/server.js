"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const os_1 = __importDefault(require("os"));
const throng_1 = __importDefault(require("throng"));
const helmet_1 = __importDefault(require("helmet"));
const logger_1 = require("./logger");
const txLogHandler_1 = __importDefault(require("./txLogHandler"));
const app = express_1.default();
const REQUEST_BODY_SIZE_LIMIT = '100kb';
const cpus = os_1.default.cpus();
let logger;
// const app: express.Application = express();
class Server {
    constructor(config, routers, middlewares) {
        this.config = {};
        this.run = (id) => {
            try {
                app.listen(this.config.get('environment.port'), () => {
                    logger.info(' API worker node ' + id + ' is now running on port ' + this.config.get('environment.port'));
                });
            }
            catch (e) {
                logger.info('The  API could not be started: ' + e);
            }
        };
        this.start = () => {
            this.configureApp(app, this.config);
            throng_1.default({
                workers: cpus.length,
                start: this.run,
                grace: 1000,
                lifetime: Infinity
            });
            return app;
        };
        this.configureApp = (app, config) => {
            app.use(body_parser_1.default.urlencoded({ extended: true }));
            app.use(body_parser_1.default.json({ limit: config.reqBodySizeLimit || REQUEST_BODY_SIZE_LIMIT }));
            app.use(helmet_1.default());
            this.configureCustomMiddlewares(app, this.middlerwares);
            this.addTransactionLogHandler(app, config);
            this.addRoutersToApp(app, this.routers);
            return app;
        };
        this.addRoutersToApp = (app, routers) => {
            for (let i = 0; i < routers.length; i++) {
                app.use(routers[i]);
            }
        };
        this.addTransactionLogHandler = (app, config) => {
            try {
                const txHandler = new txLogHandler_1.default(config).handle;
                app.patch('*', txHandler);
                app.post('*', txHandler);
                app.put('*', txHandler);
                app.delete('*', txHandler);
            }
            catch (ex) {
                logger.error('Error with txhandler : ', ex);
            }
        };
        this.configureCustomMiddlewares = (app, middlewares) => {
            for (let i = 0; i < middlewares.length; i++) {
                app.use(middlewares[i]);
            }
        };
        this.config = config;
        this.routers = routers;
        logger = logger_1.LogFactory.getLogger(config).logger;
        this.middlerwares = middlewares;
    }
}
exports.Server = Server;
