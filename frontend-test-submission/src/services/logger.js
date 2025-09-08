const log = (level, message, data) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${level.toUpperCase()}]: ${message}`, data || '');
};

const logger = {
  info: (message,data)=>log('info',message,data),
  warn: (message,data)=>log('warn',message,data),
  error: (message,data)=>log('error',message,data),
};

export default logger;