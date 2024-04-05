import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FilterGrid } from "../../../models/grid.model";
import { Repository } from "typeorm";

@Injectable()
export class GlobalService {
    private globalData: any;
    constructor(@InjectRepository(FilterGrid) private readonly _m_FilterGrid: Repository<FilterGrid>) {

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