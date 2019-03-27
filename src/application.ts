import Koa, {Context} from 'koa';
import Router from 'koa-router';
import {MiddleWare, REQUEST_BODY} from './decorator/RouterDecrator';
import * as path from 'path';
import * as fs from 'fs';
import bodyParser from 'koa-bodyparser';
import {LoggerFactory} from './util/logger';
import {responseMethod} from './middlewares/ResHandle';

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

        this.loadControllers(path.join(__dirname, './controller'));

        this.app.use(this.globalRouter.routes());
    }

    // 递归加载controller目录下的ts文件
    private loadControllers (filePath: string): void{
        const files = fs.readdirSync(filePath);
        files.forEach((file) => {
            const newFilePath = path.join(filePath, file);
            if (fs.statSync(newFilePath).isDirectory()){
                this.loadControllers(newFilePath);
            }else{
                const controller = require(newFilePath);
                this.registerRouters(controller);
            }
            }
        );
    }

    // 注册路由
    private registerRouters (controller: any): void{
        if (!controller){
            return;
        }

        const proto = controller.default.prototype;
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
                                JSON.parse(JSON.stringify(context.request.body)) : context.query[paramName];
                        });
                    }
                    context.body = await proto[property].apply(proto, args);

                };

                // 添加中间件
                if (middleWares){
                    router.use(...middleWares);
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
