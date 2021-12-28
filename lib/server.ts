import express from 'express';
import bodyParser from 'body-parser';
import os from 'os';
import throng from 'throng';
import helmet from 'helmet';
import {LogFactory} from './logger';
import txLogHandler from './txLogHandler';
const app:any = express();
const REQUEST_BODY_SIZE_LIMIT:string = '100kb';
const cpus:os.CpuInfo[] = os.cpus();
let logger: any;
// const app: express.Application = express();

export class Server{
    config: any = {};
    routers:any;
    middlerwares: any;

    constructor(config: any,routers: any,middlewares: any){
        this.config = config;
        this.routers = routers;
        logger = LogFactory.getLogger(config).logger;
        this.middlerwares = middlewares;
      }

    private run = (id:number)=> {
        try {
          app.listen(this.config.get('environment.port'),  () => {
            logger.info( ' API worker node ' + id + ' is now running on port ' + this.config.get('environment.port'));
          });
        } catch (e) {
          logger.info('The  API could not be started: ' + e);
        }
      }
    start = ()=> {
        this.configureApp(app, this.config);
        throng({
          workers: cpus.length,
          start: this.run,
          grace: 1000,
          lifetime: Infinity
        });
        return app;
      }

    private configureApp = (app:express.Application, config:any) => {

        app.use(bodyParser.urlencoded({extended: true}));
        app.use(bodyParser.json({ limit: config.reqBodySizeLimit || REQUEST_BODY_SIZE_LIMIT }));
        app.use(helmet());
        
        this.configureCustomMiddlewares(app,this.middlerwares);
        this.addTransactionLogHandler(app,config);
        this.addRoutersToApp(app,this.routers);
        return app;
      }
    private addRoutersToApp = (app:any, routers:any) =>{
        for (let i = 0; i < routers.length; i++) {
           app.use(routers[i]);
        }
      }
    private addTransactionLogHandler = (app:any,config:any) => {
            try {
              const txHandler = new txLogHandler(config).handle;
              app.patch('*', txHandler);
              app.post('*', txHandler);
              app.put('*', txHandler);
              app.delete('*', txHandler);
            } catch (ex) {
              logger.error('Error with txhandler : ',ex);
            }
          }
    private configureCustomMiddlewares = (app:any,middlewares:any) => {
        for (let i = 0; i < middlewares.length; i++) {
            app.use(middlewares[i]);
         }
    }      
      
   
}


