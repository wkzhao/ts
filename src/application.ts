import Koa, {Context} from 'koa';
import Router from 'koa-router';
import {MiddleWare, REQUEST_BODY} from './decorator/RouterDecrator';
import * as path from 'path';
import * as fs from 'fs';
import bodyParser from 'koa-bodyparser';
import {LoggerFactory} from './util/logger';
import {responseMethod} from './middlewares/ResHandle';
import {factory} from './decorator/Factory';

const logger = LoggerFactory.getLogger('Application');
export class Application {

    private app: Koa;
    private globalRouter: Router;

    constructor () {
        this.app = new Koa();
        this.globalRouter = new Router();
        this.app.on('error', (err) => {
            throw err;
        });
        this.app.use(bodyParser());

        this.app.use(responseMethod);

        this.loadComponents([
            path.join(__dirname, './controller'),
            path.join(__dirname, './service'),
            path.join(__dirname, './dao')
        ]);

        this.app.use(this.globalRouter.routes());
    }

    // 注册组件
    private loadComponents (componentPaths: string[]): void{
        for (const componentPath of componentPaths){
            const files = fs.readdirSync(componentPath);
            files.forEach((file) => {
                    const newFilePath = path.join(componentPath, file);
                    if (fs.statSync(newFilePath).isDirectory()){
                        return this.loadComponents([newFilePath]);
                    }

                    const component = require(newFilePath);
                    const proto = component.default.prototype;

                    if (proto.injectName){
                        factory[proto.injectName] = new component.default();
                    }else {
                        this.registerRouters(proto);
                    }

                }
            );
        }
    }

    // 注册路由
    private registerRouters (controllerProto: any): void{
        if (!controllerProto){
            return;
        }

        const proto = controllerProto;
        const prefix = proto.path;
        const middleWares: MiddleWare[] = proto.middleWares;

        const properties = Object.getOwnPropertyNames(proto);

        properties.forEach((property) => {
            if (proto[property] && proto[property].subPath){
                const fullPath = (prefix + proto[property].subPath).replace(/\/{2,}/g, '/');
                const method = proto[property].requestMethod;

                // 累加中间件
                const fullMiddleWares: MiddleWare[] = [];
                if (middleWares){
                    fullMiddleWares.concat(middleWares);
                }
                if (proto[property].middleWares){
                    fullMiddleWares.concat(proto[property].middleWares);
                }

                const router = new Router();
                logger.info(`add url:${fullPath}`);
                const  asyncMethod = async (context: Context) => {

                    const paramList = proto[property].paramList;
                    const args: any = [];
                    if (paramList) {

                        // 参数绑定
                        const paramKeys = Object.getOwnPropertyNames(paramList);
                        paramKeys.forEach((paramName) => {
                            const index = paramList[paramName];
                            args[index] = paramName === REQUEST_BODY ?
                                JSON.parse(JSON.stringify(context.request.body))
                                : context.query[paramName] || context.params[paramName] ;
                        });
                    }
                    context.body = await proto[property].apply(proto, args);

                };

                // 添加中间件
                if (fullMiddleWares){
                    router.use(...fullMiddleWares);
                }
                router[method](fullPath, asyncMethod);
                this.globalRouter.use(router.routes());
                this.globalRouter.use(router.allowedMethods());
        }
        });

    }

    public listen (port: number){
        this.app.listen(port);
    }

}
