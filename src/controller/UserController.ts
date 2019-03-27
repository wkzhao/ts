import {Controller, RequestBody, RequestMapping, RequestParam} from '../decorator/RouterDecrator';
import {LoggerFactory} from '../util/logger';
import {timeCounter} from '../middlewares/TimeCounter';
import {User} from '../domain/User';

const logger = LoggerFactory.getLogger('UserController');

// url映射，timeCounter中间件
@Controller('/user', [timeCounter])
export default class UserController {

    @RequestMapping({path: '/get', method: 'get'})
    public async getUser (@RequestParam('id') userId: number){
        return {id: userId, name: 'test'};
    }

    @RequestMapping({path: '/add', method: 'post'})
    public async addUer (@RequestParam('token') token: string, @RequestBody() user: User){
        logger.info('UserController.addUer');
        return {token, user};
    }
}
