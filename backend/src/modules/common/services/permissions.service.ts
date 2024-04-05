import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import slugify from "slugify";
import { FilterGrid } from "src/models/grid.model";
import { Permission } from "src/models/permissions.model";
import { conditionWapper } from "src/utils/common.functions";
import { FindManyOptions, Like, Repository } from "typeorm";

@Injectable()
export class PermissionService {
    constructor(@InjectRepository(Permission) private readonly _m_Permission: Repository<Permission>) { }
    async findAndCount(page: number = 1, perPage: number = 10, grid: FilterGrid[],filterParams: { [key:string]: any }): Promise<{ data: Permission[], total: number }> {
        const options: FindManyOptions<Permission> = {
            take: perPage,
            skip: perPage * (page - 1),
        };
        
        delete filterParams.perPage
        delete filterParams.page
        if ( Object.keys(filterParams).length) {
            options.where = {};
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

            if (filterParams.is_active != null) {
                options.where.is_active= filterParams.is_active;
            }
        }
        const [data, total] = await this._m_Permission
            .findAndCount(options);
        return { data, total };
    }

    async findAll(): Promise<Permission[]> {
        return await this._m_Permission.find();
    }

    async findById(id: number): Promise<Permission | null> {
        return await this._m_Permission.findOne({ where: { id: id } });
    }

    async create(permission: Partial<Permission>): Promise<Permission> {
        
        permission.permission_key = slugify(permission.name.toLowerCase(), { lower: true, trim: true })
        const newPermission = this._m_Permission.create(permission);
        return await this._m_Permission.save(newPermission);
    }

    async update(id: number, updatePermissionDto: Partial<Permission>): Promise<Permission | false> {
        const permission = await this._m_Permission.findOne({ where: { id: id } });
        if (!permission) {
            return false;
        }

        Object.assign(permission, updatePermissionDto);
        return await this._m_Permission.save(permission);
    }


    async destroy(id: number) {
        const permission: Permission = await this._m_Permission.findOne({ where: { id: id } });
        return await this._m_Permission.remove(permission)
    }
}