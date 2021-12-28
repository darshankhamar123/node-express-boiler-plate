
/**
 * Standard HTTP/API reply messages
 * @type {{INTERNAL_SERVER_ERROR: string, NOT_FOUND: string, NOT_ACCEPTABLE: string, UNAUTHORISED: string}}
 */
const messages = {
  INTERNAL_SERVER_ERROR :{message: 'Internal Server Error', code: 500},
  NOT_FOUND:{message: 'Not Found', code: 404},
  NOT_ACCEPTABLE:{message: 'Not Acceptable',code: 406},
  UNAUTHORISED:{message: 'Unauthorised',code: 401},
  BAD_REQUEST:{ message :'Bad Request',code:400},
  CONFLICT:{message: 'Conflict', code:409},
  FORBIDDEN:{message: 'Forbidden', code:403}
};

export {messages};
