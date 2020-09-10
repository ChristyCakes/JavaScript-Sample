import debug from 'debug';

const logger = (appName) => {
  return {
    debug: debug(`${appName}:debug`),
    warn: debug(`${appName}:warn`),
    error: debug(`${appName}:error`),
  };
};

export const appLogger = logger('app');
export const WorkerLogger = (instance) => logger(`worker:${instance}`);

