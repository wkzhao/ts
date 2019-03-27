import {Controller, RequestMapping} from '../../decorator/RouterDecrator';
import {LoggerFactory} from '../../util/logger';

const logger = LoggerFactory.getLogger('LeadController');

@Controller()
export default class LeadController {

    @RequestMapping({path: '/lead/get', method: 'get'})
    public async getLead (){
        logger.info('LeadController.getLead');
    }
}
