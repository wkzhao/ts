import {NextFunction} from 'express';
import {Context} from 'koa';

export const REQUEST_BODY = 'RequestBody';

export type MiddleWare = (context: Context, next: NextFunction) => void;

// 类装饰器
export function Controller (path= '/', middleWares?: MiddleWare[]) {
    return (target: any) => {
        target.prototype.path = path;
        target.prototype.middleWares = middleWares;
    };

}

// 方法装饰器
export function RequestMapping (config: {path: string, method: string,
                                         middleWares?: MiddleWare[]}) {

    return (target: any, name: string, descriptor: PropertyDescriptor) => {
        target[name].subPath = config.path;
        target[name].requestMethod = config.method;
        target[name].middleWares = config.middleWares;
    };

}

// 参数装饰器
export function RequestParam (paramName: string) {
    return (target: any, methodName: string, index: number) => {

        const  params = target[methodName].paramList || {};
        params[paramName] = index;
        target[methodName].paramList = params;
    };
}

// 参数装饰器
export function RequestBody () {
    return (target: any, methodName: string, index: number) => {

        const  params = target[methodName].paramList || {};
        params[REQUEST_BODY] = index;
        target[methodName].paramList = params;

    };
}
