import {User} from '../domain/User';
import {Resource, Service} from '../decorator/Factory';
import UserDAO from '../dao/UserDAO';

@Service('userService')
export default class UserService {

    @Resource('userDAO')
    private userDAO!: UserDAO;

    public addUser (user: User): number{
        return this.userDAO.addUser(user);
    }

    public getUser (id: number): User{
        return this.userDAO.getUser(id);
    }
}
