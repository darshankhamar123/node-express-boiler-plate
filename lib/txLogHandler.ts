import {LogFactory} from './logger';
let logger: any;
class TransactionLogHandlerClass {
    
    constructor(config: any){
        logger = LogFactory.getLogger(config).logger;
    }

    isSuccess(res:any) {
        return ((res.statusCode >= 200) && (res.statusCode < 300));
      };

    handle(req:any, res:any, next:any) {
        res.once('finish', async () => {
          try {
            logger.debug('logging transaction');
            if (this.isSuccess(res)) {
              // log successful transactions
              
              logger.info('Transaction Successful %s',this.createPayload(req));
    
            } else {
              logger.error('Transaction Failed %s',this.createPayload(req));
            }
          } catch (err) {
            logger.error(err);
          }
        });
        next();
      }

    createPayload(req:any){
        return JSON.stringify({
          url: req.url,
          params: req.params,
          method: req.method,
          body: req.body,
          headers: req.headers
        });
      }
}




export default TransactionLogHandlerClass;
