import EventSource from 'eventsource';

import {WorkerLogger} from '../lib';
const logger = WorkerLogger('base-worker');

export default class BaseWorker {
  constructor(eventName, url) {
    this.eventName = eventName;
    this.url = url;
  }

  start() {
    this.source = new EventSource(this.url);
    this.source.addEventListener(this.eventName, this.onEvent.bind(this));
  }

  onEvent(eventData) {
    const errorMessage = `Unimplemented "process" function for event worker ${this.eventName}`;
    logger.error(errorMessage);
    throw new Error(errorMessage);
  }

}
