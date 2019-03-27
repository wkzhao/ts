import {Context} from 'koa';
import {NextFunction} from 'express';
import {LoggerFactory} from '../util/logger';

const logger = LoggerFactory.getLogger('TimeCounter');

export async function timeCounter (context: Context, next: NextFunction) {

    const start = Date.now();
    await next();
    const end = Date.now();
    logger.info('cost ' + (end - start) + ' ms');

}
