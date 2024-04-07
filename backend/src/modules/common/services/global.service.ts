import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FilterGrid } from "../../../models/grid.model";
import { Repository } from "typeorm";

export interface GlobalNotification{
    [id:number]: {
        notificationUpdate: boolean;
        ticketUpdate: boolean;
    }
}

@Injectable()
export class GlobalService {
    private globalData: any;
    private globalNotificationService:GlobalNotification = {};
    constructor(@InjectRepository(FilterGrid) private readonly _m_FilterGrid: Repository<FilterGrid>) {

    }

    getNotification(user_id:number){
        const notification = this.globalNotificationService[user_id];
        if(!notification){
            this.globalNotificationService[user_id] = {
                notificationUpdate: true,
                ticketUpdate: true
            }
        }
        return this.globalNotificationService[user_id];
    }
    updatedNotification(user_id: number){
        const notification = this.globalNotificationService[user_id];
        notification.notificationUpdate = false;
        notification.ticketUpdate = false;
    }
    newNotification(user_id: number){
        const notification = this.globalNotificationService[user_id];
        notification.notificationUpdate = true;
        notification.ticketUpdate = true;
    }
    
    newNotificationAdded(user_ids:number[]){
        for(let user_id of user_ids){
            this.updatedNotification(user_id);
        }
    }

    async getGrid() {
        return await this._m_FilterGrid.find({ where: { is_active: true }, order: {order: 'asc'} })
    }
    setGlobalData(data: any) {
        this.globalData = data;
    }

    getGlobalData(key) {
        return this.globalData.filter((d)=>d.for_route == key);
    }
}