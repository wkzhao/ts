import {User} from '../domain/User';
import {Repository} from '../decorator/Factory';

@Repository('userDAO')
export default class UserDAO {

    public addUser (user: User): number{
        console.log(user);
        return Math.floor(Math.random() * 100);
    }

    public getUser (id: number): User{
        return {id, name: 'test'};
    }
}
