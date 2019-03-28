import {Context} from 'koa';

export async function responseMethod (context: Context, next: () => Promise<any>) {

    await next();

    context.response.body = {
        data: context.body,
        meta: {
            serverTime: Date.now(),
            code: 200
        },
    };
}
