import {Context} from 'koa';
import {NextFunction} from 'express';

export async function responseMethod (context: Context, next: NextFunction) {

    await next();

    context.response.body = {
        data: context.body,
        meta: {
            serverTime: Date.now(),
            code: 200
        },
    };
}
