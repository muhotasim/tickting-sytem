import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterGrid } from 'src/models/grid.model';
import { Notification } from 'src/models/notification.model';
import { User } from 'src/models/user.model';
import { conditionWapper } from 'src/utils/common.functions';
import { NotificationInterface, NotificationStatus, NotificationType } from 'src/utils/custome.datatypes';
import { FindManyOptions, Repository } from 'typeorm';

@Injectable()
export class NotificationService {
    constructor(@InjectRepository(Notification) private readonly _notification: Repository<Notification>) { }


    async userNotifications(user_id, limit = 10, type: NotificationType):Promise<Notification[]>{
        const user = new User()
        user.id = user_id
        const notifications = await this._notification.find({ where: { user:  user, type: type}, order: {id: 'DESC'}, take: limit })
        return notifications
    }

    async findAndCount(page: number = 1, perPage: number = 10,grid: FilterGrid[], filterParams: { search?: string, user_id: number }): Promise<{ data: Notification[], total: number }> {
        const options: FindManyOptions<Notification> = {
            take: perPage,
            skip: perPage * (page - 1),
        };
        if (filterParams ) {
            options.where = {};
            
            if(filterParams.user_id){
                let user = new User()
                user.id = Number(filterParams.user_id)
                delete filterParams.user_id;
                options.where['user'] =  user;
            }
            for(let key of Object.keys(filterParams)){
                let gridData = grid.find(g=>g.effect_on==key);
                if(filterParams[key]){
                    if(gridData){
                        options.where[key]=conditionWapper(gridData.condition,filterParams[key])
                    }else{
                        options.where[key]=filterParams[key];
                    }
                }
                
            }
        }
        const [data, total] = await this._notification
            .findAndCount(options);
        return { data, total };
    }

    createBatchNotification(notifications: NotificationInterface<User>[]) {
        const createData = notifications.map(data => this._notification.create(data));
        return this._notification.save(createData);
    }

    async updateNotifications(notificationIds: number[], newData: Partial<Notification>) {
        await this._notification
            .createQueryBuilder()
            .update(Notification)
            .set(newData)
            .whereInIds(notificationIds)
            .execute();
        return true;
    }


}