import {Controller, PathVariable, RequestBody, RequestMapping, RequestParam} from '../decorator/RouterDecrator';
import {LoggerFactory} from '../util/logger';
import {timeCounter} from '../middlewares/TimeCounter';
import {User} from '../domain/User';
import UserService from '../service/UserService';
import {factory, Resource} from '../decorator/Factory';

const logger = LoggerFactory.getLogger('UserController');

// url映射，timeCounter中间件
@Controller('/user', [timeCounter])
export default class UserController {

    @Resource('userService')
    private userService!: UserService;

    @RequestMapping({path: '/get/:id', method: 'get'})
    public async getUser (@PathVariable('id') userId: number){
        return this.userService.getUser(userId);
    }

    @RequestMapping({path: '/add', method: 'post'})
    public async addUer (@RequestParam('operId') operId: number, @RequestBody() user: User){
        logger.info(`UserController.addUer:operId:${operId}`);
        return this.userService.addUser(user);
    }
}
