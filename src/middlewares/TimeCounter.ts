import {Context} from 'koa';
import {LoggerFactory} from '../util/logger';

const logger = LoggerFactory.getLogger('TimeCounter');

export async function timeCounter (context: Context, next: () => Promise<any>) {

    const start = Date.now();
    await next();
    const end = Date.now();
    logger.info(`${context.request.url} cost  ${(end - start)}  ms `);

}
