import winston, { configure } from 'winston';
import { json } from 'body-parser';
const redisTransport = require('winston-redis');
const { combine, label, timestamp,printf} = winston.format;
const DEFAULT_FORMAT = 'json';

export class LogFactory {
  private static instance: LogFactory;
  config: any;
  logger: any;
  private constructor(config?:any) { 
    this.logger = this.configure(config);
  }

  public static getLogger(config?:any): LogFactory {
    if (!LogFactory.instance) {
      LogFactory.instance = new LogFactory(config);
      
    }
    
    return LogFactory.instance;
  }
 
  configure(config:any) {
    if (config) {
      
      const formatter = winston.format.json();
      let format = combine(formatter,winston.format.splat());
      const isTimestamp = config.has('log.notimestamp') ? false : true;
      format = isTimestamp ? combine(timestamp(), format,winston.format.splat()) : format;

      let transport = config.has('log.redis') && config.get('log.redis') && config.has('log.redis.host') && config.has('log.redis.port')?new redisTransport({host:config.get('log.redis.host'),port:config.get('log.redis.port'),timestamp:true}) : new winston.transports.File({ filename: 'application.log'});
      const logger = winston.createLogger({
        format: format,
        transports: [
          new winston.transports.Console(),
          transport
        ]
      });
      
      return logger;
    }
    const logger = winston.createLogger({
      format: combine(
        timestamp(),
        winston.format.json(),
        winston.format.simple()
        
        
      ),
      transports: [
        new winston.transports.Console()
      ]
    });
    return logger;
   }
};

