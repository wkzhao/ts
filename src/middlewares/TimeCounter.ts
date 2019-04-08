import {Context} from 'koa';
import {LoggerFactory} from '../util/logger';
import {Next} from '../decorator/RouterDecrator';

const logger = LoggerFactory.getLogger('TimeCounter');

export async function timeCounter (context: Context, next: Next) {

    const start = Date.now();
    await next();
    const end = Date.now();
    logger.info(`${context.request.url} cost  ${(end - start)}  ms `);

}
